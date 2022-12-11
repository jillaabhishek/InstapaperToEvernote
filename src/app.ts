import Evernote from "evernote";
import evernoteConfig from "../EvernoteConfig.json";
import { InstapaperController } from "./controlller/instapaper.controller";
import { EvernoteController } from "./controlller/evernote.controller";
import { InstapaperEvernoteRepository } from "./repository/instapaperevernote.repository";
import { EvernoteService } from "./service/evernote.service";
import { InstapaperService } from "./service/instapaper.service";
import { InstapaperEvernoteService } from "./service/instapaperevernote.service";
import express from "express";
import expressSession from "express-session";
import logger from "./logger/logging";

class App {
  public express: express.Application;

  private instapaperController: InstapaperController;
  private evernoteController: EvernoteController;
  private instapaperEvernoteRepository: InstapaperEvernoteRepository;
  private evernoteService: EvernoteService;
  private instapaperService: InstapaperService;
  private instapaperEvernoteService: InstapaperEvernoteService;

  //
  private evernoteClient: any;
  constructor() {
    //
    this.evernoteClient = new Evernote.Client({
      token: evernoteConfig.token,
      sandbox: evernoteConfig.Sandbox,
    });

    this.express = express();
    const port = process.env.PORT || 3070;

    this.express.set("port", port);
    this.express.use(
      expressSession({
        secret: "supersecretsecret",
        resave: false,
        saveUninitialized: true,
      })
    );

    this.routes();
    this.instapaperEvernoteRepository = new InstapaperEvernoteRepository();

    this.instapaperEvernoteService = new InstapaperEvernoteService(
      this.instapaperEvernoteRepository
    );
    this.instapaperService = new InstapaperService(
      this.instapaperEvernoteService
    );
    this.instapaperController = new InstapaperController(
      this.instapaperService
    );

    this.evernoteService = new EvernoteService(
      this.instapaperEvernoteService,
      this.evernoteClient
    );

    this.evernoteController = new EvernoteController(
      this.evernoteService,
      this.instapaperEvernoteRepository,
      this.instapaperController
    );

    this.express.listen(port, function () {
      logger.info(`Listening on ${port}`);
      console.log(`Express server listening on port ${port}`);
    });
  }

  private routes(): void {
    this.express.get("/TransferHighlightNotes", async (req, res) => {
      await this.evernoteController.transferHighlightsInstapaperToEvernote();
      res.redirect("/completed");
    });

    this.express.get("/oauth", async (req, res) => {
      await this.evernoteController.oauth(req, res);
    });
    this.express.get("/oauth_callback", async (req, res) => {
      await this.evernoteController.oauth_callback(req, res);
    });

    this.express.get("/completed", async (req, res) => {
      res.send("Transfer completed.");
    });

    this.express.get("/", (req, res, next) => {
      let is_authenticated = this.evernoteController.IsAuthenticated();
      if (is_authenticated) {
        res.redirect("/TransferHighlightNotes");
      } else {
        res.redirect("/oauth");
      }
    });

    // handle undefined routes
    this.express.use("*", (req, res, next) => {
      res.send("Make sure url is correct!!!");
    });
  }
}

export default new App().express;
