import Evernote, { oauth_callback } from "evernote";
import evernoteConfig from "../../EvernoteConfig.json";
import logger from "../logger/logging";
import fs from "fs";
import { BookmarkHighLights } from "../model/instapaperHighlight";
import { InstapaperEvernoteService } from "./instapaperevernote.service";

export class EvernoteService {
  private noteStore: any;

  constructor(
    private instapaperEvernoteService: InstapaperEvernoteService,
    private evernoteClient: any
  ) {
    this.noteStore = this.evernoteClient.getNoteStore();
  }

  IsAuthenticated(): boolean {
    try {
      if (!evernoteConfig.token) {
        return false;
      } else if (
        evernoteConfig.tokenExpirationTimestamp == 0 ||
        evernoteConfig.tokenExpirationTimestamp < Date.now()
      ) {
        return false;
      }

      return true;
    } catch (err) {
      logger.error(err);
    }
  }

  async oauth(req, res) {
    var client = new Evernote.Client({
      consumerKey: evernoteConfig.consumerKey,
      consumerSecret: evernoteConfig.consumerSecret,
      sandbox: evernoteConfig.Sandbox,
    });

    await client.getRequestToken(
      "http://localhost:3070/oauth_callback",
      async function (error, oauthToken, oauthTokenSecret, results) {
        if (error) {
          logger.error(error);
        } else {
          req.session.oauthToken = oauthToken;
          req.session.oauthTokenSecret = oauthTokenSecret;

          res.redirect(client.getAuthorizeUrl(oauthToken));
        }
      }
    );
  }

  async oauth_callback(req, res) {
    var client = new Evernote.Client({
      consumerKey: evernoteConfig.consumerKey,
      consumerSecret: evernoteConfig.consumerSecret,
      sandbox: evernoteConfig.Sandbox,
    });

    client.getAccessToken(
      req.session.oauthToken,
      req.session.oauthTokenSecret,
      req.query.oauth_verifier,
      function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if (error) {
          logger.error(error);
          res.redirect("/");
        } else {
          evernoteConfig.token = oauthAccessToken;
          evernoteConfig.tokenExpirationTimestamp = parseInt(
            results.edam_expires
          );

          fs.writeFileSync(
            "EvernoteConfig.json",
            JSON.stringify(evernoteConfig, null, 2)
          );

          res.redirect("/TransferHighlightNotes");
        }
      }
    );
  }

  async evernoteNoteStore() {
    try {
      return await this.noteStore.listNotebooks(evernoteConfig.token);
    } catch (err) {
      logger.error(err);
    }
  }

  async createNotebook(): Promise<string> {
    try {
      if (!evernoteConfig.NoteBookGuidId) {
        let noteBook = await this.noteStore.createNotebook({
          name: "Instapaper Notes",
          defaultNotebook: false,
        });
        console.log("Notebook Created. Guid:" + noteBook.guid);
        evernoteConfig.NoteBookGuidId = noteBook.guid;
        fs.writeFileSync(
          "EvernoteConfig.json",
          JSON.stringify(evernoteConfig, null, 2)
        );

        return noteBook.guid;
      }

      return evernoteConfig.NoteBookGuidId;
    } catch (err) {
      logger.error("Error occured:" + err);
    }
  }

  async createNote(
    BookmarkHighLight: BookmarkHighLights,
    parentNodeGuid: string
  ) {
    var nBody = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
                      <!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">
                      <en-note> ${BookmarkHighLight.HighlightText.map(
                        (x) => x.text
                      ).join("<br/><br/>")}</en-note>`;

    let note = await this.noteStore.createNote({
      title: BookmarkHighLight.Title,
      content: nBody,
      notebookGuid: parentNodeGuid,
    });
    await this.instapaperEvernoteService.addInstapaperEvernote(
      BookmarkHighLight.BookmarkId.toString(),
      note.guid
    );
  }

  async updateNote(BookmarkHighLight: BookmarkHighLights) {
    let nBody = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
                      <!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">
                      <en-note> ${BookmarkHighLight.HighlightText.map(
                        (x) => x.text
                      ).join("<br/><br/>")}</en-note>`;

    await this.noteStore.updateNote({
      guid: BookmarkHighLight.EvernoteNoteId,
      title: BookmarkHighLight.Title,
      content: nBody,
    });
  }

  async GetNote(noteId: string) {
    try {
      return await this.noteStore.getNote(noteId, true, true, false, false);
    } catch (err) {
      logger.error("Error occured:" + err);
    }
    return null;
  }

  async AddOrUpdateNote(
    BookmarkHighLight: BookmarkHighLights,
    parentNodeGuid: string
  ) {
    try {
      if (BookmarkHighLight.BookmarkId) {
        let isAdd = true;
        let ieobj = await this.instapaperEvernoteService.getEvernoteNoteId(
          BookmarkHighLight.BookmarkId
        );
        if (ieobj) {
          let note = await this.GetNote(ieobj.evernoteNoteId);
          if (note) {
            isAdd = false;
            BookmarkHighLight.EvernoteNoteId = note.guid;
            this.updateNote(BookmarkHighLight);
          }
        }

        if (isAdd) {
          this.createNote(BookmarkHighLight, parentNodeGuid);
        }
      }
    } catch (err) {
      logger.error("Error occured:" + err);
    }
  }
}
