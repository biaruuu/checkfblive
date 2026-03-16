const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/check', async (req, res) => {
    try {
        const { uid } = req.body;

        if (!uid) {
            return res.status(400).json({ error: 'UID is required' });
        }

        const response = await axios.post(
            'https://hitools.pro/api/check-uid-facebook',
            { uids: [String(uid)] },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
                    Accept: '*/*',
                    Origin: 'https://hitools.pro',
                    Referer: 'https://hitools.pro/check-live-uid',
                },
                timeout: 15000,
            }
        );

        const raw = typeof response.data === 'string' ? response.data : null;
        let result;

        if (raw) {
            const firstLine = raw.split('\n').find((l) => l.trim());
            result = JSON.parse(firstLine);
        } else {
            result = response.data;
        }

        return res.json(result);
    } catch (err) {
        console.error('Check error:', err.message);
        return res.status(500).json({ error: 'Failed to check UID', details: err.message });
    }
});

app.post('/api/check-bulk', async (req, res) => {
    try {
        const { uids } = req.body;

        if (!uids || !Array.isArray(uids) || uids.length === 0) {
            return res.status(400).json({ error: 'uids array is required' });
        }

        if (uids.length > 50) {
            return res.status(400).json({ error: 'Maximum 50 UIDs per request' });
        }

        const response = await axios.post(
            'https://hitools.pro/api/check-uid-facebook',
            { uids: uids.map(String) },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
                    Accept: '*/*',
                    Origin: 'https://hitools.pro',
                    Referer: 'https://hitools.pro/check-live-uid',
                },
                timeout: 30000,
            }
        );

        const raw = typeof response.data === 'string' ? response.data : null;
        let results = [];

        if (raw) {
            const lines = raw.split('\n').filter((l) => l.trim());
            results = lines.map((line) => JSON.parse(line));
        } else if (Array.isArray(response.data)) {
            results = response.data;
        } else {
            results = [response.data];
        }

        const live = results.filter((r) => r.live === true);
        const dead = results.filter((r) => r.live === false);

        return res.json({
            total: results.length,
            live: live.length,
            dead: dead.length,
            results,
        });
    } catch (err) {
        console.error('Bulk check error:', err.message);
        return res.status(500).json({ error: 'Failed to check UIDs', details: err.message });
    }
});

app.post('/api/check-uid', async (req, res) => {
    try {
        const { uids } = req.body;

        if (!uids || !Array.isArray(uids) || uids.length === 0) {
            return res.status(400).json({ error: 'uids array is required' });
        }

        if (uids.length > 50) {
            return res.status(400).json({ error: 'Maximum 50 UIDs per request' });
        }

        const response = await axios.post(
            'https://hitools.pro/api/check-uid-facebook',
            { uids: uids.map(String) },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
                    Accept: '*/*',
                    Origin: 'https://hitools.pro',
                    Referer: 'https://hitools.pro/check-live-uid',
                },
                timeout: 30000,
            }
        );

        const raw = typeof response.data === 'string' ? response.data : null;
        let results = [];

        if (raw) {
            const lines = raw.split('\n').filter((l) => l.trim());
            results = lines.map((line) => JSON.parse(line));
        } else if (Array.isArray(response.data)) {
            results = response.data;
        } else {
            results = [response.data];
        }

        return res.json({ results });
    } catch (err) {
        console.error('Check-uid error:', err.message);
        return res.status(500).json({ error: 'Failed to check UIDs', details: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n  🚀  FB UID Checker API running at http://localhost:${PORT}\n`);
    console.log('  Endpoints:');
    console.log('    POST /api/check       — single UID  { uid: "123" }');
    console.log('    POST /api/check-bulk  — bulk UIDs   { uids: ["123","456"] }');
    console.log('    POST /api/check-uid   — UI endpoint { uids: ["123","456"] }\n');
});
