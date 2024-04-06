FROM node:20.12.0-alpine3.19 as base
LABEL authors="ferry"
WORKDIR /usr/app

# install dependencies
# this will cache them and speed up future builds
FROM base AS install
COPY package.json .
COPY yarn.lock .
COPY . .
RUN corepack enable
RUN yarn install

# run the app
EXPOSE 8000 9000
ENTRYPOINT [ "yarn", "run", "develop" ]