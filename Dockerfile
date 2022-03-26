FROM node:10-alpine

WORKDIR /apsEducation

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm","start"]
