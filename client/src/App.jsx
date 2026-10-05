import { useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Container, CssBaseline, ThemeProvider, createTheme, IconButton, Button } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HomePage from "./pages/HomePage";
import UploadForm from "./components/UploadForm";
import { useLang } from "./i18n/LangContext";
import { langLabels } from "./i18n/translations";

export default function App() {
    const [page, setPage] = useState(0);
    const [update, setUpdate] = useState(0);
    const [dark, setDark] = useState(true);
    const { t, lang, switchLang } = useLang();

    const theme = createTheme({
        palette: {
            mode: dark ? "dark" : "light",
            primary: { main: "#1db954" },
        },
    });

    function afterUpload() {
        setUpdate((n) => n + 1);
        setPage(0);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>{t.appTitle}</Typography>
                    <Tabs value={page} onChange={(e, v) => setPage(v)} textColor="inherit">
                        <Tab label={t.home} />
                        <Tab label={t.uploadTab} />
                    </Tabs>
                    <Button color="inherit" onClick={switchLang} sx={{ ml: 1 }}>
                        {langLabels[lang]}
                    </Button>
                    <IconButton color="inherit" onClick={() => setDark(!dark)}>
                        {dark ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container sx={{ py: 3 }}>
                {page === 0 && <HomePage update={update} />}
                {page === 1 && <UploadForm onDone={afterUpload} />}
            </Container>
        </ThemeProvider>
    );
}
