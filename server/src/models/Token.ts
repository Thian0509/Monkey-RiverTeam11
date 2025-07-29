import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false }
}, {
  timestamps: true
})

export default mongoose.model('Token', tokenSchema, 'tokens')