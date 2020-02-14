<div align="center">
<img src="https://raw.githubusercontent.com/eai04191/littlify/doc/logo-256.png" width="150px"><br>

# Littlify

</div>

Little Spotify Controller

## Motivation

<div align="center">
<img src="https://raw.githubusercontent.com/eai04191/littlify/doc/screenshot.png">
</div>

VSCodeなど使っている間に、今流れている曲が気になってSpotifyクライアントを見に行くことが多かった。

見に行くのがめんどくさいので何を流しているかを常に表示したかったが、Spotifyクライアントのウィンドウは一定以下の多きさにならないので、邪魔だった。

そういうわけでコンパクトな今流れている曲を教えてくれるものが欲しかった。

## Feature

- コンパクト（800x200を想定）なSpotifyコントローラー
- NowPlayingツイート

### 追加予定の機能

- Littlifyで再生していないときも表示
- Like
- 曲名、アーティスト名一発検索
- Musixmatchで歌詞表示
- カスタムCSS


## Try now

**https://littlify.web.app/**

**Spotify Premiumのアカウントが必要です。**

常用する際は、Chromeアプリとして開くのがおすすめです。`chrome --app=https://littlify.web.app/`

PWAにも対応しています。

![](https://raw.githubusercontent.com/eai04191/littlify/doc/pwa-install.png)

## FAQ

### なぜSpotifyプレミアムが必要なの？

Spotifyの制約です。Web Playback SDKには有効なSpotify Premiumサブスクリプションが必要です。

https://developer.spotify.com/documentation/web-playback-sdk/#requirements

### なぜアプリの認証時、メールアドレスや他のデバイスをコントロールする権限を要求するの？

Spotifyの制約です。Web Playback SDKは`["streaming", "user-read-email", "user-read-private"]`を要求します。

https://developer.spotify.com/documentation/web-playback-sdk/quick-start/

### なぜスピーカーをLittlifyに切り替えないと使えないの？

Spotifyの制約です。SpotifyのAPIでは自分以外のスピーカーが再生している状態をリアルタイムに取得することが出来ません。

正確に言えば、WebプレイヤーやDiscordなどの統合では自分以外のスピーカーが再生している状態をリアルタイムに取得する機能を実装していますが、一般の開発者には提供されていません。~~Spotifyは金にならないことはしません。~~

### モバイルで動かない

デスクトップでながらみするために作ったのでモバイルでの動作は考えていません。

また、Web Playback SDKはAndroidやiOSをサポートしていないようです。

https://developer.spotify.com/documentation/web-playback-sdk/#requirements

### デスクトップで動かない

おそらくバグです。Issueか適当に連絡してください。

なお、最新のOS/ブラウザ以外はサポートしない予定です。

### あの機能がほしい

Issueか適当に連絡してください

### 見た目がダサい

じきになんとかします。

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

個別に起動
```bash
yarn server:start
yarn client:start
```

or

一括起動
```bash
yarn watch
```

## Contribute

ウェルカムアボード

気軽にPRかIssueしてください。

## License

MIT
