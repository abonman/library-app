import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { identity } from 'rxjs';

export type BookDocument = Book & Document;

@Schema()
export class Book {
    constructor(bookId: string, name: string, score: number, Istaken: boolean) {
        this.bookId = bookId
        this.name = name
        this.score = score
        this.Istaken = Istaken
    }
    @Prop({ unique: true, auto: false, type: String })
    bookId: string

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: Number })
    score: number;

    @Prop({ type: Boolean })
    Istaken: boolean

}

export const BookSchema = SchemaFactory.createForClass(Book);