FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --ignore-scripts && pnpm approve-builds esbuild sharp workerd 2>/dev/null; pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
