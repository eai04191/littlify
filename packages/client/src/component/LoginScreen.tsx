import React from "react";
import SpotifyLoginButton from "./SpotifyLoginButton";

export default class LoginScreen extends React.Component {
    render() {
        return (
            <>
                <p>ログインが必要です</p>
                <SpotifyLoginButton />
            </>
        );
    }
}
