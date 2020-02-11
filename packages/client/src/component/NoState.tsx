import React from "react";
// import tutorial from "../../public/spotify-tutorial.png";

export default class NoState extends React.Component {
    render() {
        return (
            <>
                <p>
                    Stateがありません。Littlifyをデバイスに指定して再生してください。
                    {/* <img
                        src={tutorial}
                    /> */}
                </p>
            </>
        );
    }
}
