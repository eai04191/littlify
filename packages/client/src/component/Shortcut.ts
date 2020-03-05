type Command = {
    name: string;
    callback: () => void;
};

type ShortcutKey = {
    key: string;
    command: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
};

type Property = keyof ShortcutKey | keyof KeyboardEvent;

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
            name: "player.togglePlay",
            callback: () => {
                this.player.togglePlay();
            },
        },
        {
            name: "player.previousTrack",
            callback: () => {
                this.player.previousTrack();
            },
        },
        {
            name: "player.nextTrack",
            callback: () => {
                this.player.nextTrack();
            },
        },
    ];
    private readonly shortcutKeys: ShortcutKey[] = [
        {
            key: " ", // Space Key
            command: "player.togglePlay",
        },
        {
            key: "ArrowLeft",
            command: "player.previousTrack",
        },
        {
            key: "ArrowRight",
            command: "player.nextTrack",
        },
    ];

    constructor(player: Spotify.SpotifyPlayer) {
        this.player = player;
        this.keyDownHandler = this.keyDownHandler.bind(this);
    }

    enable() {
        window.addEventListener("keydown", this.keyDownHandler);
    }

    disable() {
        window.removeEventListener("keydown", this.keyDownHandler);
    }

    keyDownHandler(e: KeyboardEvent) {
        const shortcutKey = this.shortcutKeys.find(shortcutKey => {
            for (const prop of this.properties) {
                // コンビネーションキーが指定されていない場合は押されてない事を確認する
                if (
                    !shortcutKey[prop as keyof ShortcutKey] &&
                    !e[prop as keyof KeyboardEvent]
                )
                    continue;

                // コンビネーションキーが指定されいる場合は押されている事を確認する
                if (
                    shortcutKey[prop as keyof ShortcutKey] ===
                    e[prop as keyof KeyboardEvent]
                )
                    continue;

                return false;
            }

            return true;
        });
        if (!shortcutKey) return;

        this.executeCommand(shortcutKey.command);
    }

    executeCommand(name: string) {
        const command = this.commands.find(c => c.name === name);
        if (!command) return;
        command.callback();
    }
}
