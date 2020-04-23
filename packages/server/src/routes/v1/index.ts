import express from "express";
import axios from "axios";
import querystring from "querystring";
const router = express.Router();

const stateKey = "littlify_auth_state";

const formData = (obj: { [index: string]: string | undefined }) => {
    const data = new URLSearchParams();
    Object.keys(obj).forEach(key => {
        data.append(key, `${obj[key]}`);
    });
    return data;
};

router.get("/login", (req, res) => {
    const state = req.query.state;
    res.cookie(stateKey, state);

    const scope = [
        "streaming",
        "user-read-email",
        "user-read-private",
        "user-modify-playback-state",
    ].join(" ");

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
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    const errRes = (reason: string) => {
        res.redirect(
            `${process.env.CLIENT_URI}/?` +
                querystring.stringify({
                    error: reason,
                })
        );
    };

    if (state === null || state !== storedState) {
        errRes("state_mismatch");
    }
    res.clearCookie(stateKey);

    const authData = {
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    };

    axios
        .post("https://accounts.spotify.com/api/token", formData(authData))
        .then(response => {
            if (!!response.data && response.status === 200) {
                const body = response.data;
                const accessToken = body.access_token,
                    refreshToken = body.refresh_token;

                // use the access token to access the Spotify Web API
                axios
                    .get("https://api.spotify.com/v1/me", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                    .then(() => {
                        res.redirect(
                            `${process.env.CLIENT_URI}/?` +
                                querystring.stringify({
                                    access_token: accessToken,
                                    refresh_token: refreshToken,
                                })
                        );
                    })
                    .catch(e => {
                        console.error(e);
                        errRes("malformed_token");
                    });
            } else {
                errRes("invalid_token");
            }
        })
        .catch(e => {
            console.log("request error", e);
            errRes("internal_server_error");
        });
});

router.get("/refresh_token", (req, res) => {
    // requesting access token from refresh token
    const refreshToken = req.query.refresh_token;

    const refreshData = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    };
    axios
        .post("https://accounts.spotify.com/api/token", formData(refreshData), {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    ).toString("base64"),
            },
        })
        .then(response => {
            if (response.status === 200) {
                const body = response.data;
                const accessToken = body.access_token;
                res.send({
                    access_token: accessToken,
                });
            } else {
                throw Error("invalid status code");
            }
        })
        .catch(e => {
            console.error(e);
            res.status(500);
        });
});

export default router;
