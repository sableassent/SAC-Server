FROM node:12 as builder
ARG REACT_APP_BASE_URL
WORKDIR /usr/src/controller
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:1.19.0
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/controller/build/ /usr/share/nginx/html/
