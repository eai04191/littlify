type Command = {
    key: String,
    ctrlKey?: boolean,
    shiftKey?: boolean,
    altKey?: boolean,
    metaKey?: boolean,
    callback: (player: any) => void
}

export default class Shortcut {
    private readonly player: any;
    private readonly properties: String[] = ['key', 'ctrlKey', 'shiftKey', 'altKey', 'metaKey'];
    private readonly commands: Command[] = [
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
    private readonly handler = this.keyDownHandler.bind(this);

    constructor(player: any) {
        this.player = player;
    }

    enable() {
        window.addEventListener('keydown', this.handler);
    }

    disable() {
        window.removeEventListener('keydown', this.handler);
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
