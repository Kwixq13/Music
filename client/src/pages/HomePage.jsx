import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import TrackList from "../components/TrackList";
import Player from "../components/Player";
import { getTracks, deleteTrack } from "../api/api";
import { useLang } from "../i18n/LangContext";

export default function HomePage({ update }) {
    const { t } = useLang();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(null);

    function generateRandomTracks() {
        const titles = ["Moonlight Drive", "Echoes of Summer", "Neon Dreams", "Skyline Whisper", "Velvet Pulse", "Aurora Nights"];
        const artists = ["Luna Ray", "Nova Pulse", "Echo Lane", "Aria Bloom", "Solar Tide", "Mira Vale"];
        const genres = ["Pop", "Electronic", "Jazz", "Ambient", "Rock", "Chill"];
        const files = ["song1.mp3", "song2.mp3"];

        return Array.from({ length: 4 }, (_, index) => ({
            id: `demo-${index}-${Date.now()}`,
            title: titles[Math.floor(Math.random() * titles.length)],
            artist: artists[Math.floor(Math.random() * artists.length)],
            genre: genres[Math.floor(Math.random() * genres.length)],
            filename: files[index % files.length],
            cover: null,
            demo: true,
        }));
    }

    function load() {
        setLoading(true);
        getTracks()
            .then((res) => {
                const data = Array.isArray(res?.data) ? res.data : [];
                if (data.length > 0) {
                    setTracks(data);
                } else {
                    setTracks(generateRandomTracks());
                }
            })
            .catch((err) => {
                console.error("Track load failed", err);
                setTracks(generateRandomTracks());
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, [update]);

    function del(id) {
        deleteTrack(id)
            .then(() => {
                if (active && active.id === id) setActive(null);
                load();
            })
            .catch((err) => {
                console.error("Delete failed", err);
            });
    }

    return (
        <div style={{ paddingBottom: active ? 100 : 0 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>{t.songList}</Typography>
            <TrackList tracks={tracks} loading={loading} onPlay={setActive} onDelete={del} />
            <Player track={active} onClose={() => setActive(null)} />
        </div>
    );
}
