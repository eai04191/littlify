import React from "react";
import classNames from "classnames";
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    Sliders,
    Twitter,
} from "react-feather";

import ExternalLink from "./ExternalLink";
import { State as IConfig, Theme } from "./Config";

interface Props {
    state: Spotify.PlaybackState;
    player: Spotify.SpotifyPlayer;
}

export default class Controller extends React.Component<Props, {}> {
    public componentDidMount() {
        window.addEventListener("storage", this.onUpdateConfig);
        this.onUpdateConfig();
    }

    public componentWillUnmount() {
        window.removeEventListener("storage", this.onUpdateConfig);
    }

    private onUpdateConfig() {
        const config: IConfig = JSON.parse(localStorage.config || "{}");

        switch (config.theme) {
            case Theme.DARK:
                document.documentElement.dataset["theme"] = "dark";
                break;
            case Theme.LIGHT:
                document.documentElement.dataset["theme"] = "light";
                break;
            default:
                // REF: https://github.com/ChanceArthur/tailwindcss-dark-mode/blob/master/prefers-dark.js
                if (
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                ) {
                    console.log(
                        "matchmedia:",
                        window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                    );
                    document.documentElement.dataset["theme"] = "dark";
                } else {
                    document.documentElement.dataset["theme"] = "light";
                }
        }
    }

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
                    "dark:bg-gray-800",
                    "dark:border-gray-700"
                )}
            >
                <div
                    className={classNames(
                        "flex-1",
                        "py-4",
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
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
                    <ChevronLeft className={classNames("m-auto")} size={16} />
                </div>
                <div
                    className={classNames(
                        "flex-1",
                        "py-3",
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    onClick={() => {
                        this.props.player?.togglePlay();
                    }}
                >
                    {state.paused ? (
                        <Play
                            className={classNames("m-auto", "filled")}
                            size={20}
                        />
                    ) : (
                        <Pause
                            className={classNames("m-auto", "filled")}
                            size={20}
                        />
                    )}
                </div>
                <div
                    className={classNames(
                        "flex-1",
                        "py-4",
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    onClick={() => {
                        this.props.player?.nextTrack();
                    }}
                >
                    <ChevronRight className={classNames("m-auto")} size={16} />
                </div>
                <div
                    className={classNames(
                        "flex-1",
                        "py-4",
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    onClick={() => {
                        window.open("/config");
                    }}
                >
                    <Sliders
                        className={classNames("m-auto")}
                        size={16}
                    />
                </div>
                <ExternalLink
                    className={classNames(
                        "flex-none",
                        "py-4",
                        "px-8",
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `${track.name}\r\n${track.artists[0].name} - ${track.album.name}\r\nhttps://open.spotify.com/track/${track.id}`
                    )}`}
                >
                    <Twitter
                        className={classNames("m-auto", "filled")}
                        size={16}
                    />
                </ExternalLink>
            </div>
        );
    }
}
