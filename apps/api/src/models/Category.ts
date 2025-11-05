import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  icon: string; // e.g. MUI icon name or emoji
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
});

export default mongoose.model<ICategory>('Category', CategorySchema);
