import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // ✅ Required for auth
  role: { type: String, enum: ['admin', 'participant'], default: 'participant' },
}, {
  timestamps: true
})


export default mongoose.model('User', userSchema, 'users') // force collection name