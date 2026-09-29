[![Netlify Status](https://api.netlify.com/api/v1/badges/7cadaf16-a276-4129-a699-d006a96571d8/deploy-status)](https://app.netlify.com/projects/mai-ie/deploys)

# MAI Muslim Center Website

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone git@github.com:mahmoudal99/mai_patron_mvp.git
cd mai-support
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

To run the application in development mode with hot-reloading:

1. Install nodemon globally (if not already installed):
```bash
npm install -g nodemon
```

2. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000` by default.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Development

The application is built using Create React App and follows modern React development practices. The source code is located in the `src` directory.

## Newsroom (statements & articles)

Publishing and the admin back office: **[docs/newsroom.md](docs/newsroom.md)**.

## Hosting

The site runs on Cloudflare Workers with a D1 database. Setup, deployment and
the things that only break on Workers: **[docs/cloudflare.md](docs/cloudflare.md)**.

Quick start for local development:

```bash
npm install
npm run db:migrate                               # create the local D1 database
npm run seed:newsroom                            # optional: four example posts
npm run create-admin -- you@mai.ie "Your Name"   # an account to sign in with
npm run dev                                      # then visit /news and /admin/posts
```

`npm run dev` runs the Next dev server with a local D1 attached. Before
deploying, `npm run preview` builds and runs the actual Worker - some things
only fail there.
