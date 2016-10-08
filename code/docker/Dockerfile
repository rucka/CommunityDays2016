FROM mhart/alpine-node:6.2.1

RUN mkdir -p /todo/public
RUN mkdir -p /todo/specs
RUN mkdir -p /todo/src
RUN mkdir -p /todo/view

COPY public /todo/public
COPY specs /todo/specs
COPY src /todo/src
COPY views /todo/views
COPY package.json /todo/

WORKDIR /todo

RUN npm install
RUN npm run compile
RUN ls /todo

ENTRYPOINT ["node", "lib/server.js"]

EXPOSE 8000
