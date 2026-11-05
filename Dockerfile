FROM node:24-slim

# Chromium renders the link previews (og:image, Telegram); the fonts cover
# the emoji and the main scripts of the sentences.
RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium fonts-noto-color-emoji fonts-liberation fonts-ipafont-gothic fonts-wqy-zenhei \
    && rm -rf /var/lib/apt/lists/*
# The word list that splits subdomains into words (words-splitter) takes
# about 1 GB of heap.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1200

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .

USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get({host: '127.0.0.1', port: 8080, path: '/', headers: {host: 'xn--scho-bpa.fr'}}, (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "."]
