import crypto from "crypto";
import oauth1a from "oauth-1.0a";
import axios from "axios";
import instaOAuth from "../../InstapaperConfig.json";

class InstapaperOAuth {
  static getAxiosInstance(relativeUrl: string) {
    const baseUrl = "https://www.instapaper.com/api";
    const url = baseUrl + relativeUrl;

    const oauth = new oauth1a({
      consumer: {
        key: instaOAuth.ConsumerKey,
        secret: instaOAuth.ConsumerSecret,
      },
      signature_method: "HMAC-SHA1",
      hash_function(base_string, key) {
        return crypto
          .createHmac("sha1", key)
          .update(base_string)
          .digest("base64");
      },
    });

    const request: any = {
      url: url,
      method: "GET",
    };

    const authorization = oauth.authorize(request, {
      key: instaOAuth.AccessToken,
      secret: instaOAuth.TokenSecret,
    });

    return axios.create({
      url: url,
      headers: oauth.toHeader(authorization),
    });
  }
}

export default InstapaperOAuth;
