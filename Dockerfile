FROM node:18.12.1-alpine as builder
# python2 support

RUN apk add --update \
  python3 \
  python3-dev \
  py-pip \
  build-base \
  git \
  openssh-client \
&& pip install --ignore-installed distlib virtualenv \
&& rm -rf /var/cache/apk/* \

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json'
COPY package.json yarn.lock ./

# remove node_modules if exists
RUN rm -rf node_modules

# remove package-lock.json if exists
RUN rm -rf package-lock.json

# clean npm cache
RUN npm cache clean --force

# install project dependencies
RUN yarn install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build:prod_u

FROM nginx:1.15.2-alpine as production-build

COPY --from=builder dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
