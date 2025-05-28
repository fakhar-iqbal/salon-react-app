# build from app
FROM node:alpine3.18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# serve with nginx  
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
