# build from app

FROM node:alpine3.18

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm","run","build"]

# serve with nginix

FROM nginix:1.23-alpine
WORKDIR /program filesx86/nginix/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT ["nginix", "-g", "daemon off;"]


