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

import ExternalLink from "./ExternalLink";
import { Event } from "./Config";

interface Props {
    state: Spotify.PlaybackState;
    player: Spotify.SpotifyPlayer;
}

export default class Controller extends React.Component<Props, {}> {
    render() {
        const state = this.props.state;
        const track = state.track_window.current_track;
        return (
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
                            (await this.props.player.getCurrentState()) || null;
                        if (currentState && currentState.position < 5000) {
                            this.props.player.previousTrack();
                        }
                        this.props.player.seek(0);
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
                    onClick={() => {
                        const w = window.open("/config");
                        if (w) {
                            w.onmessage = event => {
                                if (event.data.type !== "littlify_config") {
                                    return;
                                }
                                console.log("onmessage:", event.data);
                                switch (event.data.event) {
                                    case Event.OPEN_SYN: {
                                        let config = {};
                                        try {
                                            config = JSON.parse(
                                                localStorage.config
                                            );
                                        } catch (e) {
                                            console.error(e);
                                        }

                                        w.postMessage(
                                            {
                                                type: "littlify_config",
                                                event: Event.OPEN_ACK,
                                                payload: config || {},
                                            },
                                            window.origin
                                        );
                                        break;
                                    }
                                    case Event.CLOSE_SYN: {
                                        localStorage.config = JSON.stringify(
                                            event.data.payload
                                        );
                                        w.postMessage(
                                            {
                                                type: "littlify_config",
                                                event: Event.CLOSE_ACK,
                                            },
                                            window.origin
                                        );
                                    }
                                }
                            };
                        }
                    }}
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
        );
    }
}
