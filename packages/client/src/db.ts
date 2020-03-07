import PouchDB from "pouchdb";
import FindPlugin from "pouchdb-find";

class DbBase<T> {
    protected db: PouchDB.Database<T>;
    constructor(name: string) {
        PouchDB.plugin(FindPlugin);
        this.db = new PouchDB<T>(name);
    }
}

export enum DisLikeType {
    TRACK = "TRACK",
    // TODO: アルバム全体とか、アーティスト全体とか
}

export interface DisLikeI {
    uri: string;
    type: DisLikeType;
    name: string;
}

export class DisLike extends DbBase<DisLikeI> {
    constructor() {
        super("dislike");
        this.db.createIndex({
            index: {
                fields: ["uri"],
            },
        });
        this.db.createIndex({
            index: {
                fields: ["type"],
            },
        });
    }

    public async set(type: DisLikeType, track: Spotify.Track) {
        switch (type) {
            case DisLikeType.TRACK:
                if (!(await this.isDisLike(track, type))) {
                    await this.addDisLike(type, track.uri, track.name);
                }
                break;
        }
    }

    public async unset(type: DisLikeType, track: Spotify.Track): Promise<void>;
    public async unset(type: DisLikeType, uri: string): Promise<void>;
    public async unset(type: DisLikeType, trackOrUri: Spotify.Track | string) {
        let uri;
        if (typeof trackOrUri === typeof "") {
            uri = trackOrUri as string;
        } else {
            uri = (trackOrUri as Spotify.Track).uri;
        }
        switch (type) {
            case DisLikeType.TRACK:
                await this.removeDisLike(uri);
                break;
        }
    }

    public async isDisLike(track: Spotify.Track, type?: DisLikeType) {
        const selector: PouchDB.Find.Selector = {};
        switch (type) {
            case DisLikeType.TRACK:
                selector.uri = track.uri;
                break;
            default:
                selector.$or = [
                    { uri: track.uri },
                    { uri: track.album.uri },
                    ...track.artists.map(artist => ({ uri: artist.uri })),
                ];
                break;
        }
        const result = await this.db.find({
            selector,
        });
        return result.docs.length > 0;
    }

    public async find(limit = 10, page = 1, name?: string, type?: DisLikeType) {
        let nameCriteria;
        if (name && name !== "") {
            nameCriteria = {
                name: {
                    $regex: `.*${name}.*`,
                },
            };
        }
        let typeCriteria;
        if (type) {
            typeCriteria = {
                type,
            };
        }

        let selector: PouchDB.Find.Selector = {};
        if (nameCriteria && typeCriteria) {
            selector.$or = [{ ...nameCriteria }, { ...typeCriteria }];
        } else {
            selector = nameCriteria || typeCriteria || {};
        }

        const result = await this.db.find({
            selector,
            limit,
            skip: limit * (page - 1),
        });
        console.log(result.docs);
        return result.docs;
    }

    private async addDisLike(type: DisLikeType, uri: string, name: string) {
        return this.db.post({
            type,
            uri,
            name,
        });
    }

    private async removeDisLike(uri: string) {
        const result = await this.db.find({
            selector: {
                uri,
            },
        });
        if (result.docs.length !== 1) {
            return null;
        }
        const doc = result.docs[0];
        return this.db.remove(doc._id, doc._rev);
    }
}
