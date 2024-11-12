// src/modules/user/schemas/user.schema.ts

import { Schema, Document } from 'mongoose';

// Address Schema for current and postal address
const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

// Main User Schema
export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  role: { type: String, enum: ['visitor', 'user', 'admin'], default: 'visitor' },
  phone: { type: String },
  currentAddress: { type: AddressSchema, required: true },
  postalAddress: { type: AddressSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Interface for TypeScript to ensure strong typing
export interface User extends Document {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'visitor' | 'user' | 'admin';
  phone: string;
  currentAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  postalAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
