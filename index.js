const express     = require('express');
const app         = express();
const fs          = require('fs');
const randomColor = require('randomcolor');
const _           = require('lodash');
const { splitSentence, loadDictionnary } = require('words-splitter');

loadDictionnary();

const SECHO = [
  "c mille cho",
  "awi... sécho la",
  "nn mé att, comment sécho",
  "put1, sécho",
  "sécho de ouf...",
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
];
const secho = () => {
  const nb = SECHO.length;
  const n  = Math.floor(Math.random() * nb);
  return SECHO[n];
};

const topic = (text) => {
  let sentence = splitSentence(_.deburr(text));
  return sentence.slice(0, 1).toLocaleUpperCase() + sentence.slice(1) + ' ?';
};

const template = fs.readFileSync('./index.html', { encoding: 'utf8' });
app.get('/', (req, res) => {
  let text        = template;
  let replaced    = false;
  const hostParts = req.headers.host.split('.');
  const SECHO     = secho();

  if (hostParts.length > 2) {
    const subDomain = hostParts[0];
    if (subDomain && subDomain !== 'www') {
      const TOPIC = topic(subDomain);
      text = text.replace('{{TOPIC}}', TOPIC);
      text = text.replace('{{OG_TITLE}}', TOPIC);
      text = text.replace('{{OG_DESCRIPTION}}', SECHO);
      text = text.replace('{{OG_URL}}', subDomain);
      replaced = true;
    }
  }

  if (!replaced) {
    text = text.replace('<div class="topic">{{TOPIC}}</div>', '');
    text = text.replace('<meta property="og:description" content="{{OG_DESCRIPTION}}" />', '');
    text = text.replace('{{OG_URL}}', '');
    text = text.replace('{{OG_TITLE}}', SECHO);
  }

  text = text.replace('{{SECHO}}', SECHO);
  text = text.replace('{{COLOR}}', randomColor({ luminosity: 'dark' }));

  res.send(text);
});

app.use(express.static('public'));

app.listen(8080, () => {
  console.log('sécho.fr ready on port 8080');
});
