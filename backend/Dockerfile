FROM node:23.5.0

WORKDIR /backend

COPY . .

RUN rm -rf node_modules
RUN npm install

CMD ["npm", "start"]

EXPOSE 5000