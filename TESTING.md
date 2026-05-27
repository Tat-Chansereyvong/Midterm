# Testing

Quick commands to run the test suites locally.

Run unit tests:

```bash
cd social-media-api
npm install
npm run build
npm test -- --runInBand
```

Run e2e tests:

```bash
cd social-media-api
npm install
npm run test:e2e -- --runInBand
```

Other test helpers:

```bash
npm run test:cov
npm run test:watch
```

CI note: GitHub Actions workflow `.github/workflows/ci.yml` runs these steps from the `social-media-api` folder.
