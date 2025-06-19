import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class User extends Document {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, default: 'false', enum: ['true', 'false'] })
  isBlocked: string;
}

export const UserSchema = SchemaFactory.createForClass(User);