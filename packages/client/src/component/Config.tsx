import React from "react";
import classNames from "classnames";

export enum Event {
    OPEN_SYN,
    OPEN_ACK,
    CLOSE_SYN,
    CLOSE_ACK,
}

export interface Message<T> {
    type: string;
    event: Event;
    payload: T;
}

export interface State {
    auto_auth: boolean;
}

export default class Config extends React.Component<{}, State> {
    private lock = true;

    constructor(props: {}) {
        super(props);

        this.state = {
            auto_auth: false,
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

        const data = event.data as Message<any>;
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
