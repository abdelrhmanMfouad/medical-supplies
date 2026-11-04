import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING_SOON' | 'EXPIRED' | 'INFO' | 'WARNING';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  itemId?: mongoose.Types.ObjectId;
  itemName?: string;
  quantity?: number;
  reorderLevel?: number;
  expiryDate?: Date;
  status: 'ACTIVE' | 'DISMISSED' | 'RESOLVED';
  dismissedAt?: Date;
  resolvedAt?: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    type: {
      type: String,
      enum: ['LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRING_SOON', 'EXPIRED', 'INFO', 'WARNING'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    itemName: { type: String },
    quantity: { type: Number },
    reorderLevel: { type: Number },
    expiryDate: { type: Date },
    status: {
      type: String,
      enum: ['ACTIVE', 'DISMISSED', 'RESOLVED'],
      default: 'ACTIVE',
    },
    dismissedAt: { type: Date },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IAlert>('Alert', AlertSchema);