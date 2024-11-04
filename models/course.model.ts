import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Date, Document, ObjectId, Types } from 'mongoose';
import { User } from './user.model';

@Schema()
export class Course extends Document {
  @Prop({ required: true, trim: true })
  title: string;
  @Prop({ required: true, trim: true })
  duration: string;
  @Prop({
    type: [
      { type: Types.ObjectId, ref: () => User, required: false, default: [] },
    ],
  })
  users?: ObjectId[];
}

export const courseSchema = SchemaFactory.createForClass(Course);
