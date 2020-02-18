import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import queryString from "query-string";
import classNames from "classnames";
import axios from "axios";
import Player from "./component/Player";
import LoginScreen from "./component/LoginScreen";
import NoStateScreen from "./component/NoStateScreen";

interface Props {
    qs: queryString.ParsedQuery<string>;
}

interface State {
    state: Spotify.PlaybackState | null;
    accessToken: string | null;
    refreshToken: string | null;
    player: Spotify.SpotifyPlayer | null;
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
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

    handleStateChange = (state: Spotify.PlaybackState) => {
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
                getOAuthToken: (cb: (accessToken: string) => void) => {
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

                            if (this.state.accessToken) {
                                console.log(
                                    "新しいアクセストークン: ",
                                    this.state.accessToken
                                );
                                cb(this.state.accessToken);
                            }
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
            player.addListener("initialization_error", (e: Spotify.Error) => {
                alert(e.message);
                location.href = "/";
                console.error(e.message);
            });
            player.addListener("authentication_error", (e: Spotify.Error) => {
                alert(e.message);
                location.href = "/";
                console.error(e.message);
            });
            player.addListener("account_error", (e: Spotify.Error) => {
                alert(e.message);
                location.href = "/";
                console.error(e.message);
            });
            player.addListener("playback_error", (e: Spotify.Error) => {
                alert(e.message);
                location.href = "/";
                console.error(e.message);
            });

            player.addListener(
                "player_state_changed",
                (state: Spotify.PlaybackState) => {
                    this.handleStateChange(state);
                }
            );

            // Ready
            player.on("ready", (deviceId: Spotify.WebPlaybackInstance) => {
                console.log("Ready with Device ID", deviceId);
            });

            // Not Ready
            player.on("not_ready", (deviceId: Spotify.WebPlaybackInstance) => {
                console.log("Device ID has gone offline", deviceId);
            });

            // Connect to the player!
            player.connect();
            this.setState({ player });

            // for debugging
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).player = player;
        };
    };

    render() {
        return (
            <div
                className={classNames(
                    "bg-white",
                    "text-black",
                    "dark-mode:bg-gray-900",
                    "dark-mode:text-gray-200"
                )}
            >
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
            </div>
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
