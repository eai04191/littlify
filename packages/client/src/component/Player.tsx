import React from "react";
import classNames from "classnames";

import MiniTrack from "./MiniTrack";
import SpotifyURILink from "./SpotifyURILink";
import Shortcut from "./shortcut";
import Controller from "./Controller";
import Artists from "./Artists";

interface Props {
    state: Spotify.PlaybackState;
    player: Spotify.SpotifyPlayer;
}

export default class Player extends React.Component<Props, {}> {
    shortcut = new Shortcut(this.props.player);

    componentDidMount(): void {
        this.shortcut.enable();
    }

    componentWillUnmount(): void {
        this.shortcut.disable();
    }

    render() {
        const state = this.props.state;
        const track = state.track_window.current_track;
        const nextTracks = state.track_window.next_tracks;
        const previousTracks = state.track_window.previous_tracks;
        previousTracks.shift();
        nextTracks.pop();
        return (
            <>
                <div className={classNames("flex", "border-gray-400")}>
                    <div
                        className={classNames(
                            "jucket-column",
                            "flex",
                            "h-screen",
                            "flex-grow-0",
                            "flex-shrink-0",
                            "border-r",
                            "dark:border-gray-700"
                        )}
                    >
                        <img
                            src={track.album.images[2].url}
                            className={classNames(
                                "self-center",
                                "h-screen",
                                "max-w-screen-1/2",
                                "max-h-screen-w-1/2"
                            )}
                        />
                    </div>
                    <div
                        className={classNames(
                            "track-column",
                            "flex-1",
                            "flex",
                            "flex-col",
                            "w-full"
                        )}
                    >
                        <div
                            className={classNames(
                                "flex-1",
                                "flex",
                                "items-center",
                                "pl-8",
                                "text-gray-900",
                                "bg-white",
                                "dark:bg-gray-900",
                                "dark:text-gray-200"
                            )}
                        >
                            <div className={classNames("font-medium")}>
                                <SpotifyURILink
                                    className={classNames("text-2xl")}
                                    uri={track.uri}
                                >
                                    {track.name}
                                </SpotifyURILink>
                                <p
                                    className={classNames(
                                        "mt-1",
                                        "text-sm",
                                        "text-gray-700",
                                        "dark:text-gray-500"
                                    )}
                                >
                                    <Artists artists={track.artists} />
                                    {" - "}
                                    <SpotifyURILink uri={track.album.uri}>
                                        {track.album.name}
                                    </SpotifyURILink>
                                </p>
                                <p
                                    className={classNames(
                                        "mt-1",
                                        "text-sm",
                                        "text-gray-700",
                                        "dark:text-gray-500"
                                    )}
                                >
                                    <SpotifyURILink
                                        uri={state.context.uri || "#"}
                                    >
                                        {
                                            state.context.metadata
                                                .context_description
                                        }
                                    </SpotifyURILink>
                                </p>
                            </div>
                        </div>
                        <Controller
                            state={{ ...this.props.state }}
                            player={this.props.player}
                        />
                    </div>
                    <div
                        className={classNames(
                            "queue-column",
                            "flex",
                            "flex-col",
                            "w-1/4",
                            "border-l",
                            "dark:border-gray-700"
                        )}
                    >
                        <p>前のトラック</p>
                        {previousTracks.map((track, index) => {
                            return <MiniTrack track={track} key={index} />;
                        })}
                        <p>次のトラック</p>
                        {nextTracks.map((track, index) => {
                            return <MiniTrack track={track} key={index} />;
                        })}
                    </div>
                </div>
            </>
        );
    }
}
