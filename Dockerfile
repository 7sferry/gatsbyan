FROM node:20.12.2-slim as base
LABEL authors="ferry"
WORKDIR /usr/src/app
RUN npm install -g bun

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
COPY package.json .
COPY bun.lockb .
RUN bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .

# [optional] tests & build
#RUN bun pm trust --all
RUN bun run build

# run the app
EXPOSE 8000 9000
ENTRYPOINT [ "bun", "run", "serve" ]
