#!/usr/bin/env bash

# get this script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR
# for some reason, even if `nvm` worked in the console
# this script would error with `nvm command not found`
source $NVM_DIR/nvm.sh
# activate appropriate Nodejs version
nvm use 5.0.0
# launch openframe!
node frame.js "$@"
