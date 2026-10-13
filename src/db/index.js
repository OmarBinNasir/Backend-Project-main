import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
  const configuredUri = process.env.MONGODB_URI;
  if (!configuredUri) {
    throw new Error('MONGODB_URI is required');
  }

  // Accept either a URI that already includes a database path or a cluster URI
  // without one. Docker's replica-set URI includes /videotube explicitly.
  const hasDatabasePath = /^mongodb(?:\+srv)?:\/\/[^/]+\/[^?]+/.test(configuredUri);
  const uri = hasDatabasePath
    ? configuredUri
    : `${configuredUri.replace(/\/$/, '')}/${DB_NAME}`;

  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 50),
    minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 0),
  });

  console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  return connection;
};

export default connectDB;
