const mongoose = require('mongoose');

async function connectDatabase() {
    const uri = process.env.MONGO_CONN?.trim();
    if (!uri) {
        console.error('MongoDB is not configured. Set MONGO_CONN in backend/.env and restart the backend.');
        return;
    }

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`MongoDB connection failed (${error.name}). Check MONGO_CONN and confirm MongoDB is running, then restart the backend.`);
    }
}

function requireDatabase(req, res, next) {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: 'The database is unavailable. Start MongoDB and restart the backend, then try again.',
        });
    }

    next();
}

module.exports = { connectDatabase, requireDatabase };
