import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  jti: string;
  revoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jti: { type: String, required: true, unique: true },
  revoked: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

const Session = mongoose.model<ISession>('Session', sessionSchema);

export default Session;