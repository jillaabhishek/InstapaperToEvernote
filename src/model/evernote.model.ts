import mongoose, { Schema } from "mongoose";

export interface IInstapaperEvernote extends Document {
  instabookmarkId: string;
  evernoteNoteId: string;
  lastUpdated: Number;
}

const instapaperevernoteSchema: Schema = new Schema(
  {
    instabookmarkId: String,
    evernoteNoteId: String,
    lastUpdated: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInstapaperEvernote>(
  "instapaperevernote",
  instapaperevernoteSchema
);
