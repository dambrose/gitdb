FROM node:18-alpine as install
RUN mkdir /srv/app
WORKDIR /srv/app
COPY package.json yarn.lock tsconfig.json /srv/app/
RUN yarn install && yarn cache clean
COPY . .

FROM install as test
RUN yarn test

FROM install as build
RUN yarn build

FROM node:18-alpine
RUN apk update && apk add git
COPY --from=build /srv/app/dist /srv/app
COPY package.json yarn.lock /srv/app/
WORKDIR /srv/app
RUN yarn install --prod && yarn cache clean
VOLUME "/data"
ENV GIT_PATH /data
ENV GIT_BRANCH main
ENV PORT 80
CMD ["node", "index.js"]