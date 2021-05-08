//  linebotの作成

/****************************************************************************************** 
  定数の宣言
*******************************************************************************************/

//  1.OpenWeatherMap API のキー
const APIKEY      = 'cf52bad88188f88490b0ca043b196549';
//  2.lineのアクセストークンキー
const ACCESSTOKEN = "lgUhydq+c0M3m5FmvWZuGiO/mwZ01+zexXWEr8h4dIGklQxM8y8gjJgOKlL0PQZ8j+K9uB10Fxcyo0pNbLbMIqGZ0EO     +0sMBfQrZt9zdU9gQUFcoA6GlB0f/4iFm64cImevQ8/3sJUft4/QE6B+lzgdB04t89/1O/w1cDnyilFU=";
//  3.lineユーザーID
const to          = "Uac745d6b66691b8e82ed7c52e69cec91";
//  4.検索対象の郵便番号
const POSTNUM     = "174-0063";

/****************************************************************************************** 
  メッセージ受信時の動作
*******************************************************************************************/

function doPost(e) {
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // ユーザーのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  // 応答メッセージ用のAPI URL
  var url = 'https://api.line.me/v2/bot/message/reply';

  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESSTOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': userMessage,
      }],
    }),
    });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

//  以下，天気の取得
/****************************************************************************************** 
  天気情報の取得
*******************************************************************************************/

function pushWeatherMessage(text) {
//実際にメッセージを送信する関数を作成します。
//メッセージを送信(push)する時に必要なurlでこれは、皆同じなので、修正する必要ありません。
//この関数は全て基本コピペで大丈夫です。
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + ACCESSTOKEN,
  };

  //toのところにメッセージを送信したいユーザーのIDを指定します。(toは最初の方で自分のIDを指定したので、linebotから自分に送信されることになります。)
  //textの部分は、送信されるメッセージが入ります。createMessageという関数で定義したメッセージがここに入ります。
  var postData = {
    "to" : to,
    "messages" : text
  };

  var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };

  return UrlFetchApp.fetch(url, options);
}


function createWeatherMessage(e) {
  var response = getWeather(POSTNUM);
  if (response != "error") {
      var country = response.city.country,
          cityName = response.city.name;
      var date    = [],
          weather = [],
          icon    = [],
          temperature = [];
      for (var i = 0; i <= 8; i++) {
          if (Number(response.list[i].dt_txt.slice(11, 13)) + 9 > 24) {
              date.push(Number(response.list[i].dt_txt.slice(11, 13)) + 9 - 24);
          }
          else {
              date.push(Number(response.list[i].dt_txt.slice(11, 13)) + 9);
          }
          weather.push(response.list[i].weather[0].main);
          icon.push(response.list[i].weather[0].icon);
          temperature.push((Math.round((Number(response.list[i].main.temp) - 273.15) * 10) / 10).toString() + '℃');
      }
      var message = 
               [{
              "type": "flex",
              "altText": '天気予報',
              "contents": {
                  "type": "bubble",
                  "styles": {
                      "footer": {
                          "separator": true
                      }
                  },
                  "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                          {
                              "type": "text",
                              "text": "天気予報",
                              "weight": "bold",
                              "size": "xxl",
                              "margin": "md"
                          },
                          {
                              "type": "text",
                              "text": country + '.' + cityName,
                              "size": "md",
                              "color": "#aaaaaa",
                              "wrap": true
                          },
                          {
                              "type": "separator",
                              "margin": "xxl"
                          },
                          {
                              "type": "box",
                              "layout": "vertical",
                              "margin": "xxl",
                              "spacing": "sm",
                              "contents": [
                                  {
                                      "type": "box",
                                      "layout": "baseline",
                                      "contents": [
                                          {
                                              "type": "text",
                                              "text": date[0] + ":00",
                                              "size": "sm",
                                              "color": "#555555",
                                              "flex": 0
                                          },
                                          {
                                              "type": "text",
                                              "text": weather[0],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          },
                                          {
                                              "type": "icon",
                                              "url": "https://openweathermap.org/img/w/" + icon[0] + ".png",
                                              "size": "xl"
                                          },
                                          {
                                              "type": "text",
                                              "text": temperature[0],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          }
                                      ]
                                  },
                                  {
                                      "type": "box",
                                      "layout": "baseline",
                                      "contents": [
                                          {
                                              "type": "text",
                                              "text": date[1] + ":00",
                                              "size": "sm",
                                              "color": "#555555",
                                              "flex": 0
                                          },
                                          {
                                              "type": "text",
                                              "text": weather[1],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          },
                                          {
                                              "type": "icon",
                                              "url": "https://openweathermap.org/img/w/" + icon[1] + ".png",
                                              "size": "xl"
                                          },
                                          {
                                              "type": "text",
                                              "text": temperature[1],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          }
                                      ]
                                  },
                                  {
                                      "type": "box",
                                      "layout": "baseline",
                                      "contents": [
                                          {
                                              "type": "text",
                                              "text": date[2] + ":00",
                                              "size": "sm",
                                              "color": "#555555",
                                              "flex": 0
                                          },
                                          {
                                              "type": "text",
                                              "text": weather[2],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          },
                                          {
                                              "type": "icon",
                                              "url": "https://openweathermap.org/img/w/" + icon[2] + ".png",
                                              "size": "xl"
                                          },
                                          {
                                              "type": "text",
                                              "text": temperature[2],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          }
                                      ]
                                  },
                                  {
                                      "type": "box",
                                      "layout": "baseline",
                                      "contents": [
                                          {
                                              "type": "text",
                                              "text": date[3] + ":00",
                                              "size": "sm",
                                              "color": "#555555",
                                              "flex": 0
                                          },
                                          {
                                              "type": "text",
                                              "text": weather[3],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          },
                                          {
                                              "type": "icon",
                                              "url": "https://openweathermap.org/img/w/" + icon[3] + ".png",
                                              "size": "xl"
                                          },
                                          {
                                              "type": "text",
                                              "text": temperature[3],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          }
                                      ]
                                  },
                                  {
                                      "type": "box",
                                      "layout": "baseline",
                                      "contents": [
                                          {
                                              "type": "text",
                                              "text": date[4] + ":00",
                                              "size": "sm",
                                              "color": "#555555",
                                              "flex": 0
                                          },
                                          {
                                              "type": "text",
                                              "text": weather[4],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          },
                                          {
                                              "type": "icon",
                                              "url": "https://openweathermap.org/img/w/" + icon[4] + ".png",
                                              "size": "xl"
                                          },
                                          {
                                              "type": "text",
                                              "text": temperature[4],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          }
                                      ]
                                  },
                                  {
                                      "type": "box",
                                      "layout": "baseline",
                                      "contents": [
                                          {
                                              "type": "text",
                                              "text": date[5] + ":00",
                                              "size": "sm",
                                              "color": "#555555",
                                              "flex": 0
                                          },
                                          {
                                              "type": "text",
                                              "text": weather[5],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          },
                                          {
                                              "type": "icon",
                                              "url": "https://openweathermap.org/img/w/" + icon[5] + ".png",
                                              "size": "xl"
                                          },
                                          {
                                              "type": "text",
                                              "text": temperature[5],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          }
                                      ]
                                  },
                                  {
                                      "type": "box",
                                      "layout": "baseline",
                                      "contents": [
                                          {
                                              "type": "text",
                                              "text": date[6] + ":00",
                                              "size": "sm",
                                              "color": "#555555",
                                              "flex": 0
                                          },
                                          {
                                              "type": "text",
                                              "text": weather[6],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          },
                                          {
                                              "type": "icon",
                                              "url": "https://openweathermap.org/img/w/" + icon[6] + ".png",
                                              "size": "xl"
                                          },
                                          {
                                              "type": "text",
                                              "text": temperature[6],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          }
                                      ]
                                  },
                                  {
                                      "type": "box",
                                      "layout": "baseline",
                                      "contents": [
                                          {
                                              "type": "text",
                                              "text": date[7] + ":00",
                                              "size": "sm",
                                              "color": "#555555",
                                              "flex": 0
                                          },
                                          {
                                              "type": "text",
                                              "text": weather[7],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          },
                                          {
                                              "type": "icon",
                                              "url": "https://openweathermap.org/img/w/" + icon[7] + ".png",
                                              "size": "xl"
                                          },
                                          {
                                              "type": "text",
                                              "text": temperature[7],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          }
                                      ]
                                  },
                                  {
                                      "type": "box",
                                      "layout": "baseline",
                                      "contents": [
                                          {
                                              "type": "text",
                                              "text": date[8] + ":00",
                                              "size": "sm",
                                              "color": "#555555",
                                              "flex": 0
                                          },
                                          {
                                              "type": "text",
                                              "text": weather[8],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          },
                                          {
                                              "type": "icon",
                                              "url": "https://openweathermap.org/img/w/" + icon[8] + ".png",
                                              "size": "xl"
                                          },
                                          {
                                              "type": "text",
                                              "text": temperature[8],
                                              "size": "sm",
                                              "color": "#111111",
                                              "align": "end"
                                          }
                                      ]
                                  }
                              ]
                          },
                          {
                              "type": "separator",
                              "margin": "xxl"
                          }
                      ]
                  }
              }
      }]
  } else {
      var message = 
       [{
              "type": "text",
              "text": "天気情報の取得に失敗しました．"
          }]
  }
  pushWeatherMessage(message);
}

function getWeather(e) {
  try {
      var apiKey = APIKEY;
      var url = 'http://api.openweathermap.org/data/2.5/forecast' + '?zip=' + e + ',jp&APPID=' + apiKey;
      var response = UrlFetchApp.fetch(url);
      return JSON.parse(response);
      Logger.log(response.list[0])
  } catch (e) {
      return "error";
  }
}