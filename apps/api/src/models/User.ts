import mongoose, { Schema, Document } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    twoFAEnabled?: boolean;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    twoFAEnabled: { type: Boolean, default: false },
    avatarUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// 3. Create a Model.
const User = mongoose.model<IUser>('Users', userSchema);

export default User;