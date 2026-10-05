import { useTheme } from "@mui/material";
import { streamUrl, coverUrl } from "../api/api";
import { useLang } from "../i18n/LangContext";

export default function Player({ track, onClose }) {
    const { t } = useLang();
    const theme = useTheme();
    if (!track) return null;

    const img = coverUrl(track.cover);

    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: theme.palette.mode === "dark" ? "#222" : "#eee",
            color: theme.palette.text.primary,
            padding: 15,
            display: "flex",
            gap: 15,
            alignItems: "center",
        }}>
            {img && <img src={img} alt="" style={{ width: 50, height: 50 }} />}
            <div style={{ flex: 1 }}>
                <b>{track.title}</b> — {track.artist}
                <br />
                {track.filename ? (
                    <audio src={streamUrl(track.filename)} controls autoPlay style={{ width: "100%" }} />
                ) : (
                    <div>{t.noAudio}</div>
                )}
            </div>
            <button onClick={onClose}>X</button>
        </div>
    );
}
