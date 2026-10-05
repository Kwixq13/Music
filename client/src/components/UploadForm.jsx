import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { uploadTrack } from "../api/api";
import { useLang } from "../i18n/LangContext";

export default function UploadForm({ onDone }) {
    const { t } = useLang();
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");
    const [audio, setAudio] = useState(null);
    const [cover, setCover] = useState(null);

    function send() {
        if (!title || !audio) {
            console.warn(t.fillForm);
            return;
        }

        const data = new FormData();
        data.append("title", title);
        data.append("artist", artist);
        data.append("genre", genre);
        data.append("audio", audio);
        if (cover) data.append("cover", cover);

        uploadTrack(data)
            .then(() => {
                console.log(t.saved);
                setTitle("");
                setArtist("");
                setGenre("");
                setAudio(null);
                setCover(null);
                if (onDone) onDone();
            })
            .catch((err) => {
                console.error(t.uploadError, err);
            });
    }

    return (
        <Box sx={{ maxWidth: 400 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>{t.addTrack}</Typography>

            <TextField
                label={t.title}
                fullWidth
                sx={{ mb: 2 }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                label={t.artist}
                fullWidth
                sx={{ mb: 2 }}
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
            />
            <TextField
                label={t.genre}
                fullWidth
                sx={{ mb: 2 }}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
            />

            <Typography sx={{ mb: 1 }}>{t.audio}</Typography>
            <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
            <br /><br />

            <Typography sx={{ mb: 1 }}>{t.cover}</Typography>
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} />
            <br /><br />

            <Button variant="contained" onClick={send}>{t.upload}</Button>
        </Box>
    );
}
