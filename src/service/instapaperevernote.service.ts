import { InstapaperEvernoteRepository } from "../repository/instapaperevernote.repository";

export class InstapaperEvernoteService {
  constructor(
    private instapaperEvernoteRepository: InstapaperEvernoteRepository
  ) {
    //Constructor
  }

  async addInstapaperEvernote(bookmarkId: string, evernoteNoteId: string) {
    return await this.instapaperEvernoteRepository.addInstapaperEvernote(
      bookmarkId,
      evernoteNoteId
    );
  }

  async getEvernoteNoteId(bookmark_id) {
    return await this.instapaperEvernoteRepository.getInstapaperEvernoteByBookmarkId(
      bookmark_id
    );
  }

  async getInstapaperBookmarkId(evernote_noteid) {
    return await this.instapaperEvernoteRepository.getInstapaperEvernoteByEvernoteId(
      evernote_noteid
    );
  }
}
