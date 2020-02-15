import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import queryString from "query-string";

import axios from "axios";
import Player from "./component/Player";
import LoginScreen from "./component/LoginScreen";
import NoStateScreen from "./component/NoStateScreen";

interface Props {
    qs: queryString.ParsedQuery<string>;
}

interface State {
    state: SpotifyState.RootObject | null;
    accessToken: string | null;
    refreshToken: string | null;
    player: any;
}

class App extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            state: null,
            accessToken: this.props.qs.access_token?.toString() || null,
            refreshToken: this.props.qs.refresh_token?.toString() || null,
            player: null,
        };
    }

    UNSAFE_componentWillMount = () => {
        console.log(this.props.qs);
    };

    handleStateChange = (state: any) => {
        console.log(state);
        this.setState({
            state: state,
        });
    };

    injectSpotifyEvents = ({ refreshToken }: { refreshToken: string }) => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new Spotify.Player({
                name: "Littlify",
                volume: 0.15,
                getOAuthToken: (cb: (arg0: string | null) => void) => {
                    console.log("新しいアクセストークン取るよ");
                    axios
                        .get(`${process.env.SERVER_URI}/v1/refresh_token`, {
                            params: { refresh_token: refreshToken },
                        })
                        .then(res => {
                            if (!res.data.access_token) {
                                throw Error(
                                    "res.data.access_token is notfound"
                                );
                            }
                            this.setState({
                                accessToken: res.data.access_token,
                            });
                            console.log(
                                "新しいアクセストークン: ",
                                this.state.accessToken
                            );
                            cb(this.state.accessToken);
                        })
                        .catch(error =>
                            console.log(
                                "新しいアクセストークンの取得中にエラー",
                                error
                            )
                        );
                },
            });
            // Error handling
            player.addListener("initialization_error", ({ message }) => {
                alert(message);
                location.href = "/";
                console.error(message);
            });
            player.addListener("authentication_error", ({ message }) => {
                alert(message);
                location.href = "/";
                console.error(message);
            });
            player.addListener("account_error", ({ message }) => {
                alert(message);
                location.href = "/";
                console.error(message);
            });
            player.addListener("playback_error", ({ message }) => {
                alert(message);
                location.href = "/";
                console.error(message);
            });

            player.addListener("player_state_changed", state => {
                this.handleStateChange(state);
            });

            // Ready
            player.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
            });

            // Not Ready
            player.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            // Connect to the player!
            player.connect();
            this.setState({ player });

            // for debugging
            (window as any).player = player;
        };
    };

    render() {
        return (
            <>
                {this.state.refreshToken &&
                    this.injectSpotifyEvents({
                        refreshToken: this.state.refreshToken,
                    })}

                {this.state.accessToken ? (
                    this.state.state ? (
                        <Player
                            state={this.state.state}
                            player={this.state.player}
                        />
                    ) : (
                        <NoStateScreen />
                    )
                ) : (
                    <LoginScreen />
                )}
            </>
        );
    }
}

ReactDOM.render(
    <Router>
        <Route
            render={props => (
                <App qs={queryString.parse(props.location.search)} />
            )}
        />
    </Router>,
    document.getElementById("root")
);
