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

interface Props {
    state: SpotifyState.RootObject;
}

export default class Player extends React.Component<Props, {}> {
    render() {
        const title = this.props.state.track_window.current_track.name;
        const jacket = this.props.state.track_window.current_track.album
            .images[0].url;
        const artist = this.props.state.track_window.current_track.artists[0]
            .name;
        const album = this.props.state.track_window.current_track.album.name;
        const nextTracks = this.props.state.track_window.next_tracks;
        const previousTracks = this.props.state.track_window.previous_tracks;
        previousTracks.reverse().pop();
        return (
            <>
                <div className={classNames("flex")}>
                    <div className={classNames("flex-grow-0", "flex-shrink-0")}>
                        <img src={jacket} className={classNames("h-screen")} />
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
                                <p className={classNames("text-2xl")}>
                                    {title}
                                </p>
                                <p
                                    className={classNames(
                                        "mt-1",
                                        "text-sm",
                                        "text-gray-700"
                                    )}
                                >
                                    {artist} - {album}
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
                        {previousTracks.concat(nextTracks).map(track => {
                            return <MiniTrack track={track} />;
                        })}
                    </div>
                </div>
            </>
        );
    }
}
