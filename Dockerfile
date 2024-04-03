FROM node:20.12.0-alpine3.19 as base
LABEL authors="ferry"
WORKDIR /usr/app

# install dependencies
# this will cache them and speed up future builds
FROM base AS install
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

# copy dependencies and source code into final image
FROM base AS dev
COPY . .
COPY --from=install /usr/app .
RUN yarn run disable-telemetry

# run the app
EXPOSE 8000 9000
ENTRYPOINT [ "yarn", "run", "develop" ]