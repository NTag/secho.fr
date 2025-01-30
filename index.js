const express = require("express");
const app = express();
const fs = require("fs");
const randomColor = require("randomcolor");
const _ = require("lodash");
const puppeteer = require("puppeteer");
const useragent = require("express-useragent");
const punycode = require("punycode");
const { addWord, splitSentence, loadDictionary } = require("words-splitter");

app.use(useragent.express());

loadDictionary().then(() => {
  if (process.env.WORDS) {
    process.env.WORDS.split(",").forEach(addWord);
  }
});

const SECHO = [
  "c mille cho",
  "awi... sécho la",
  "nn mé att, comment sécho",
  "put1, sécho",
  "sécho de ouf...",
  "sécho 2 ouf",
  "sécho comme même...",
  "c tro chaud put1",
  "sécho sécho!",
  "sé comme même cho",
  "euu, la sa devi1 cho",
  "c 1000 cho de ouf",
  "comment c tro cho...",
  "awi, la sécho..",
  "... sécho ...",
  "sécho, tavu?",
  "la sé cho de MILLE de ouf!",
  "c vréman cho la...",
  "tsé, la sécho.",
  "tavu comment sécho oupas?",
  "nan mais la, sé juste cho o_O!",
  "mais non, mais sécho tsé !",
  "de ouf sécho...",
  "ok, la, sécho",
  "séchooooooooo",
  "sé tro tro cho",
  "sécho.",
  "parait la sécho",
  "sééééé chooooo",
  "là, it's very cho..",
  "awi awé, sécho...",
  "juste, sécho.",
  "sé-cho",
  "cé vrément tro mille cho tsé",
  "azy sécho la",
  "euuuh, mais sécho!",
  "nn mé, c vréman cho",
  "sécho, mais de ouf quoi",
  "bah, la.. sécho",
  "séch😵",
  "sé, juste, cho",
  "sécho, çtout.",
  "jcroi tapavu komen sécho !",
  "bah, séchooo",
  "s é c h o",
  "c cro cro cho",
  "ⓢⓔⓒⓗⓞ",
  "sé 1000 cho",
  "a naan mé la... sécho",
  "c juste tro tro tro tro tro tro cho",
  "g jamé ri1 vu d’aussi cho",
  "ben dis donc, sé bien cho..",
  "hihihi sécho",
  "sécho bro",
  "s-é-c-h-o",
  "c 😶 cho",
  "c 😶 c 😶 h 😶 o",
  "c juste tellement cho",
  "g plu d'mots tellement sécho",
  "sécho",
  "c cho",
  "sécho hihi",
  "comme même sécho",
  "sécho tî boubou !",
  "et bah tî boubou, sécho...",
  "mon tî boubou, comment sécho..",
  "c komeme 1000 cho",
  "c komeme cho...",
  "c vrémen *très* cho",
  "sé méga cho la..",
  "sé bien cho comme même",
  "sécho de fou!",
  "ah bah oui sécho...",
  "ça me gêne tellement sécho..",
  "c genau cho",
  "es ist sehr chaud…",
  "c’est moi ou c’est chaud ?",
  "j’crois t’as pas bien vu comment c cho",
  "c cho. point.",
  "sécho y a pas de débat 💁‍♂️",
  "sé-cho 💁‍♂️",
  "c mille mille cho",
  "c archi chaud de mille de ouf",
  "c 1 peu trop beaucoup cho",
  "j’aime pas trop beaucoup comment c cho",
  "c’est très beaucoup cho.",
];
const secho = () => {
  const nb = SECHO.length;
  const n = Math.floor(Math.random() * nb);
  return SECHO[n];
};

const topic = (text) => {
  const sentence = splitSentence(text.toLocaleLowerCase());
  return sentence.slice(0, 1).toLocaleUpperCase() + sentence.slice(1) + " ?";
};

const template = fs.readFileSync("./index.html", { encoding: "utf8" });
app.get("/", async (req, res) => {
  if (req.useragent.source.match(/TelegramBot/)) {
    await page.goto(`https://${req.headers.host}`);
    const img = await page.screenshot();
    res.contentType("image/png");
    res.send(img);
  } else {
    const host = punycode.toUnicode(req.headers.host);
    let text = template;
    let replaced = false;
    const hostParts = host.split(".");
    const SECHO = secho();

    if (hostParts.length > 2) {
      const subDomain = hostParts[0];
      if (subDomain && subDomain !== "www") {
        const TOPIC = topic(subDomain);
        text = text.replace(/{{TOPIC}}/g, TOPIC);
        text = text.replace(/{{OG_TITLE}}/g, TOPIC);
        text = text.replace(/{{OG_DESCRIPTION}}/g, SECHO);
        text = text.replace(/{{OG_URL}}/g, `${subDomain}.`);
        replaced = true;
      }
    }

    if (!replaced) {
      text = text.replace('<div class="topic">{{TOPIC}}</div>', "");
      text = text.replace(
        '<meta property="og:description" content="{{OG_DESCRIPTION}}" />',
        ""
      );
      text = text.replace(
        '<meta property="twitter:description" content="{{OG_DESCRIPTION}}" />',
        ""
      );
      text = text.replace(/{{OG_URL}}/g, "");
      text = text.replace(/{{TOPIC}}/g, "");
      text = text.replace(/{{OG_TITLE}}/g, SECHO);
    }

    text = text.replace(/{{SECHO}}/g, SECHO);
    text = text.replace(/{{COLOR}}/g, randomColor({ luminosity: "dark" }));

    res.send(text);
  }
});

app.get("/oembed", async (req, res) => {
  const hostParts = req.headers.host.split(".");
  const SECHO = secho();

  const o = {
    version: "1.0",
    type: "photo",
    width: 800,
    height: 600,
    title: SECHO,
    url: `https://${req.headers.host}/img`,
    author_name: "sécho",
    author_url: `https://${req.headers.host}`,
    provider_name: "sécho",
    provider_url: "https://sécho.fr",
  };

  if (hostParts.length > 2) {
    const subDomain = hostParts[0];
    if (subDomain && subDomain !== "www") {
      const TOPIC = topic(subDomain);
      o.title = `${TOPIC} ? ${SECHO}`;
    }
  }

  res.send(o);
});

app.get("/img", async (req, res) => {
  await page.goto(`https://${req.headers.host}`);
  const img = await page.screenshot();
  res.contentType("image/png");
  res.send(img);
});

app.use(express.static("public"));

let page;
const main = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  page = await browser.newPage();

  app.listen(8080, () => {
    console.log("sécho.fr ready on port 8080");
  });
};

main();
