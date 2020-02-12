import express = require("express");
import request = require("request");
import querystring = require("querystring");
import cookieParser = require("cookie-parser");
const router = express.Router();

const stateKey = "spotify_auth_state";

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
                state: state
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
                    error: "state_mismatch"
                })
        );
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                code: code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
                grant_type: "authorization_code",
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            },
            json: true
        };

        console.log(authOptions);
        console.log("\nBEFORE REQUEST\n");

        request.post(authOptions, function(error, response, body) {
            console.log("request error", error);
            console.log("request response.statusCode", response.statusCode);
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token,
                    refresh_token = body.refresh_token;

                const options = {
                    url: "https://api.spotify.com/v1/me",
                    headers: { Authorization: "Bearer " + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect(
                    `${process.env.CLIENT_URI}/?` +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token
                        })
                );
            } else {
                res.redirect(
                    `${process.env.CLIENT_URI}/?` +
                        querystring.stringify({
                            error: "invalid_token"
                        })
                );
            }
        });
    }
});

router.get("/refresh_token", (req, res) => {
    // requesting access token from refresh token
    const refresh_token = req.query.refresh_token;
    const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
            Authorization:
                "Basic " +
                new Buffer(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString("base64")
        },
        form: {
            grant_type: "refresh_token",
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                access_token: access_token
            });
        }
    });
});

export default router;
