# STATIC

**The contents inside this folder is will be automatically copied inside the `./build` root directory for production when running `npm run build` or `npm run dev:build` command.**

This directory contains all static files used by the application that cannot be bundled by webpack or want to be in a specific directory inside the root.

Note:

- Folder structure will retained (eg. `./locales` -> `./build/locales`).
- This `README.md` file will not be copied.
