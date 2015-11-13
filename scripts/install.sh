#!/usr/bin/env bash

# get this script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# elevate to root
echo ""
sudo -v -p "Please enter the administrator's password: "

# install NVM for easy node version management
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | sh
# source nvm to access it in the shell
# usually it is source in .bashrc, 
# but we can't reload .bashrc within a script
source ~/.nvm/nvm.sh
# install latest tested stable Nodejs
nvm install 5.0.0

# install chromium from package repository
sudo apt-get update
sudo apt-get install chromium

# now install Nodejs dependencies
cd $DIR
cd ..
npm install

echo ""
echo "You must restart your shell, or run the following command: source ~/.bashrc"
echo "After reloading .bashrc, you can launch the frame with: $DIR/../launch.sh -u [USERNAME] -f [FRAME_NAME] -d [DOMAIN]"
echo "For example: $DIR/../launch.sh -u jonwohl -f Home -d openframe.io"
