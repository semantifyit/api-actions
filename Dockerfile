FROM node:13-alpine AS builder

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh make gcc g++ python

#WORKDIR /usr/src/app/server
COPY server/package*.json /usr/src/app/server
#RUN npm ci
RUN cd /usr/src/app/server && npm i
COPY server/ /usr/src/app/server
RUN cd /usr/src/app/server && npm run build

#WORKDIR /usr/src/app/client
COPY client/package*.json /usr/src/app/client
#RUN npm ci
RUN cd /usr/src/app/client && npm i
COPY client/ /usr/src/app/client
RUN cd /usr/src/app/client && npm run build


FROM node:13-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app/server
COPY --from=builder /usr/src/app/client/build ../client/build
COPY --from=builder /usr/src/app/server/node_modules ./node_modules
COPY --from=builder /usr/src/app/server/dist dist

USER node

EXPOSE 8012

CMD ["node", "./dist/server"]
