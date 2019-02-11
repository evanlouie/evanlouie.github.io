# Build in a Ruby container
# https://hub.docker.com/_/ruby
FROM ruby:latest

WORKDIR /app/

COPY ./Gemfile .
COPY ./Gemfile.lock .
RUN bundle install --deployment

ADD . .

RUN bundle exec jekyll build

# Copy to an Alpine Nginx image
# https://hub.docker.com/_/nginx
FROM nginx:alpine

# Nginx images expose 80 by default
EXPOSE 80

WORKDIR /usr/share/nginx/html
COPY --from=0 /app/_site /usr/share/nginx/html
