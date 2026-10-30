FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache unzip
COPY UTDSS_Website_Download_Again.zip /tmp/utdss.zip
RUN unzip -q /tmp/utdss.zip -d /app && rm /tmp/utdss.zip
COPY patch-site.mjs /tmp/patch-site.mjs
COPY match-reference.mjs /tmp/match-reference.mjs
COPY generate-hd-images.mjs /tmp/generate-hd-images.mjs
COPY reference-layout.html /tmp/reference-layout.html
COPY assets/customer-support-lady.svg /app/assets/customer-support-lady.svg
COPY configure-assistant.mjs /tmp/configure-assistant.mjs
COPY defence.html maritime.html energy.html industrial.html aviation.html /app/
RUN cp /tmp/reference-layout.html /app/index.html && node /tmp/configure-assistant.mjs
RUN cd /app/server && npm install --omit=dev --no-audit --no-fund
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server/server.js"]
