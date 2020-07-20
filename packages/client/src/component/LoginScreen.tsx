import React from "react";
import SpotifyLoginButton from "./SpotifyLoginButton";
import ExternalLink from "./ExternalLink";
import classNames from "classnames";

export default class LoginScreen extends React.Component {
    render(): JSX.Element {
        return (
            <>
                <h1>Littlify</h1>
                <p>ベータ版です！！！！！機能は全然ありません！！！！！！</p>
                <p>
                    ソースコード・説明:{" "}
                    <ExternalLink
                        href="https://github.com/eai04191/littlify"
                        className={classNames("text-blue-500")}
                    >
                        https://github.com/eai04191/littlify
                    </ExternalLink>
                </p>

                <SpotifyLoginButton />
            </>
        );
    }
}
