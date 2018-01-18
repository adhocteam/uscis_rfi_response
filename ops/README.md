Build docker image for backend app:

```
cd ops
./build.sh <env> <version>
```

This produces the image: `uscis-backend:latest`

The <version> arg can be anything, but should probably match a git commit or tag.

To push to the Elastic Container Registry:

```
cd ops
./push.sh <env> <version>
```

Convenience for running `./build.sh` and `./push.sh`:

```
cd ops
./release.sh <env> <version>
```

Convenience for deploying a new image to ECS:

```
cd ops
./deployer <env> <version>
```

The only possible value for <env> is `dev` at the moment.
