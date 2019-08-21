import { browser, element, by, By, ElementFinder, ElementArrayFinder, promise, protractor } from "protractor";
import * as request from "request";
import * as fs from 'fs';

export class Service {
  getVideo(url: string = "http://54.169.34.162:5252/video") {
    let self = this;
    let defer = promise.defer<string>();
    request(url, (error, response, body) => {
      if (error || response.statusCode >= 400) {
        defer.reject(JSON.stringify({
          error: error,
          message: body
        }));
      } else {
        defer['resolve'](body);
      }
    });
    return defer.promise;
  };

  postJson(url: string, date) {
    let self = this;
    let defer = promise.defer<any>();
    request({
      url: url,
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data",
      },
      formData: {
        "file": fs.createReadStream(date)
      }
    }, (error, response, body) => {
      if (error || response.statusCode >= 400) {
        defer.reject(JSON.stringify({
          error: error,
          message: body
        }));
      } else {
        defer['resolve'](response);
      }
    });
    return defer.promise;
  };
}