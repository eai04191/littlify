import axios from "axios";
import React, { useCallback } from "react";
import { Lrc, LrcLine } from "@mebtte/react-lrc";

export const getLyric = async (state: Spotify.PlaybackState) => {
    if (state.paused) {
        return "";
    }

    const query = {
        format: "json",
        // f_subtitle_length: "",
        namespace: "lyrics_synched",
        // part: "",
        // q_album: state.track_window.current_track.album.name,
        // q_artist: state.track_window.current_track.artists[0].name,
        // q_artists: state.track_window.current_track.artists[0].name,
        // q_duration: "",
        q_track: state.track_window.current_track.name,
        tags: "nowplaying",
        // userblob_id: "",
        user_language: "en",
        track_spotify_id: state.track_window.current_track.uri,
        f_subtitle_length_max_deviation: "1",
        subtitle_format: "lrc",
        app_id: "web-desktop-app-v1.0",
        usertoken: process.env.MUSIXMATCH_TOKEN || "",
        guid: "d05a6a86-49af-4900-acd8-74d190b7c4db",
        // signature: "",
        signature_protocol: "sha1",
    };
    const qs = new URLSearchParams(query).toString();
    const url = encodeURIComponent(
        "https://apic-desktop.musixmatch.com/ws/1.1/macro.subtitles.get?" + qs
    );

    return await axios
        .get("https://vercel-cors-anywhere.vercel.app/api/?url=" + url)
        .then((res) => res.data)
        .then(
            (data) =>
                data.message.body.macro_calls["track.subtitles.get"].message
                    .body.subtitle_list[0].subtitle.subtitle_body ||
                data.message.body.macro_calls["track.lyrics.get"].message.body
                    .lyrics.lyrics_body ||
                ""
        );
};

interface LyricProps {
    lrc: string;
    currentTime: number;
    className?: string;
}

export const Lyric: React.FC<LyricProps> = ({
    lrc,
    currentTime,
    className,
}) => {
    // const onCurrentLineChange = useCallback(
    //     ({ millisecond, content }, index) => {
    //         console.log(millisecond, content, index);
    //     },
    //     []
    // );

    return (
        <Lrc
            lrc={lrc}
            currentTime={currentTime}
            // onCurrentLineChange={onCurrentLineChange}
            className={className}
        >
            {({ millisecond, content }, active, index) => (
                <LrcLine
                    key={index}
                    style={{
                        color: active ? "#1a202c" : "gray",
                        fontSize: active ? "1.5rem" : "unset",
                        fontWeight: active ? "bold" : "unset",
                        padding: ".5rem 0",
                    }}
                >
                    {content}
                </LrcLine>
            )}
        </Lrc>
    );
};
