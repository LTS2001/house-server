FROM node:22.19.0

WORKDIR /var/www/house-service
COPY . /var/www/house-service

RUN npm i -g pnpm
RUN pnpm i

EXPOSE 7002
EXPOSE 7003

CMD [ "pnpm", "run", "start" ]