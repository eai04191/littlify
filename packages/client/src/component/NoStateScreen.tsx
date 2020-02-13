import React from "react";
import tutorial from "../../public/images/spotify-connect.png";

export default class NoStateScreen extends React.Component {
    render() {
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
