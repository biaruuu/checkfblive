const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/check-uid', async (req, res) => {
  const { uids } = req.body;

  if (!uids || !Array.isArray(uids) || uids.length === 0) {
    return res.status(400).json({ error: 'Please provide at least one UID.' });
  }

  const cleanedUids = uids.map(uid => uid.trim()).filter(Boolean);

  if (cleanedUids.length === 0) {
    return res.status(400).json({ error: 'No valid UIDs provided.' });
  }

  try {
    const config = {
      method: 'POST',
      url: 'https://hitools.pro/api/check-uid-facebook',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        'sec-ch-ua-platform': '"Android"',
        'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
        'sec-ch-ua-mobile': '?1',
        'origin': 'https://hitools.pro',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://hitools.pro/check-live-uid',
        'accept-language': 'en-US,en;q=0.9',
        'priority': 'u=1, i'
      },
      data: JSON.stringify({ uids: cleanedUids })
    };

    const response = await axios.request(config);
    res.json({ results: response.data });
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to reach the Facebook check API.',
      details: error?.response?.data || error.message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅  Server running at http://localhost:${PORT}`);
});
