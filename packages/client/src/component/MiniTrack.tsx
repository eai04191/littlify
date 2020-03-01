import React from "react";
import classNames from "classnames";

import Artists from "./Artists";

interface Props {
    track: SpotifyState.Track;
}

export default class MiniTrack extends React.Component<Props, {}> {
    render() {
        return (
            <div className={classNames("flex", "h-12")}>
                <img
                    src={this.props.track.album.images[1].url}
                    className={classNames("h-full", "flex-grow-0")}
                />
                <div className={classNames("ml-2", "truncate", "w-full")}>
                    <div className={classNames()}>{this.props.track.name}</div>
                    <div
                        className={classNames(
                            "text-sm",
                            "text-gray-700",
                            "dark:text-gray-500"
                        )}
                    >
                        <Artists artists={this.props.track.artists} /> -{" "}
                        {this.props.track.album.name}
                    </div>
                </div>
            </div>
        );
    }
}
