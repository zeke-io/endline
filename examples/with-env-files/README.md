# "With .env files" example

Endline supports .env files out of the box.

When running `endline dev`, Endline will load `.env.development.local`, `.env.development`, `.env.local` and `.env` in that order of priority.

**In case of wanting to use env files with another name like `.env.test`, you can specify the environment name with the `-e` or `--environment` argument:**
```bash
endline dev -e test
```
This will load `.env.test.local`, `.env.test`, `.env.local` and `.env`.

<br />

Once the app is running, you can access the environment variables in `process.env`.
