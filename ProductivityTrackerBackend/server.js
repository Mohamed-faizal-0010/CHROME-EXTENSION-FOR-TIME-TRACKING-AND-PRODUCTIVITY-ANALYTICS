const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Required for cross-origin requests

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes (important for extension to backend communication)
app.use(express.json()); // Body parser for JSON requests

// MongoDB Connection
// Ensure MongoDB is running on your machine on port 27017
const MONGODB_URI = 'mongodb://localhost:27017/productivity_tracker_db';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Local MongoDB Connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema and Model for Activity
const activitySchema = new mongoose.Schema({
    url: { type: String, required: true },
    domain: { type: String, required: true }, // Added for easier aggregation
    duration: { type: Number, required: true }, // duration in milliseconds
    timestamp: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', activitySchema);

// API Routes

// 1. POST /api/activities - Save a new activity
app.post('/api/activities', async (req, res) => {
    try {
        const { url, duration, timestamp } = req.body;
        if (!url || !duration) {
            return res.status(400).json({ message: 'URL and duration are required.' });
        }

        // Extract domain from URL
        let domain;
        try {
            const urlObj = new URL(url);
            domain = urlObj.hostname;
            if (domain.startsWith('www.')) {
                domain = domain.substring(4); // Remove 'www.'
            }
        } catch (e) {
            domain = url; // Fallback if URL is invalid (e.g., chrome://)
        }

        const newActivity = new Activity({ url, domain, duration, timestamp });
        await newActivity.save();
        console.log('Activity saved to DB:', newActivity); // Log to backend console
        res.status(201).json({ message: 'Activity saved successfully!', activity: newActivity });
    } catch (error) {
        console.error('Error saving activity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 2. GET /api/analytics - Get overall analytics (Top Sites & Daily Trend)
app.get('/api/analytics', async (req, res) => {
    try {
        // Fetch data for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Aggregate for Top Sites (last 30 days)
        const topSites = await Activity.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            { $group: {
                _id: '$domain', // Group by extracted domain
                totalDuration: { $sum: '$duration' }
            }},
            { $sort: { totalDuration: -1 } },
            { $limit: 10 } // Top 10 sites
        ]);

        const formattedTopSites = {};
        topSites.forEach(site => {
            formattedTopSites[site._id] = site.totalDuration;
        });

        // Aggregate for Daily Activity Trend (last 30 days)
        const dailyTrend = await Activity.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            { $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                totalDuration: { $sum: '$duration' }
            }},
            { $sort: { _id: 1 } } // Sort by date
        ]);

        // Fill in missing dates with 0 duration for a continuous chart
        const formattedDailyTrend = {};
        let currentDate = new Date(thirtyDaysAgo);
        const today = new Date();
        while (currentDate <= today) {
            const dateStr = currentDate.toISOString().slice(0, 10);
            formattedDailyTrend[dateStr] = 0; // Initialize to 0
            currentDate.setDate(currentDate.getDate() + 1);
        }
        dailyTrend.forEach(day => {
            formattedDailyTrend[day._id] = day.totalDuration;
        });


        res.json({
            topSites: formattedTopSites,
            dailyTrend: formattedDailyTrend
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 3. GET /api/daily-activity - Get daily activity breakdown for a specific date
app.get('/api/daily-activity', async (req, res) => {
    try {
        const dateString = req.query.date; // e.g., '2025-08-01'
        if (!dateString) {
            return res.status(400).json({ message: 'Date query parameter is required.' });
        }

        const startOfDay = new Date(dateString);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateString);
        endOfDay.setHours(23, 59, 59, 999);

        const dailyActivity = await Activity.aggregate([
            { $match: {
                timestamp: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }},
            { $group: {
                _id: '$url', // Group by full URL for daily breakdown
                totalDuration: { $sum: '$duration' }
            }},
            { $sort: { totalDuration: -1 } }
        ]);

        const formattedDailyActivity = {};
        dailyActivity.forEach(item => {
            formattedDailyActivity[item._id] = item.totalDuration;
        });

        res.json(formattedDailyActivity);

    } catch (error) {
        console.error('Error fetching daily activity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});