import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretLeft,
    faCaretRight,
    faPlay,
    faPause,
    faSlidersH
} from "@fortawesome/free-solid-svg-icons";

import MiniTrack from "./MiniTrack";
import SpotifyURILink from "./SpotifyURILink";

interface Props {
    state: SpotifyState.RootObject;
}

export default class Player extends React.Component<Props, {}> {
    render() {
        const state = this.props.state;
        const nextTracks = state.track_window.next_tracks;
        const previousTracks = state.track_window.previous_tracks;
        previousTracks.reverse().pop();
        nextTracks.reverse().pop();
        return (
            <>
                <div className={classNames("flex")}>
                    <div className={classNames("flex-grow-0", "flex-shrink-0")}>
                        <img
                            src={
                                state.track_window.current_track.album.images[2]
                                    .url
                            }
                            className={classNames("h-screen")}
                        />
                    </div>
                    <div
                        className={classNames(
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
                                "p-8",
                                "text-gray-900",
                                "bg-white"
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
                                        "text-gray-700"
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
                                        "text-gray-700"
                                    )}
                                >
                                    <SpotifyURILink uri={state.context.uri}>
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
                                "flex",
                                "items-center",
                                "text-center",
                                "select-none",
                                "bg-gray-200"
                            )}
                        >
                            <div
                                className={classNames(
                                    "flex-1",
                                    "py-3",
                                    "hover:text-gray-500"
                                )}
                            >
                                <FontAwesomeIcon icon={faCaretLeft} />
                            </div>
                            <div
                                className={classNames(
                                    "flex-1",
                                    "py-3",
                                    "hover:text-gray-500"
                                )}
                            >
                                <FontAwesomeIcon icon={faPlay} />
                            </div>
                            <div
                                className={classNames(
                                    "flex-1",
                                    "py-3",
                                    "hover:text-gray-500"
                                )}
                            >
                                <FontAwesomeIcon icon={faCaretRight} />
                            </div>
                            <div
                                className={classNames(
                                    "flex-1",
                                    "py-3",
                                    "hover:text-gray-500"
                                )}
                            >
                                <FontAwesomeIcon icon={faSlidersH} />
                            </div>
                        </div>
                    </div>
                    <div className={classNames("flex", "flex-col", "w-1/4")}>
                        <p>前のトラック</p>
                        {previousTracks.map(track => {
                            return <MiniTrack track={track} />;
                        })}
                        <p>次のトラック</p>
                        {nextTracks.map(track => {
                            return <MiniTrack track={track} />;
                        })}
                    </div>
                </div>
            </>
        );
    }
}
