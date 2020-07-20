import React from "react";

import SpotifyURILink from "./SpotifyURILink";

interface Props {
    artists: Spotify.Artist[];
}

export default class Artists extends React.Component<
    Props,
    Record<string, unknown>
> {
    render(): React.ReactNode {
        return this.props.artists
            .map<React.ReactNode>((artist) => (
                <SpotifyURILink key={artist.uri} uri={artist.uri}>
                    {artist.name}
                </SpotifyURILink>
            ))
            .reduce((acc, cur) => [acc, ", ", cur]);
    }
}
