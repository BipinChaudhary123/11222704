import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: Date,
  referrer: String,
  geo: String
});

const shortUrlSchema = new mongoose.Schema({
  originalUrl: String,
  shortcode: { type: String, unique: true },
  createdAt: Date,
  expiresAt: Date,
  clicks: [clickSchema]
});

export default mongoose.model('ShortUrl', shortUrlSchema);
