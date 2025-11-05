import mongoose, { Schema, Document } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface IExpenses extends Document {
    userId: string;
    descrption?: string;
    amount: number;
    currency: string;
    date: Date;
    category: string;
    tags?: string[];
    notes?: string;
    merchant?: string;
    attachmentUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// 2. Create a Schema corresponding to the document interface.
const ExpensesSchema: Schema = new Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    currency: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    notes: { type: String },
    merchant: { type: String },
    attachmentUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Expenses = mongoose.model<IExpenses>('Expenses', ExpensesSchema);

export default Expenses;