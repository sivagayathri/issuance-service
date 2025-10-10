# Credential Issuance Service

This is a Node.js (TypeScript) microservice for issuing credentials. It accepts credential details as JSON and stores them in Supabase. Each issued credential is also published to a Redis stream for processing by verification services.

## Features

- Issue credentials via REST API
- Prevent duplicate issuance
- Publish issued credentials to Redis stream
- Returns worker/pod handling the request
- Logs and error handling included

## Tech Stack

- Node.js + TypeScript
- Express.js
- Supabase (PostgreSQL)
- Redis (Upstash)
- Docker for containerization

## Environment Variables

Create a `.env` file in the root directory:


FOLDER STRUCTURE

issuance-service/
│
├─ src/
│  ├─ clients/          # Redis and Supabase client setup
│  ├─ index.ts          # Main Express server
│  └─ routes/issue.ts   # Issue API route
│
├─ Dockerfile
├─ package.json
├─ tsconfig.json
└─ README.md


run service
--------------
- npm run start    // start service
- npx vitest run    // run vitest test



Author
------------------------------------
Name: Sivagayathri k
Email: shivagayathrik2000@gmail.com
Mobile: 8248362498
