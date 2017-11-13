FROM ruby:latest

WORKDIR /app/

COPY ./Gemfile .
COPY ./Gemfile.lock .
RUN bundle install --deployment

ADD . .

EXPOSE 4000

CMD bundle exec jekyll serve --host 0.0.0.0 --port 4000
