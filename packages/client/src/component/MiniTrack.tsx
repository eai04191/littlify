import React from "react";
import classNames from "classnames";

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
                    <div className={classNames("text-sm", "text-gray-700")}>
                        {this.props.track.artists[0].name} -
                        {this.props.track.album.name}
                    </div>
                </div>
            </div>
        );
    }
}
