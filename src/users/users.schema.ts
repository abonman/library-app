import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Book } from '../books/books.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, type: Object })
    books: {
        past: Book[],
        present: Book[]
    }

    @Prop({ required: true })
    createdAt: Date;

    @Prop()
    deletedAt?: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);