import mongoose from 'mongoose'

async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/code-campus-appraisal'

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  return mongoose.connect(uri)
}

export default connectDb
