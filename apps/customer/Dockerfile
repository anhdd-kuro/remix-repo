FROM node:20-alpine

EXPOSE 3000
# WORKDIR /apps/trailer-set
WORKDIR /home/pptruser/app

COPY . .

RUN rm -rf ./**/node_modules \
  && npm i -g pnpm && pnpm config set store-dir ~/pnpm \
  && pnpm install --prod --filter 'test' --filter './packages/**' \
  && pnpm turbo run build --filter 'test'\
  # Add user so we don't need --no-sandbox.
  && addgroup -S pptruser && adduser -S -G pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /home/pptruser/app \
  && chown -R pptruser:pptruser /home/pptruser/app/node_modules \
  && chown -R pptruser:pptruser /home/pptruser/app/package.json \
  && chown -R pptruser:pptruser /home/pptruser/app/pnpm-lock.yaml
USER pptruser

# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
# RUN pnpm remove @shopify/app @shopify/cli

CMD ["pnpm", "turbo", "run", "start", "--filter", "test"]
