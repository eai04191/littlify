import express from "express";
import helmet from "helmet";
import cors from "cors";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
import router from "./routes/v1";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: require("find-config")(".env") });

const app = express();

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.error(
        "env.SPOTIFY_CLIENT_ID or env.SPOTIFY_CLIENT_SECRET is not set!"
    );
    process.exit(1);
}

app.use(helmet())
    .use(cors())
    .use(cookieParser())
    .use(express.urlencoded({ extended: true }))
    .use("/.netlify/functions/index/v1", router);

app.get("/", function (_req, res) {
    res.redirect(301, "https://github.com/eai04191/littlify");
});

export default app;
exports.handler = serverless(app);
