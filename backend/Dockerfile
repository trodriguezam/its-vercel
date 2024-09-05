# Specify Ruby version
ARG RUBY_VERSION=3.2.2
FROM ruby:$RUBY_VERSION-slim as base

# Install dependencies
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client libvips

# Create a directory for the app code
WORKDIR /app

# Install gems
COPY Gemfile Gemfile.lock ./
RUN gem install bundler && bundle install --without development test

# Copy the application code
COPY . .

# Precompile assets
RUN RAILS_ENV=production rails assets:precompile

# Expose port 3000 to be accessible from the host
EXPOSE 3000

COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]


