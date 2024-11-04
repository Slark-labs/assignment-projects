import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

import { Document, ObjectId, Types } from 'mongoose';
import { Course } from './course.model';

@Schema()
export class User extends Document {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: () => Course }] })
  coursesId: ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
