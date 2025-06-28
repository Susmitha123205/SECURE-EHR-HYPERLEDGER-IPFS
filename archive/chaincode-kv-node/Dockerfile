FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 7052

CMD ["npm", "run", "start:ccaas"]
