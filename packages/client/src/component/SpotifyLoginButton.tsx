import React from "react";
import classNames from "classnames";

export default class SpotifyLoginButton extends React.Component {
    render() {
        return (
            <>
                <a
                    href="http://localhost:3000/v1/login?state=hogehoge"
                    className={classNames(
                        "text-white",
                        "rounded-full",
                        "px-10",
                        "py-5",
                        "font-bold",
                        "bg-spotify-green",
                        "hover:bg-spotify-green-light",
                        "transition-colors",
                        "duration-300"
                    )}
                >
                    Login with Spotify
                </a>
            </>
        );
    }
}
