import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import queryString from "query-string";

import axios from "axios";
import Player from "./component/Player";
import LoginScreen from "./component/LoginScreen";
import NoState from "./component/NoState";

//@ts-ignore
import findConfig from "find-config";
import { config } from "dotenv";

config({ path: findConfig(".env") });

interface Props {
    qs: queryString.ParsedQuery<string>;
}

interface State {
    state: SpotifyState.RootObject | null;
}

class App extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            state: null
        };
    }

    componentWillMount = () => {
        console.log(this.props.qs);
    };

    handleStateChange = (state: any) => {
        console.log(state);
        this.setState({
            state: state
        });
    };
    render() {
        return (
            <>
                {this.props.qs.access_token ? (
                    this.state.state ? (
                        <Player state={this.state.state} />
                    ) : (
                        <>
                            {
                                //@ts-ignore
                                (window.onSpotifyWebPlaybackSDKReady = () => {
                                    const token = this.props.qs.access_token;
                                    //@ts-ignore
                                    const player = new Spotify.Player({
                                        name: "Littlify",
                                        volume: 0.15,
                                        //@ts-ignore
                                        getOAuthToken: cb => {
                                            cb(token);
                                        }
                                    });
                                    // Error handling
                                    player.addListener(
                                        "initialization_error",
                                        //@ts-ignore
                                        ({ message }) => {
                                            alert(message);
                                            location.href = "/";
                                            console.error(message);
                                        }
                                    );
                                    player.addListener(
                                        "authentication_error",
                                        //@ts-ignore
                                        ({ message }) => {
                                            alert(message);
                                            location.href = "/";
                                            console.error(message);
                                        }
                                    );
                                    player.addListener(
                                        "account_error",
                                        //@ts-ignore
                                        ({ message }) => {
                                            alert(message);
                                            location.href = "/";
                                            console.error(message);
                                        }
                                    );
                                    player.addListener(
                                        "playback_error",
                                        //@ts-ignore
                                        ({ message }) => {
                                            alert(message);
                                            location.href = "/";
                                            console.error(message);
                                        }
                                    );

                                    player.addListener(
                                        "player_state_changed",
                                        //@ts-ignore
                                        state => {
                                            this.handleStateChange(state);
                                        }
                                    );

                                    // Ready
                                    player.addListener(
                                        "ready",
                                        //@ts-ignore
                                        ({ device_id }) => {
                                            console.log(
                                                "Ready with Device ID",
                                                device_id
                                            );
                                        }
                                    );

                                    // Not Ready
                                    player.addListener(
                                        "not_ready",
                                        //@ts-ignore
                                        ({ device_id }) => {
                                            console.log(
                                                "Device ID has gone offline",
                                                device_id
                                            );
                                        }
                                    );

                                    // Connect to the player!
                                    player.connect();
                                })
                            }
                            <NoState />
                        </>
                    )
                ) : (
                    <>
                        <LoginScreen />
                    </>
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
