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
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

import MiniTrack from "./MiniTrack";
import SpotifyURILink from "./SpotifyURILink";
import ExternalLink from "./ExternalLink";

interface Props {
    state: SpotifyState.RootObject;
    player: any;
}

interface State {
    calculatedPosition: number;
    updatedPosition: number;
    onSeek: boolean;
}

export default class Player extends React.Component<Props, State> {
    private intervalHandler?: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            calculatedPosition: 0,
            updatedPosition: 0,
            onSeek: false,
        };
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
        if (this.props.state.paused || this.state.onSeek) {
            this.stopSeekBar();
        } else if (!this.props.state.paused && !this.intervalHandler) {
            this.startSeekBar();
        } else {
            // たぶん30秒ごとに飛んでくるstateで補正
            // REF: https://github.com/spotify/web-playback-sdk/issues/86
            let {calculatedPosition, updatedPosition} = this.state;
            if (this.props.state.position !== updatedPosition) {
                updatedPosition = this.props.state.position;
                calculatedPosition = this.props.state.position;
                this.setState({
                    calculatedPosition,
                    updatedPosition,
                });
            }
        }
    }

    private stopSeekBar() {
        clearInterval(this.intervalHandler);
        this.intervalHandler = undefined;
    }

    private startSeekBar() {
        const interval = 500;

        this.intervalHandler = setInterval(() => {
            let {calculatedPosition, updatedPosition} = this.state;
            if (this.props.state.position !== updatedPosition) {
                updatedPosition = this.props.state.position;
                calculatedPosition = this.props.state.position;
            } else {
                calculatedPosition += interval;
            }

            this.setState({
                calculatedPosition,
                updatedPosition,
            });
        }, interval);
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
                            "border-r"
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
                        <input
                            id={"player-seekbar"}
                            type="range"
                            min="0"
                            max={state.duration}
                            value={this.state.calculatedPosition}
                            onMouseDown={(e) => {
                                this.setState({
                                    onSeek: true,
                                });
                            }}
                            onChange={(e) => {
                                this.setState({
                                    calculatedPosition: parseInt(e.currentTarget.value, 10),
                                });
                            }}
                            onMouseUp={(e) => {
                                this.props.player?.seek(e.currentTarget.value);
                                this.setState({
                                    onSeek: false,
                                })
                            }}
                        />
                        <div
                            className={classNames(
                                "controll-column",
                                "flex",
                                "items-center",
                                "text-center",
                                "select-none",
                                "bg-gray-200",
                                "border-t"
                            )}
                        >
                            <div
                                className={classNames(
                                    "flex-1",
                                    "py-3",
                                    "hover:text-gray-500"
                                )}
                                onClick={async () => {
                                    const currentState = await this.props.player?.getCurrentState() || {};
                                    if (currentState.position < 5000) {
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
                                    "hover:text-gray-500"
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
                                    "hover:text-gray-500"
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
                                    "hover:text-gray-500"
                                )}
                            >
                                <FontAwesomeIcon icon={faSlidersH} />
                            </div>
                            <ExternalLink
                                className={classNames(
                                    "flex-none",
                                    "py-3",
                                    "px-8",
                                    "hover:text-gray-500"
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
                            "border-l"
                        )}
                    >
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
