import mongoose from 'mongoose'

export default async function () {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_CONNECTION_URI)
}
