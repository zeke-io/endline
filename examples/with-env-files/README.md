# "With .env files" example

Endline supports .env files out of the box.

When running `endline dev`, Endline will load `.env.development.local`, `.env.development`, `.env.local` and `.env` in that order of priority.

Once the app is running, you can access the environment variables in `process.env`.
