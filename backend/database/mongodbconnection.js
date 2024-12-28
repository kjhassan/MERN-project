import mongoose from 'mongoose';

const connectdb = async () => {
    try {

        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('MongoDB Connected...');
        
    } catch (error) {
        console.log("Error conecting to database", error.message)
    }


};

export default connectdb;