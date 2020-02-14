import React from "react";

interface Props {
    href: string;
    title?: string;
    className?: string;
}

export default class ExternalLink extends React.Component<Props, {}> {
    render() {
        return (
            <a
                href={this.props.href}
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
