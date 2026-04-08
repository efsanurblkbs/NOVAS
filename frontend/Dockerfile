FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


RUN npm install --legacy-peer-deps


EXPOSE 5173


CMD ["npm", "run", "dev", "--", "--host"]