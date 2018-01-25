To edit/update config vars:

1. Create a directory for the deployment environment if one does not already exist (e.g., `ops/config/dev`)
2. Create an `env` (not a dot file) in the directory
3. Add env variables, one per-line of the format `export THIS_IS_A_VAR=valueGoesHere`
4. Put the variables in the variable store (read: s3 bucket): `./put.sh dev`

To retrieve existing variables: `./fetch.sh dev`
