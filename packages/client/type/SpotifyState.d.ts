declare module SpotifyState {
    export interface Metadata {
        context_description: string;
    }
    export interface Context {
        uri: string;
        metadata: Metadata;
    }
    export interface LinkedFrom {
        uri?: any;
        id?: any;
    }
    export interface Artist {
        name: string;
        uri: string;
    }
    export interface Image {
        url: string;
        height: number;
        width: number;
    }
    export interface Album {
        uri: string;
        name: string;
        images: Image[];
    }
    export interface Track {
        id: string;
        uri: string;
        type: string;
        linked_from_uri?: any;
        linked_from: LinkedFrom;
        media_type: string;
        name: string;
        duration_ms: number;
        artists: Artist[];
        album: Album;
        is_playable: boolean;
    }
    export interface LinkedFrom2 {
        uri?: any;
        id?: any;
    }
    export interface Artist2 {
        name: string;
        uri: string;
    }
    export interface Image2 {
        url: string;
        height: number;
        width: number;
    }
    export interface Album2 {
        uri: string;
        name: string;
        images: Image2[];
    }
    export interface LinkedFrom3 {
        uri?: any;
        id?: any;
    }
    export interface Artist3 {
        name: string;
        uri: string;
    }
    export interface Image3 {
        url: string;
        height: number;
        width: number;
    }
    export interface Album3 {
        uri: string;
        name: string;
        images: Image3[];
    }
    export interface TrackWindow {
        current_track: Track;
        next_tracks: Track[];
        previous_tracks: Track[];
    }
    export interface Restrictions {
        disallow_pausing_reasons: string[];
    }
    export interface Disallows {
        pausing: boolean;
    }
    export interface RootObject {
        context: Context;
        bitrate: number;
        position: number;
        duration: number;
        paused: boolean;
        shuffle: boolean;
        repeat_mode: number;
        track_window: TrackWindow;
        timestamp: number;
        restrictions: Restrictions;
        disallows: Disallows;
    }
}
