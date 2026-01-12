FROM node:22.19.0

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

WORKDIR /var/www/house-service
COPY . /var/www/house-service

RUN npm i -g pnpm
RUN pnpm i

EXPOSE 7002
EXPOSE 7003

CMD [ "pnpm", "run", "start" ]