const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("static"));

if (!fs.existsSync("static")) {
    fs.mkdirSync("static");
}

const storage = multer.diskStorage({
    destination: "static/",
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

const STORE_FILE = path.join(__dirname, "store.json");

function readStore() {
    try {
        if (!fs.existsSync(STORE_FILE)) {
            fs.writeFileSync(STORE_FILE, JSON.stringify({ tracks: [] }, null, 2));
        }
        const content = fs.readFileSync(STORE_FILE, "utf8");
        const data = JSON.parse(content);
        return Array.isArray(data.tracks) ? data.tracks : [];
    } catch (err) {
        console.error("Failed to read local store:", err);
        return [];
    }
}

function writeStore(tracks) {
    try {
        fs.writeFileSync(STORE_FILE, JSON.stringify({ tracks }, null, 2));
    } catch (err) {
        console.error("Failed to write local store:", err);
    }
}

async function queryDb(sql, params = []) {
    try {
        return await pool.query(sql, params);
    } catch (err) {
        console.error("DB query failed, using local store:", err.message || err);
        return null;
    }
}

app.get("/files", async (req, res) => {
    const result = await queryDb("SELECT * FROM tracks ORDER BY id DESC");
    if (result) {
        const [rows] = result;
        return res.json(rows);
    }

    res.json(readStore());
});

app.post("/upload", upload.fields([{ name: "audio" }, { name: "cover" }]), async (req, res) => {
    const title = req.body.title;
    const artist = req.body.artist;
    const genre = req.body.genre;

    let audioName = "";
    if (req.files && req.files["audio"]) {
        audioName = req.files["audio"][0].filename;
    }

    let coverName = "";
    if (req.files && req.files["cover"]) {
        coverName = req.files["cover"][0].filename;
    }

    if (!title || !audioName) {
        return res.status(400).send("Need title and audio");
    }

    const track = {
        id: Date.now(),
        title,
        artist,
        genre,
        filename: audioName,
        cover: coverName,
        demo: false,
    };

    try {
        const sql = "INSERT INTO tracks (title, artist, filename, cover, genre) VALUES (?, ?, ?, ?, ?)";
        const result = await queryDb(sql, [title, artist, audioName, coverName, genre]);
        if (result) {
            return res.send("Success");
        }

        const stored = readStore();
        stored.unshift(track);
        writeStore(stored);
        res.send("Success");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving track");
    }
});

app.get("/download/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await queryDb("SELECT * FROM tracks WHERE id = ?", [id]);
        let track = null;

        if (result) {
            const [rows] = result;
            if (rows.length > 0) track = rows[0];
        }

        if (!track) {
            const stored = readStore();
            track = stored.find((item) => String(item.id) === String(id));
        }

        if (!track) {
            return res.status(404).send("Not found");
        }

        return res.download(path.join(__dirname, "static", track.filename));
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let track = null;
        let deleteFromDb = false;

        const result = await queryDb("SELECT * FROM tracks WHERE id = ?", [id]);
        if (result) {
            const [rows] = result;
            if (rows.length > 0) {
                track = rows[0];
                deleteFromDb = true;
            }
        }

        if (!track) {
            const stored = readStore();
            const storedTrack = stored.find((item) => String(item.id) === String(id));
            if (storedTrack) {
                track = storedTrack;
                const remaining = stored.filter((item) => String(item.id) !== String(id));
                writeStore(remaining);
            }
        } else {
            await pool.query("DELETE FROM tracks WHERE id = ?", [id]);
        }

        if (track) {
            const audioPath = path.join(__dirname, "static", track.filename);
            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
            if (track.cover) {
                const coverPath = path.join(__dirname, "static", track.cover);
                if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
            }
        }

        res.send("Deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
