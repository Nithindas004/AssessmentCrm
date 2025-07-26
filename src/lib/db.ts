import mongoose from 'mongoose';

// This helps manage the connection state
let isConnected: boolean = false;

const connectToDB = async () => {
  // Set strict query mode for Mongoose to prevent unknown field queries.
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env.local');
  }

    try {
      
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'mini_crm', // Specify your database name here
    });
        console.log(db?.connection?.db?.databaseName)

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectToDB;