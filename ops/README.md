Build docker image for backend app:

```
cd ops
./build.sh
```

This produces the image: `uscis-backend:latest`

To push to the Elastic Container Registry:

```
cd ops
./push.sh
```

Convenience for running `./build.sh` and `./push.sh`:

```
cd ops
./release.sh
```

