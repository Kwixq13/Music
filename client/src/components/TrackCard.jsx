import { Card, CardMedia, CardContent, Typography, CardActions, Button, useTheme } from "@mui/material";
import { coverUrl, downloadUrl } from "../api/api";
import { useLang } from "../i18n/LangContext";

export default function TrackCard({ track, onPlay, onDelete }) {
    const theme = useTheme();
    const { t } = useLang();
    const img = coverUrl(track.cover);

    async function handleDownload() {
        const url = downloadUrl(track);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Download failed");
            }
            const blob = await response.blob();
            const filename = track.filename || `${track.title || "track"}.mp3`;
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error("Download failed", err);
        }
    }

    return (
        <Card>
            {img ? (
                <CardMedia component="img" height="140" image={img} alt={track.title} />
            ) : (
                <div style={{ height: 140, background: theme.palette.mode === "dark" ? "#333" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                    {t.noPhoto}
                </div>
            )}
            <CardContent>
                <Typography variant="h6">{track.title}</Typography>
                <Typography color="text.secondary">{track.artist}</Typography>
                {track.genre && <Typography variant="body2">{t.genreLabel} {track.genre}</Typography>}
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => onPlay(track)}>{t.play}</Button>
                <Button size="small" color="error" onClick={() => onDelete(track.id)}>{t.delete}</Button>
                <Button size="small" onClick={handleDownload}>{t.download}</Button>
            </CardActions>
        </Card>
    );
}
