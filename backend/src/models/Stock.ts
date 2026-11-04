import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  itemId: mongoose.Types.ObjectId;
  type: 'IN' | 'OUT';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  unit: string;                          // ✅ أضف
  unitPrice: number;
  totalPrice: number;
  reference?: string;
  notes?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;                       // ✅ أضف
  updatedAt: Date;                       // ✅ أضف
}

const StockSchema = new Schema<IStock>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    type: { type: String, enum: ['IN', 'OUT'], required: true },
    quantity: { type: Number, required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    unit: { type: String, default: 'pcs' },  // ✅ أضف
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    reference: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
      default: 'COMPLETED',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }  // ✅ يضيف createdAt و updatedAt تلقائياً
);

export default mongoose.model<IStock>('Stock', StockSchema);