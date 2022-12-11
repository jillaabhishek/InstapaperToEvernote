import { InstapaperService } from "../service/instapaper.service";

export class InstapaperController {
  constructor(private instapaperService: InstapaperService) {
    //constructor
  }

  async getAllBookmarkList() {
    let BookmarkHighLights = await this.instapaperService.getAllBookmarkList();
    return BookmarkHighLights;
  }

  async getHighlightedByBookmarkId(bookmarkId: number) {
    return await this.instapaperService.getHighlightedByBookmarkId(bookmarkId);
  }
}
