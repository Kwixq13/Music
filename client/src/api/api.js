import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_URL,
});

export function getTracks() {
    return api.get("/files");
}

export function uploadTrack(data) {
    return api.post("/upload", data);
}

export function deleteTrack(id) {
    return api.get("/delete/" + id);
}

export function streamUrl(filename) {
    return API_URL + "/" + filename;
}

export function coverUrl(cover) {
    if (!cover) return null;
    return API_URL + "/" + cover;
}

export function fileUrl(filename) {
    return API_URL + "/" + filename;
}

export function downloadUrl(track) {
    if (track?.demo && track.filename) {
        return fileUrl(track.filename);
    }

    return API_URL + "/download/" + track?.id;
}
