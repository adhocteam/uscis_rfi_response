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

**TODO:** Implement jest tests using enzyme for mounting React components.

## Deployment

### Build for Deployment

Will build the site to the `/build` directory using the `production` configuration (currently the only environment configs are `development` and `production`).
```
yarn build
```
