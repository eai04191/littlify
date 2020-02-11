# littlify
Little Spotify Controller

## Self-Build Usage

requirements
```
node
yarn
```

1. `.env.example`をコピーして`.env`を作成する。
2. `.env`を書き換える

    `SPOTIFY_CLIENT_ID`と`SPOTIFY_CLIENT_SECRET`は https://developer.spotify.com/dashboard/applications から取得できます

    **Note:**  `SPOTIFY_REDIRECT_URI`と同じURIをアプリケーションの **Redirect URIs**に入れないとログイン時にエラーになります。


インストール
```bash
yarn
```

起動
```bash
yarn server:start
yarn client:start
```



