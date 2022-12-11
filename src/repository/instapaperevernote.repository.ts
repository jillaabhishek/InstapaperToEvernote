import mongoose from "mongoose";
import logger from "../logger/logging";
import InstapaperEvernote, {
  IInstapaperEvernote,
} from "../model/evernote.model";
import { connectMongoDb } from "../config/db.config";
import { EvernoteController } from "../controlller/evernote.controller";
import { InstapaperController } from "../controlller/instapaper.controller";

export class InstapaperEvernoteRepository {
  constructor() {
    connectMongoDb();
  }

  async addInstapaperEvernote(bookmarkId: string, evernoteNoteId: string) {
    try {
      const instapaperEvernote = new InstapaperEvernote({
        _id: new mongoose.Types.ObjectId(),
        instabookmarkId: bookmarkId,
        evernoteNoteId: evernoteNoteId,
        lastUpdated: Date.now(),
      });

      return await instapaperEvernote.save();
    } catch (err) {
      logger.error(
        `Error occurre while addInstapaperEvernote, Error message ${err}`
      );
    }
  }

  async getInstapaperEvernoteByBookmarkId(
    bookmark_id
  ): Promise<IInstapaperEvernote> {
    try {
      return await InstapaperEvernote.findOne({ instabookmarkId: bookmark_id });
    } catch (err) {
      logger.error(
        `Error occurre while getEvernoteNoteId, Error message ${err}`
      );
    }
  }

  async getInstapaperEvernoteByEvernoteId(
    evernote_noteid
  ): Promise<IInstapaperEvernote> {
    try {
      return await InstapaperEvernote.findOne({
        evernoteNoteId: evernote_noteid,
      });
    } catch (err) {
      logger.error(
        `Error occurre while getInstapaperBookmarkId, Error message ${err}`
      );
    }
  }

  async transferInstapaperToEvernote(
    evernoteController: EvernoteController,
    instapaperController: InstapaperController
  ) {
    try {
      let notebookId = await evernoteController.createNotebook();
      if (notebookId) {
        let hightlightedBookList =
          await instapaperController.getAllBookmarkList();
        if (hightlightedBookList.length > 0) {
          await hightlightedBookList.map(async (highlightedBookmark) => {
            await evernoteController.AddOrUpdateNote(
              highlightedBookmark,
              notebookId
            );
          });
        }
      }
    } catch (err) {
      logger.error(err);
    }
  }
}
