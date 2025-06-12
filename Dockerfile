FROM node:20-slim

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --registry=https://registry.npmmirror.com

COPY . ./

ENV REACT_APP_API_BASE_URL=https://api.deepseek.com
ENV REACT_APP_API_KEY=sk-fc5bdb027a0c4a1b85502a7511c2f4f6

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
