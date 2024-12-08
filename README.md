# Companies’ SDG alignments

## Installation

Make sure you're using the correct Node version (node version is specified in `.nvmrc` file). You can use a tool like [nvm](https://github.com/nvm-sh/nvm) or [mise](https://github.com/jdx/mise) to install and manage Node versions.

This project uses Yarn as a package manager and Yarn workspaces as a monorepo tool. The preffered way to manage Yarn is through [corepack](https://github.com/nodejs/corepack).

```bash
corepack enable
```

Install yarn dependencies:

```bash
yarn install
```

You also need to have [Docker](https://www.docker.com/) installed to run the local database.

## Usage

Start local database:

```bash
docker-compose up -d
```

Start server:

```
yarn workspace server dev
```

Start frontend:

```bash
yarn workspace ui dev
```

Run db migrations and seed data:

```bash
yarn workspace server db:migration:migrate
yarn workspace server db:seed
```

Open frontend app URL in browser (usually http://localhost:5173/). You should see the list of companies and chart with SDG alignments for selected company:

https://github.com/user-attachments/assets/3d81b52e-1fc8-4e48-8c6f-5c72ce38a1b2
