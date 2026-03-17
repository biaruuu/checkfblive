const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const HITOOLS_HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    Accept: '*/*',
    Origin: 'https://hitools.pro',
};

// Retry helper for 429 rate limits
async function requestWithRetry(config, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios(config);
        } catch (err) {
            if (err.response && err.response.status === 429 && i < retries - 1) {
                console.log(`  ⏳ Rate limited (429). Retrying in ${delay}ms... (${i + 1}/${retries})`);
                await new Promise(r => setTimeout(r, delay));
                delay *= 1.5; // exponential backoff
            } else {
                throw err;
            }
        }
    }
}

// ─── API: Check UIDs ──────────────────────────────────────────
app.post('/api/check-uid', async (req, res) => {
    try {
        const { uids } = req.body;
        if (!uids || !Array.isArray(uids) || uids.length === 0) {
            return res.status(400).json({ error: 'uids array is required' });
        }
        if (uids.length > 50) {
            return res.status(400).json({ error: 'Maximum 50 UIDs per request' });
        }

        const response = await requestWithRetry({
            method: 'POST',
            url: 'https://hitools.pro/api/check-uid-facebook',
            data: { uids: uids.map(String) },
            headers: { ...HITOOLS_HEADERS, Referer: 'https://hitools.pro/check-live-uid' },
            timeout: 30000,
        });

        const raw = typeof response.data === 'string' ? response.data : null;
        let results = [];

        if (raw) {
            const lines = raw.split('\n').filter(l => l.trim());
            results = lines.map(line => JSON.parse(line));
        } else if (Array.isArray(response.data)) {
            results = response.data;
        } else {
            results = [response.data];
        }

        return res.json({ results });
    } catch (err) {
        console.error('Check-uid error:', err.message);
        const status = err.response?.status || 500;
        return res.status(status).json({
            error: status === 429 ? 'Rate limited. Please wait a moment and try again.' : 'Failed to check UIDs',
            details: err.message
        });
    }
});

// ─── API: Find Facebook ID ────────────────────────────────────
app.post('/api/find-facebook-id', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'A Facebook URL is required' });
        }

        const response = await requestWithRetry({
            method: 'POST',
            url: 'https://hitools.pro/api/find-facebook-id',
            data: { url: url.trim() },
            headers: { ...HITOOLS_HEADERS, Referer: 'https://hitools.pro/find-facebook-id' },
            timeout: 15000,
        });

        return res.json(response.data);
    } catch (err) {
        console.error('Find-id error:', err.message);
        const status = err.response?.status || 500;
        return res.status(status).json({
            error: status === 429 ? 'Rate limited. Please wait a moment and try again.' : 'Failed to find Facebook ID',
            details: err.message
        });
    }
});


// ─── API: Find Facebook Post ID ───────────────────────────────
app.post('/api/find-post-id', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'A Facebook post URL is required' });
        }

        const response = await requestWithRetry({
            method: 'POST',
            url: 'https://id.traodoisub.com/api.php',
            data: `link=${encodeURIComponent(url.trim())}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000,
        });

        const postId = response.data?.id || null;
        if (!postId) {
            return res.status(404).json({ error: 'Post ID not found. The post may be private or the URL is unsupported.' });
        }

        return res.json({ postId });
    } catch (err) {
        console.error('Find-post-id error:', err.message);
        const status = err.response?.status || 500;
        return res.status(status).json({
            error: status === 429 ? 'Rate limited. Please wait a moment and try again.' : 'Failed to find Post ID',
            details: err.message
        });
    }
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n  🚀  KiroTools API running at http://localhost:${PORT}\n`);
    console.log('  Pages:');
    console.log('    /                        — Home');
    console.log('    /check-live-uid.html     — Check Live UID');
    console.log('    /find-facebook-id.html   — Find Facebook ID');
    console.log('    /documentation.html      — Documentation');
    console.log('\n  API:');
    console.log('    POST /api/check-uid          — { uids: [...] }');
    console.log('    POST /api/find-facebook-id   — { url: "..." }\n');
});
