# USCIS Front-End

## Development

### Install Dependencies
```
yarn install
```

### Build and Run
By default the site will be served on port `3000`, with all requests made to `/api` proxied to port `3001` (where the Rails API should be set to run).
```
yarn server
```

### Upgrade the CMS Design System Packages
```
yarn upgrade @cmsgov/design-system-core @cmsgov/design-system-layout
```

## Testing

To run all tests (unit and end-to-end):

```
yarn test
```

### Unit Tests

Uses jest as the test runner / framework and enzyme to render React components for testing.

```
yarn unit-test
```

### End-to-End Tests

Uses nightwatch and selenium.  Runs headlessly via chromedriver by default.

```
yarn e2e-test
```

### Notes on Writing Tests

* Whenever you have to identify an HTML element for testing, add a class that starts with `qa-uscis-` so that it's easily recognizable.

## Deployment

### Build for Deployment

Will build the site to the `/build` directory using the `production` configuration (currently the only environment configs are `development` and `production`).
```
yarn build
```
