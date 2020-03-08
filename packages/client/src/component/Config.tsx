import React from "react";
import classNames from "classnames";
import { ChevronDown } from "react-feather";
import { DisLike, DisLikeI } from "../db";

const NavItems = {
    GENERAL: "全般",
    PLAY: "再生",
    DIS_LIKE: "低評価",
};

export enum Theme {
    AUTO = "AUTO",
    LIGHT = "LIGHT",
    DARK = "DARK",
}

export interface ConfigI {
    auto_auth?: boolean;
    theme?: Theme;
    auto_skip?: boolean;
}

type ValueOf<T> = T[keyof T] | { [index: string]: string };
interface State extends ConfigI {
    selected: ValueOf<keyof typeof NavItems>;
    disLikes: PouchDB.Core.ExistingDocument<DisLikeI>[];
    disLikesLoading: boolean;
    disLikesLimit: number;
    disLikesPage: number;
    disLikesName: string;
}

export default class Config extends React.Component<{}, State> {
    private disLikes: DisLike;

    constructor(props: {}) {
        super(props);

        this.state = {
            selected: NavItems.GENERAL,
            auto_auth: false,
            theme: Theme.AUTO,
            disLikes: [],
            disLikesLoading: false,
            disLikesLimit: 10,
            disLikesPage: 1,
            disLikesName: "",
        };

        this.disLikes = new DisLike();
    }

    public async componentDidMount() {
        try {
            const state = JSON.parse(localStorage.config || "{}");
            if (Object.keys(state).length > 0) {
                this.setState(state);
            }
        } catch (e) {
            // NOTE: localStorageに入ってないのでconstructorの初期値で継続する
            console.warn(e);
        }

        this.find(
            this.state.disLikesLimit,
            this.state.disLikesPage,
            this.state.disLikesName
        );
    }

    private find(limit: number, page: number, name: string) {
        return new Promise(resolve => {
            this.setState(
                {
                    disLikesLoading: true,
                },
                async () => {
                    const disLikes = await this.disLikes.find(
                        limit,
                        page,
                        name
                    );
                    this.setState(
                        {
                            disLikes: [...this.state.disLikes, ...disLikes],
                            disLikesLoading: false,
                            disLikesLimit: limit,
                            disLikesPage: page,
                            disLikesName: name,
                        },
                        () => {
                            resolve();
                        }
                    );
                }
            );
        });
    }

    public render() {
        return (
            <div className={classNames("flex", "h-screen", "overflow-hidden")}>
                <ul className={classNames("w-1/4", "overflow-auto")}>
                    {this.nav()}
                </ul>
                <div className={classNames("flex", "flex-1", "flex-col")}>
                    <div className={classNames("flex-1", "overflow-auto")}>
                        {this.activePane()}
                    </div>
                    <div
                        className={classNames(
                            "inline-flex",
                            "justify-end",
                            "p-2"
                        )}
                    >
                        <button
                            className={classNames(
                                "bg-gray-300",
                                "hover:bg-gray-400",
                                "text-gray-800",
                                "font-bold",
                                "py-2",
                                "px-4",
                                "rounded-l",
                                "focus:outline-none"
                            )}
                            onClick={() => {
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
                                "rounded-r",
                                "focus:outline-none"
                            )}
                            onClick={() => {
                                const config = { ...this.state };
                                delete config.selected;
                                delete config.disLikes;
                                delete config.disLikesLoading;
                                delete config.disLikesLimit;
                                delete config.disLikesPage;
                                delete config.disLikesName;
                                localStorage.setItem(
                                    "config",
                                    JSON.stringify(config)
                                );
                                window.close();
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    private activePane() {
        switch (this.state.selected) {
            case NavItems.GENERAL:
                return this.general();
            case NavItems.PLAY:
                return this.play();
            case NavItems.DIS_LIKE:
                return this.disLike();
        }
    }

    private nav() {
        return Object.keys(NavItems).map((navItem, index) => {
            const navText = (NavItems as { [index: string]: string })[navItem];
            if (navText === this.state.selected) {
                return (
                    <li key={index} className={classNames("flex-1", "mr-2")}>
                        <div
                            className={classNames(
                                "text-white",
                                "text-center",
                                "bg-gray-700",
                                "hover:bg-gray-600",
                                "py-2"
                            )}
                            onClick={() =>
                                this.setState({
                                    selected: navText,
                                })
                            }
                        >
                            {navText}
                        </div>
                    </li>
                );
            }
            return (
                <li key={index} className={classNames("flex-1", "mr-2")}>
                    <div
                        className={classNames(
                            "text-white",
                            "text-center",
                            "text-gray-700",
                            "hover:bg-gray-200",
                            "py-2"
                        )}
                        onClick={() =>
                            this.setState({
                                selected: navText,
                            })
                        }
                    >
                        {navText}
                    </div>
                </li>
            );
        });
    }

    private general() {
        return (
            <>
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
                        <div
                            className={classNames(
                                "relative",
                                "w-auto",
                                "inline-block"
                            )}
                        >
                            <select
                                className={classNames(
                                    "appearance-none",
                                    "bg-gray-200",
                                    "border",
                                    "border-gray-200",
                                    "text-gray-700",
                                    "py-3",
                                    "px-4",
                                    "pr-8",
                                    "rounded",
                                    "leading-tight",
                                    "focus:outline-none",
                                    "focus:bg-white",
                                    "focus:border-gray-500"
                                )}
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
                            <div
                                className={classNames(
                                    "pointer-events-none",
                                    "absolute",
                                    "inset-y-0",
                                    "right-0",
                                    "flex",
                                    "items-center",
                                    "px-2",
                                    "text-gray-700"
                                )}
                            >
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </label>
                </div>
            </>
        );
    }

    private play() {
        return (
            <>
                <div>
                    <label>
                        <input
                            type={"checkbox"}
                            checked={!!this.state.auto_skip}
                            onChange={e => {
                                this.setState({
                                    auto_skip: e.target.checked,
                                });
                            }}
                        />
                        低評価にした曲を自動的にスキップする
                    </label>
                </div>
            </>
        );
    }

    private disLike() {
        return (
            <div>
                <form className={classNames("w-full")}>
                    <div className={classNames("flex", "flex-wrap", "mb-2")}>
                        <div className={classNames("w-auto", "px-4")}>
                            <label
                                className={classNames(
                                    "block",
                                    "text-gray-700",
                                    "mb-2"
                                )}
                            >
                                タイプ
                                <div className={classNames("relative")}>
                                    <select
                                        className={classNames(
                                            "appearance-none",
                                            "bg-gray-200",
                                            "border",
                                            "border-gray-200",
                                            "text-gray-700",
                                            "py-3",
                                            "px-4",
                                            "pr-8",
                                            "rounded",
                                            "leading-tight",
                                            "focus:outline-none",
                                            "focus:bg-white",
                                            "focus:border-gray-500"
                                        )}
                                        value={"TRACK"}
                                    >
                                        <option>TRACK</option>
                                    </select>
                                    <div
                                        className={classNames(
                                            "pointer-events-none",
                                            "absolute",
                                            "inset-y-0",
                                            "right-0",
                                            "flex",
                                            "items-center",
                                            "px-2",
                                            "text-gray-700"
                                        )}
                                    >
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className={classNames("flex-1", "mr-4")}>
                            <label
                                className={classNames(
                                    "block",
                                    "text-gray-700",
                                    "mb-2"
                                )}
                            >
                                名前
                                <input
                                    className={classNames(
                                        "appearance-none",
                                        "block",
                                        "w-full",
                                        "bg-gray-200",
                                        "text-gray-700",
                                        "border",
                                        "rounded",
                                        "py-3",
                                        "px-4",
                                        "mb-3",
                                        "leading-tight",
                                        "focus:outline-none",
                                        "focus:bg-white"
                                    )}
                                    type="text"
                                    placeholder="部分文字列..."
                                    onChange={event => {
                                        this.setState(
                                            {
                                                disLikes: [],
                                                disLikesName:
                                                    event.target.value,
                                                disLikesPage: 1,
                                            },
                                            () => {
                                                this.find(
                                                    this.state.disLikesLimit,
                                                    this.state.disLikesPage,
                                                    this.state.disLikesName
                                                );
                                            }
                                        );
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </form>
                <table className={classNames("table-auto", "w-full")}>
                    <thead>
                        <tr className={classNames("border-b")}>
                            <th className={classNames("px-4", "py-2")}>名前</th>
                            <th className={classNames("px-4", "py-2")}>
                                タイプ
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {...this.state.disLikes.map((disLike, index) => {
                            return (
                                <tr
                                    key={index}
                                    className={classNames(
                                        "border-b",
                                        index % 2 === 1 ? "bg-gray-100" : ""
                                    )}
                                >
                                    <td className={classNames("px-4", "py-2")}>
                                        {disLike.name}
                                    </td>
                                    <td className={classNames("px-4", "py-2")}>
                                        {disLike.type}
                                    </td>
                                    <td
                                        className={classNames(
                                            "flex",
                                            "justify-end",
                                            "px-4",
                                            "py-2"
                                        )}
                                    >
                                        <button
                                            className={classNames(
                                                "btn",
                                                "bg-red-600",
                                                "text-white",
                                                "rounded",
                                                "py-2",
                                                "px-4"
                                            )}
                                            onClick={async () => {
                                                await this.disLikes.unset(
                                                    disLike.type,
                                                    disLike.uri
                                                );
                                                this.setState(
                                                    {
                                                        disLikes: [],
                                                    },
                                                    async () => {
                                                        const lastPage = this
                                                            .state.disLikesPage;
                                                        for (
                                                            let i = 1;
                                                            i <= lastPage;
                                                            i++
                                                        ) {
                                                            await this.find(
                                                                this.state
                                                                    .disLikesLimit,
                                                                i,
                                                                this.state
                                                                    .disLikesName
                                                            );
                                                        }
                                                    }
                                                );
                                            }}
                                        >
                                            削除
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button
                    className={classNames(
                        "btn",
                        "bg-gray-200",
                        "py-2",
                        "w-full",
                        "hover:bg-gray-100",
                        "focus:outline-none"
                    )}
                    onClick={() => {
                        this.find(
                            this.state.disLikesLimit,
                            this.state.disLikesPage + 1,
                            this.state.disLikesName
                        );
                    }}
                >
                    さらに表示
                </button>
            </div>
        );
    }
}
