import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  sku: string;
  categoryId: mongoose.Types.ObjectId;
  supplierId: mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  location: string;
  expiryDate?: Date;
  description?: string;
  totalValue?: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING_SOON';
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    reorderLevel: { type: Number, required: true, default: 50 },
    location: { type: String, required: true },
    expiryDate: { type: Date },
    description: { type: String },
    totalValue: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRING_SOON'],
      default: 'IN_STOCK',
    },
  },
  { timestamps: true }
);

// ✅ Auto-update status and totalValue before saving
ItemSchema.pre('save', function () {
  if (this.quantity === 0) {
    this.status = 'OUT_OF_STOCK';
  } else if (this.quantity <= this.reorderLevel) {
    this.status = 'LOW_STOCK';
  } else {
    this.status = 'IN_STOCK';
  }
  this.totalValue = this.quantity * this.unitPrice;
  console.log('📊 Pre-save status:', this.status, 'Quantity:', this.quantity);
});
export default mongoose.model<IItem>('Item', ItemSchema);