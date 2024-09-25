import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const apiKey = 'addd69afe5e7fd28526831a79fa1519a'; // ScreenshotLayer API key

// Middleware to parse URL-encoded form data and serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Resolve file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Home route - renders the form
app.get('/', (req, res) => {
    res.render('index', { screenshotBase64: null });
});

// Screenshot route using ScreenshotLayer API
app.get('/screenshotlayer', async (req, res) => {
    const url = req.query.url; // Get the URL from query parameters
    console.log(url);
    if (!url) {
        return res.status(400).send('URL is required');
    }

    // ScreenshotLayer API endpoint
    const apiUrl = `http://api.screenshotlayer.com/api/capture?access_key=${apiKey}&url=${encodeURIComponent(url)}&viewport=1440x900&fullpage=1`;

    try {
        // Fetch the screenshot using ScreenshotLayer API
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // Convert the image to base64
        const screenshotBase64 = Buffer.from(response.data, 'binary').toString('base64');

        // Send the base64 image string as a JSON response
        res.json({ image: screenshotBase64 });
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        res.status(500).send("Error capturing screenshot via ScreenshotLayer API");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
