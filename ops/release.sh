#!/bin/bash

set -e

./build.sh
./push.sh uscis-backend latest
