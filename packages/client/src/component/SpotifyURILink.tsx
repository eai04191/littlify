import React from "react";

interface Props {
    uri: string;
    title?: string;
    className?: string;
}

export default class SpotifyURILink extends React.Component<Props, {}> {
    render() {
        return (
            <a
                href={this.props.uri}
                title={this.props.title}
                className={this.props.className}
                target="_blank"
                rel="noreferrer noopener"
            >
                {this.props.children}
            </a>
        );
    }
}
