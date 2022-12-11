import InstapaperOAuth from "../config/instapaperOAuth";
import {
  BookmarkHighLights,
  HighlightText,
} from "../model/instapaperHighlight";
import logger from "../logger/logging";
import { InstapaperEvernoteService } from "./instapaperevernote.service";

export class InstapaperService {
  constructor(private instapaperEvernoteService: InstapaperEvernoteService) {
    //constructor
  }

  async getAllBookmarkList() {
    try {
      const axiosInstance =
        InstapaperOAuth.getAxiosInstance("/1/bookmarks/list");

      let getBookmarkLists = await axiosInstance
        .get(axiosInstance.defaults.url)
        .then((response) => response.data);

      let highlightBookmarks: Array<BookmarkHighLights> = new Array();

      for (let bookmark of getBookmarkLists) {
        if (bookmark.hash) {
          let highlightTexts = await this.getHighlightedByBookmarkId(
            bookmark.bookmark_id
          );

          if (highlightTexts.length > 0) {
            let highlightBookmark: BookmarkHighLights = {
              BookmarkId: bookmark.bookmark_id,
              EvernoteNoteId: null,
              Title: bookmark.title,
              EvernoteLastUpdated: bookmark.updated,
              HighlightText: highlightTexts,
            };

            highlightBookmarks.push(highlightBookmark);
          }
        }
      }

      return highlightBookmarks;
    } catch (err) {
      logger.error("Error occured:" + err);
    }
  }

  async getHighlightedByBookmarkId(bookmarkId: number) {
    try {
      const axiosInstance = InstapaperOAuth.getAxiosInstance(
        `/1.1/bookmarks/${bookmarkId}/highlights`
      );
      console.log(bookmarkId);
      let getBookmarkLists = await axiosInstance
        .get(axiosInstance.defaults.url)
        .then((response) => response.data);

      let ieObj = await this.instapaperEvernoteService.getEvernoteNoteId(
        bookmarkId
      );
      let highlightBookmarkArray: Array<HighlightText> =
        new Array<HighlightText>();

      getBookmarkLists.map((highBookmark) => {
        let highlightBookmark: HighlightText = {
          highlightId: highBookmark.highlight_id,
          text: highBookmark.text,
          time: highBookmark.time,
        };

        if (ieObj) {
          if (ieObj.lastUpdated && highlightBookmark.time > ieObj.lastUpdated) {
            highlightBookmarkArray.push(highlightBookmark);
          } else {
            highlightBookmarkArray.push(highlightBookmark);
          }
        } else {
          highlightBookmarkArray.push(highlightBookmark);
        }
      });
      return highlightBookmarkArray;
    } catch (err) {
      logger.error("Error occured:" + err);
    }
  }
}
