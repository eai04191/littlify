type Command = {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    callback: (player: Spotify.SpotifyPlayer) => void;
};

type Property = keyof Command | keyof KeyboardEvent;

export default class Shortcut {
    private readonly player: Spotify.SpotifyPlayer;
    private readonly properties: Property[] = [
        "key",
        "ctrlKey",
        "shiftKey",
        "altKey",
        "metaKey",
    ];
    private readonly commands: Command[] = [
        {
            key: " ", // Space Key
            callback: player => {
                player?.togglePlay();
            },
        },
        {
            key: "ArrowLeft",
            callback: player => {
                player?.previousTrack();
            },
        },
        {
            key: "ArrowRight",
            callback: player => {
                player?.nextTrack();
            },
        },
    ];
    private readonly handler = this.keyDownHandler.bind(this);

    constructor(player: Spotify.SpotifyPlayer) {
        this.player = player;
    }

    enable() {
        window.addEventListener("keydown", this.handler);
    }

    disable() {
        window.removeEventListener("keydown", this.handler);
    }

    keyDownHandler(e: KeyboardEvent) {
        for (const cmd of this.commands) {
            let invalid = false;

            for (const prop of this.properties) {
                // コンビネーションキーが指定されていない場合は押されてない事を確認する
                if (
                    !cmd[prop as keyof Command] &&
                    !e[prop as keyof KeyboardEvent]
                )
                    continue;

                // コンビネーションキーが指定されいる場合は押されている事を確認する
                if (
                    cmd[prop as keyof Command] ===
                    e[prop as keyof KeyboardEvent]
                )
                    continue;

                invalid = true;
                break;
            }

            if (invalid) continue;

            cmd.callback(this.player);

            break;
        }
    }
}
