import { BookmarkHighLights } from "../model/instapaperHighlight";
import { EvernoteService } from "../service/evernote.service";
import { InstapaperEvernoteRepository } from "../repository/instapaperevernote.repository";
import { InstapaperController } from "./instapaper.controller";

export class EvernoteController {
  constructor(
    private evernoteService: EvernoteService,
    private instapaperEvernoteRepository: InstapaperEvernoteRepository,
    private instapaperController: InstapaperController
  ) {
    //Constructor
  }

  IsAuthenticated(): boolean {
    return this.evernoteService.IsAuthenticated();
  }

  async oauth(req, res) {
    await this.evernoteService.oauth(req, res);
  }

  async oauth_callback(req, res) {
    await this.evernoteService.oauth_callback(req, res);
  }

  async evernoteNoteStore() {
    return await this.evernoteService.evernoteNoteStore();
  }

  async createNotebook() {
    return await this.evernoteService.createNotebook();
  }

  async createNote(
    BookmarkHighLight: BookmarkHighLights,
    parentNodeGuid: string
  ) {
    return await this.evernoteService.createNote(
      BookmarkHighLight,
      parentNodeGuid
    );
  }

  async updateNote(BookmarkHighLight: BookmarkHighLights) {
    return await this.evernoteService.updateNote(BookmarkHighLight);
  }

  async GetNote(noteId: string) {
    return await this.evernoteService.GetNote(noteId);
  }

  async AddOrUpdateNote(
    BookmarkHighLight: BookmarkHighLights,
    parentNodeGuid: string
  ) {
    return await this.evernoteService.AddOrUpdateNote(
      BookmarkHighLight,
      parentNodeGuid
    );
  }

  async transferHighlightsInstapaperToEvernote() {
    await this.instapaperEvernoteRepository.transferInstapaperToEvernote(
      this,
      this.instapaperController
    );
  }
}
