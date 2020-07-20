import React from "react";
import tutorial from "../images/spotify-connect.png";

export default class NoStateScreen extends React.Component {
    render(): JSX.Element {
        return (
            <>
                <p>
                    Littlifyに接続して再生しましょう！
                    <img src={tutorial} />
                </p>
            </>
        );
    }
}
