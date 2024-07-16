FROM node:22-alpine3.19

WORKDIR /src

COPY . .

RUN npm i

CMD ["npm", "start"]