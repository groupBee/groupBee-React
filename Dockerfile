FROM node:22.5.1

WORKDIR /frontend

COPY . ./

EXPOSE 5173

RUN npm install --silent

CMD ["npm","run","dev"]

