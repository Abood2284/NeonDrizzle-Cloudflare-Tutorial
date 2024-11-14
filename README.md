# Turborepo Cloudflare Starter

## Setup

Run the following command:

```sh
git clone https://github.com/Abood2284/NeonDrizzle-Cloudflare-Tutorial.git
```

```sh
cd NeonDrizzle-Cloudflare-Tutorial/
```

```sh
pnpm install
```


## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `linkp-website`: a [Next.js](https://nextjs.org/) app
- `linkp-worker`: A Cloudflare Worker
- `@repo/ui`: a stub React component library shared by both `linkp-website` and `linkp-worker` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/db`: a schema file shared by your app


### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

At your project root level:

```
pnpm run build
```

### Development 

To start your Development run the following command in your root dir:

```
pnpm run dev
```

Make sure to add your own Neon DB URL Inside `.dev.vars` and `.env`

`DATABASE_URL='YOUR_URL'`


### Deploy 

To Deploy your `linkp-worker` to your cloudflare:


```sh
cd linkp-worker
```
```sh
pnpm run deploy
```

To Deploy your `linkp-website` to your cloudflare Pages:

```sh
cd linkp-website
```
```sh
pnpm run deploy
```

Enjoy 🫰