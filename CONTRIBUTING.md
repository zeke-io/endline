# Contributing Guide

Thank you for considering contributing to the "Endline" project!

## Code of Conduct

Please note we have a [Code of Conduct](CODE-OF-CONDUCT.md), please follow it in all your interactions with the project.

## A message from the author

Hey there! Thank you for taking your time reading this.

I started Endline as a side-project, and it is my first **open-source** project,
because of this, there could be some stuff missing in the repository,
like documentation, GitHub files and other things.

If you need to contact me directly, to recommend me something,
or help with anything related to the project, please do so using the next contact information:

- Email: [ezequiel_io@pm.me](mailto:ezequiel_io@pm.me)
- Twitter: [@ezequiel_hvm](https://twitter.com/ezequiel_hvm)
- Discord: zeke-io#9185

## Development

### Requirements

This repository requires [pnpm](https://pnpm.js.org/en/),
you can install it using npm:

```bash
npm install -g pnpm
```

Or if you are using Node v16.13 and above, you can use Node's Corepack:

```bash
corepack enable pnpm
```

More information can be found at https://pnpm.io/installation

### Preparation

Install the dependencies

```bash
pnpm install
```

Build the project

```bash
pnpm dev
```

When running `pnpm dev` it will watch for changes made to the source code and automatically compile it.
