# syntax=docker/dockerfile:1
# docker build --pull --rm -f "Dockerfile" -t oncharterliz/frigate-acl:latest "."

FROM node:18-alpine AS frigate-acl
ENV NODE_ENV=production
WORKDIR /app

COPY ["package.json", "./"]

RUN npm install --production

COPY ./dist ./dist

CMD [ "npm", "run", "start:prod" ]
EXPOSE 3333