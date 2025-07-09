import express from 'express';
import mongoose from 'mongoose';
import loggingMiddleware from './middleware/logger.mjs';
import shortUrlRoutes from './routes/shorturls.mjs';
import ShortUrl from './models/ShortUrl.mjs';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(loggingMiddleware);

mongoose.connect('mongodb://localhost:27017/urlshortener');

app.use('/shorturls', shortUrlRoutes);

// Redirection Route
app.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const entry = await ShortUrl.findOne({ shortcode });

  if (!entry) return res.status(404).json({ error: 'Shortcode not found' });

  const now = new Date();
  if (now > entry.expiresAt) return res.status(410).json({ error: 'Short link expired' });

  entry.clicks.push({
    timestamp: now,
    referrer: req.get('Referrer') || 'Direct',
    geo: 'India' // Static geo for now
  });

  await entry.save();
  res.redirect(entry.originalUrl);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



app.get('/', (req, res) => {
  res.send('🔗 URL Shortener Microservice is running.');
});
