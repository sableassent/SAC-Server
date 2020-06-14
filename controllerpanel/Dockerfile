FROM nginx:1.19.0
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/src/controllerpanel
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
COPY ./build/* /usr/share/nginx/html/
