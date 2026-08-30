const mongoose = require('mongoose');

const connectionDB = async () => {
    try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected');
    } catch (error) {
        console.error("DB connection Failed", error);
        process.exit(1);
    }
};


module.exports = connectionDB






