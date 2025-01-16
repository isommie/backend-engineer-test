import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const TokenSchema: Schema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Token = mongoose.model<IToken>('Token', TokenSchema);
