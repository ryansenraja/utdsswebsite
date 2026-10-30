FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache unzip
COPY UTDSS_Website_Download_Again.zip /tmp/utdss.zip
RUN unzip -q /tmp/utdss.zip -d /app && rm /tmp/utdss.zip
COPY patch-site.mjs /tmp/patch-site.mjs
COPY generate-hd-images.mjs /tmp/generate-hd-images.mjs
RUN node /tmp/generate-hd-images.mjs && node /tmp/patch-site.mjs
RUN cd /app/server && npm install --omit=dev --no-audit --no-fund
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server/server.js"]
