import React from "react";
import classNames from "classnames";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export enum Event {
    OPEN_SYN,
    OPEN_ACK,
    CLOSE_SYN,
    CLOSE_ACK,
}

export enum Theme {
    AUTO = "AUTO",
    LIGHT = "LIGHT",
    DARK = "DARK",
}

export interface Message<T> {
    type: string;
    event: Event;
    payload: T;
}

export interface State {
    auto_auth?: boolean;
    theme?: Theme;
}

export default class Config extends React.Component<{}, State> {
    private lock = true;

    constructor(props: {}) {
        super(props);

        this.state = {
            auto_auth: false,
            theme: Theme.AUTO,
        };
    }

    componentDidMount() {
        window.addEventListener("beforeunload", e => {
            if (this.lock) {
                e.preventDefault();
                e.returnValue = "";
            }
            return !this.lock;
        });
        window.addEventListener("message", e => this.handleMessage(e));
        window.parent.postMessage(
            this.wrapMessage(Event.OPEN_SYN, null),
            window.parent.origin
        );
    }

    private handleMessage(event: MessageEvent) {
        if (event.data.type !== "littlify_config") {
            return;
        }
        console.log("onmessage:", event.data);

        const data = event.data as Message<{}>;
        switch (data.event) {
            case Event.OPEN_ACK: {
                const state = data.payload as State;
                this.setState(state);
                break;
            }
            case Event.CLOSE_ACK: {
                this.lock = false;
                window.close();
            }
        }
    }

    private wrapMessage<T>(event: Event, payload: T): Message<T> {
        return {
            type: "littlify_config",
            event,
            payload,
        };
    }

    render() {
        return (
            <div>
                <div>
                    <label>
                        <input
                            type={"checkbox"}
                            checked={!!this.state.auto_auth}
                            onChange={e => {
                                this.setState({
                                    auto_auth: e.target.checked,
                                });
                            }}
                        />
                        自動的にログインする
                    </label>
                </div>
                <div>
                    <label>
                        テーマ
                        <div className="relative w-auto inline-block">
                            <select
                                className="appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-state"
                                value={this.state.theme}
                                onChange={e => {
                                    this.setState({
                                        theme: e.target.value as Theme,
                                    });
                                }}
                            >
                                <option value={Theme.AUTO}>
                                    自動（OSの設定に合わせる）
                                </option>
                                <option value={Theme.LIGHT}>ライト</option>
                                <option value={Theme.DARK}>ダーク</option>
                            </select>
                            {/**/}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <FontAwesomeIcon icon={faCaretDown} />
                            </div>
                        </div>
                    </label>
                </div>
                <div className="inline-flex">
                    <button
                        className={classNames(
                            "bg-gray-300",
                            "hover:bg-gray-400",
                            "text-gray-800",
                            "font-bold",
                            "py-2",
                            "px-4",
                            "rounded-l"
                        )}
                        onClick={() => {
                            this.lock = false;
                            window.close();
                        }}
                    >
                        キャンセル
                    </button>
                    <button
                        className={classNames(
                            "bg-blue-500",
                            "hover:bg-blue-700",
                            "text-white",
                            "font-bold",
                            "py-2",
                            "px-4",
                            "rounded-r"
                        )}
                        onClick={() => {
                            window.parent.postMessage(
                                this.wrapMessage(Event.CLOSE_SYN, this.state),
                                window.parent.origin
                            );
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }
}
