# build from app

FROM node:alpine3.18 AS build

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm","run","build"]

# serve with nginix

FROM nginx:1.23-alpine
WORKDIR /program filesx86/nginx/html
RUN rm -rf *
COPY --from=build /home/ubuntu/salon-react-app/app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]


