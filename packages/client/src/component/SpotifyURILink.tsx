import React from "react";
import classNames from "classnames";

interface Props {
    uri: string;
    title?: string;
    className?: string;
}

export default class SpotifyURILink extends React.Component<
    Props,
    Record<string, unknown>
> {
    render(): JSX.Element {
        return (
            <a
                href={this.props.uri}
                title={this.props.title}
                className={classNames(this.props.className, "hover:underline")}
                target="_blank"
                rel="noreferrer noopener"
            >
                {this.props.children}
            </a>
        );
    }
}
