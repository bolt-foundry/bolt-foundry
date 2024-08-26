# replit-object-storage-typescript
The TypeScript library for Replit Object Storage
## Development

To get setup, run:
```bash
npm i
```

To run the linter, run:
```bash
npm run lint
npm run format
```

or to fix (fixable) lint issues, run:
```bash
npm run fun
```

To run tests, run:
```bash
npm run test
```

## Release

To check that the package builds, you can run:
```bash
npm run prepublishOnly
```

To perform a release, first bump the version in `package.json`. Then run:
```bash
npm release
```