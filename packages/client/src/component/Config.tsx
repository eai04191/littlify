import React from "react";
import classNames from "classnames";
import { ChevronDown } from "react-feather";

export enum Theme {
    AUTO = "AUTO",
    LIGHT = "LIGHT",
    DARK = "DARK",
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
        try {
            const state = JSON.parse(localStorage.config || "{}");
            if (Object.keys(state).length > 0) {
                this.setState(state);
            }
        } catch (e) {
            // NOTE: localStorageに入ってないのでconstructorの初期値で継続する
            console.warn(e);
        }

        // NOTE: どうせunloadしたらイベントリスナーが消えるから匿名関数でOK
        window.addEventListener("beforeunload", e => {
            if (this.lock) {
                e.preventDefault();
                e.returnValue = "";
            }
            return !this.lock;
        });
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
                                <ChevronDown size={16} />
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
                            localStorage.setItem(
                                "config",
                                JSON.stringify(this.state)
                            );
                            this.lock = false;
                            window.close();
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }
}
