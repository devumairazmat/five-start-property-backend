import mongoose from 'mongoose';

const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('MongoDB connected!');
};

export default connectDB;
