FROM node:18.20.5

WORKDIR /var/www/service-work/house
COPY . /var/www/service-work/house

RUN npm i -g pnpm
RUN pnpm i

EXPOSE 7002
EXPOSE 7003

CMD [ "npm", "run", "dev" ]