import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretLeft,
    faCaretRight,
    faPlay,
    faPause,
    faSlidersH,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

import MiniTrack from "./MiniTrack";
import SpotifyURILink from "./SpotifyURILink";
import ExternalLink from "./ExternalLink";
import Shortcut from "./shortcut";

interface Props {
    state: Spotify.PlaybackState;
    player: Spotify.SpotifyPlayer | null;
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
        previousTracks.reverse().pop();
        nextTracks.reverse().pop();
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
                            "dark-mode:border-gray-700"
                        )}
                    >
                        <img
                            src={
                                state.track_window.current_track.album.images[2]
                                    .url
                            }
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
                                "dark-mode:bg-gray-900",
                                "dark-mode:text-gray-200"
                            )}
                        >
                            <div className={classNames("font-medium")}>
                                <SpotifyURILink
                                    className={classNames("text-2xl")}
                                    uri={state.track_window.current_track.uri}
                                >
                                    {state.track_window.current_track.name}
                                </SpotifyURILink>
                                <p
                                    className={classNames(
                                        "mt-1",
                                        "text-sm",
                                        "text-gray-700",
                                        "dark-mode:text-gray-500"
                                    )}
                                >
                                    <SpotifyURILink
                                        uri={
                                            state.track_window.current_track
                                                .artists[0].uri
                                        }
                                    >
                                        {
                                            state.track_window.current_track
                                                .artists[0].name
                                        }
                                    </SpotifyURILink>
                                    {" - "}
                                    <SpotifyURILink
                                        uri={
                                            state.track_window.current_track
                                                .album.uri
                                        }
                                    >
                                        {
                                            state.track_window.current_track
                                                .album.name
                                        }
                                    </SpotifyURILink>
                                </p>
                                <p
                                    className={classNames(
                                        "mt-1",
                                        "text-sm",
                                        "text-gray-700",
                                        "dark-mode:text-gray-500"
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
                        <div
                            className={classNames(
                                "controll-column",
                                "flex",
                                "items-center",
                                "text-center",
                                "select-none",
                                "bg-gray-200",
                                "border-t",
                                "dark-mode:bg-gray-800",
                                "dark-mode:border-gray-700"
                            )}
                        >
                            <div
                                className={classNames(
                                    "flex-1",
                                    "py-3",
                                    "hover:text-gray-500",
                                    "dark-mode:hover:text-gray-600"
                                )}
                                onClick={async () => {
                                    const currentState =
                                        (await this.props.player?.getCurrentState()) ||
                                        null;
                                    if (
                                        currentState &&
                                        currentState.position < 5000
                                    ) {
                                        this.props.player?.previousTrack();
                                    }
                                    this.props.player?.seek(0);
                                }}
                            >
                                <FontAwesomeIcon icon={faCaretLeft} />
                            </div>
                            <div
                                className={classNames(
                                    "flex-1",
                                    "py-3",
                                    "hover:text-gray-500",
                                    "dark-mode:hover:text-gray-600"
                                )}
                                onClick={() => {
                                    this.props.player?.togglePlay();
                                }}
                            >
                                {state.paused ? (
                                    <FontAwesomeIcon icon={faPlay} />
                                ) : (
                                    <FontAwesomeIcon icon={faPause} />
                                )}
                            </div>
                            <div
                                className={classNames(
                                    "flex-1",
                                    "py-3",
                                    "hover:text-gray-500",
                                    "dark-mode:hover:text-gray-600"
                                )}
                                onClick={() => {
                                    this.props.player?.nextTrack();
                                }}
                            >
                                <FontAwesomeIcon icon={faCaretRight} />
                            </div>
                            <div
                                className={classNames(
                                    "flex-1",
                                    "py-3",
                                    "hover:text-gray-500",
                                    "dark-mode:hover:text-gray-600"
                                )}
                            >
                                <FontAwesomeIcon icon={faSlidersH} />
                            </div>
                            <ExternalLink
                                className={classNames(
                                    "flex-none",
                                    "py-3",
                                    "px-8",
                                    "hover:text-gray-500",
                                    "dark-mode:hover:text-gray-600"
                                )}
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                    `${track.name}\r\n${track.artists[0].name} - ${track.album.name}\r\nhttps://open.spotify.com/track/${track.id}`
                                )}`}
                            >
                                <FontAwesomeIcon icon={faTwitter} />
                            </ExternalLink>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "queue-column",
                            "flex",
                            "flex-col",
                            "w-1/4",
                            "border-l",
                            "dark-mode:border-gray-700"
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
