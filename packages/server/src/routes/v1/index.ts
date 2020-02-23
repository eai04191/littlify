import express from "express";
import axios from "axios";
import querystring from "querystring";
const router = express.Router();

const stateKey = "spotify_auth_state";

const formData = (obj: {[index: string]: string | undefined}) => {
    const data = new URLSearchParams();
    Object.keys(obj).forEach(key => {
        data.append(key, `${obj[key]}`);
    });
    return data;
};

router.get("/", (req, res) => {
    res.send("hi");
});

router.get("/login", (req, res) => {
    const state = req.query.state;
    res.cookie(stateKey, state);

    const scope = ["streaming", "user-read-email", "user-read-private"].join(
        " "
    );

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: scope,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
                state: state,
            })
    );
});

router.get("/callback", (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect(
            `${process.env.CLIENT_URI}/?` +
                querystring.stringify({
                    error: "state_mismatch",
                })
        );
    } else {
        res.clearCookie(stateKey);
        const authData = {
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            grant_type: "authorization_code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        };
        console.log(authData);
        console.log("\nBEFORE REQUEST\n");

        const errRes = (reason: string) => {
            res.redirect(
                `${process.env.CLIENT_URI}/?` +
                querystring.stringify({
                    error: reason,
                })
            );
        };

        axios.post("https://accounts.spotify.com/api/token", formData(authData)).then(response => {
            console.log("request response.status", response.status);
            if (!!response.data && response.status === 200) {
                const body = response.data;
                const accessToken = body.access_token,
                    refreshToken = body.refresh_token;

                // use the access token to access the Spotify Web API
                axios.get("https://api.spotify.com/v1/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => {
                    // NOTE: これログに残すのマズくない？
                    console.log(response.data);
                    // we can also pass the token to the browser to make requests from there
                    res.redirect(
                        `${process.env.CLIENT_URI}/?` +
                        querystring.stringify({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        })
                    );
                }).catch(e => {
                    console.error(e);
                    errRes("malformed_token")
                });
            } else {
                errRes("invalid_token");
            }
        }).catch(e => {
            console.log("request error", e);
            errRes("internal_server_error");
        });
    }
});

router.get("/refresh_token", (req, res) => {
    // requesting access token from refresh token
    const refreshToken = req.query.refresh_token;

    const refreshData = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    };
    axios.post("https://accounts.spotify.com/api/token", formData(refreshData), {
        headers: {
            Authorization:
                "Basic " +
                new Buffer(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString("base64"),
        },
    }).then(response => {
        if (response.status === 200) {
            const body = response.data;
            const accessToken = body.access_token;
            res.send({
                access_token: accessToken,
            });
        } else {
            throw Error("invalid status code");
        }
    }).catch(e => {
        console.error(e);
        res.status(500);
    });
});

export default router;
