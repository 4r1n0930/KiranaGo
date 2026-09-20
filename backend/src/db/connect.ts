import mongoose from 'mongoose';

export async function dbConnect(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGODB_URI (or MONGO_URI) environment variable is not defined.');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error);
    throw error;
  }
}