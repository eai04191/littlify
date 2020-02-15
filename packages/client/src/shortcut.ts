type Command = {
    key: String,
    ctrlKey?: boolean,
    shiftKey?: boolean,
    altKey?: boolean,
    metaKey?: boolean,
    callback: (player: any) => void
}

export default class Shortcut {
    readonly properties: String[];
    readonly player: any;
    commands: Command[];

    constructor(player: any) {
        this.player = player;
        this.properties = ['key', 'ctrlKey', 'shiftKey', 'altKey', 'metaKey'];
        this.commands = [
            {
                key: " ",
                callback: (player) => {
                    player?.togglePlay();
                }
            },
            {
                key: "ArrowLeft",
                callback: (player) => {
                    player?.previousTrack();
                }
            },
            {
                key: "ArrowRight",
                callback: (player) => {
                    player?.nextTrack();
                }
            }
        ];
    }

    enable() {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keyDownHandler(e);
        });
    }

    disable() {
        window.removeEventListener('keydown', (e: KeyboardEvent) => {
            this.keyDownHandler(e);
        });
    }

    keyDownHandler(e: KeyboardEvent) {
        this.commands.forEach(cmd => {
            let invalid = false;

            this.properties.forEach(prop => {
                if (!cmd[prop]) return;

                if (cmd[prop] !== e[prop]) {
                    invalid = true;
                }
            });

            if (invalid) return;

            cmd.callback(this.player);
        });
    }
}
