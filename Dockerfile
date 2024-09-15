FROM node:22.5.1

WORKDIR /frontend

COPY . ./

EXPOSE 5173

RUN npm run postinstall

RUN npm install

CMD ["npm","run","dev"]
