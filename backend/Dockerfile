FROM ruby:2.5.0
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev
RUN mkdir /myapp
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock

# set /bundle as the bundle cache, to speed bundle iteration. Also set
# BUNDLE_JOBS to install 4 at a time
# https://engineering.adwerx.com/rails-on-docker-compose-7e2cf235fa0e
ENV BUNDLE_GEMFILE=/myapp/Gemfile
ENV BUNDLE_JOBS=4
ENV BUNDLE_PATH=/bundle

COPY . /myapp
