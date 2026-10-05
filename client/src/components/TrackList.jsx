import { Grid, Typography, CircularProgress } from "@mui/material";
import TrackCard from "./TrackCard";
import { useLang } from "../i18n/LangContext";

export default function TrackList({ tracks, loading, onPlay, onDelete }) {
    const { t } = useLang();
    const safeTracks = Array.isArray(tracks) ? tracks : [];

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: 40 }}>
                <CircularProgress />
            </div>
        );
    }

    if (safeTracks.length === 0) {
        return <Typography sx={{ py: 3 }}>{t.noTracks}</Typography>;
    }

    return (
        <Grid container spacing={2}>
            {safeTracks.map((track) => (
                <Grid key={track.id ?? track.title} size={{ xs: 12, sm: 6, md: 4 }}>
                    <TrackCard track={track} onPlay={onPlay} onDelete={onDelete} />
                </Grid>
            ))}
        </Grid>
    );
}
