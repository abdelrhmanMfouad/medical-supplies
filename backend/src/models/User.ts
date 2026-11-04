import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'staff' | 'viewer';
  phoneNumber?: string;
  avatar?: string;
  department?: string;   // ✅ أضف
  position?: string;     // ✅ أضف
  bio?: string;          // ✅ أضف
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'manager', 'staff', 'viewer'],
      default: 'staff',
    },
    phoneNumber: { type: String },
    avatar: { type: String },
    department: { type: String },   // ✅ أضف
    position: { type: String },     // ✅ أضف
    bio: { type: String },   
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },       // ✅ أضف
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);