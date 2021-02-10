import { RTMClient } from "@slack/rtm-api";
import { WebClient } from "@slack/web-api";
const imdb = require("imdb-api");

const imdbClient = imdb.Client({
  apiKey: process.env.IMDB_API_KEY,
});

const packageJson = require("../package.json");
import { SLACK_OAUTH_TOKEN, BOT_SPAM_CHANNEL } from "./config";

const rtm = new RTMClient(SLACK_OAUTH_TOKEN);
const web = new WebClient(SLACK_OAUTH_TOKEN);

rtm.start().catch(console.error);

rtm.on("ready", async () => {
  console.log("bot started");
  sendMessage(
    BOT_SPAM_CHANNEL,
    `Bot version ${packageJson.version} is online.`
  );
});

rtm.on("slack_event", async (eventType, event) => {
  if (event && event.type === "message") {
    if (event.text.startsWith("movie:")) {
      await imdb
        .get(
          {
            name: event.text.replace("movie:", ""),
            baseURL: "https://www.omdbapi.com/?apikey=3a04e162&i=tt3896198",
          },
          { apiKey: process.env.IMDB_API_KEY }
        )
        .then((_movie) => {
          movie(event.channel, _movie);
        })
        .catch((_movie) => notFound(event.channel, _movie));
      // hello(event.channel, event.user);
    }
  }
});

function notFound(channelId, message) {
  sendMessage(channelId, message.message);
}

function movie(channelId, movie) {
  sendMessage(channelId, `Movie: ${movie.title}`, {
    attachments: [
      {
        image_url: movie.poster,
        fields: [
          {
            title: "Year",
            value: movie.year,
            short: true,
          },
          {
            title: `Rating (${movie.votes})`,
            value: movie.rating,
            short: true,
          },
          {
            title: "Country",
            value: movie.country,
            short: true,
          },
          {
            title: "Language",
            value: movie.languages,
            short: true,
          },
        ],
      },
      {
        title: "Director",
        text: movie.director,
      },
      {
        title: "Link",
        actions: [
          {
            name: "link",
            text: "IMDb link",
            type: "button",
            url: movie.imdburl,
          },
        ],
      },
    ],
  });
}

function hello(channelId, userId) {
  sendMessage(channelId, `Hello! <@${userId}>`);
}

async function sendMessage(channel, message, body = {}) {
  await web.chat.postMessage({
    channel: channel,
    text: message,
    ...body,
  });
}
