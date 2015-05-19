# OpenFrame-NodeClient
A simple OpenFrame CLIENT prototype written in Node.

This minimal client sets up a websocket connection with a specified username and displays a browser window into which images can be pushed. The idea is that this runs on a dedicated Raspberry Pi, and displays the images full screen using chromium in kiosk mode.


### Setup

#### Dependencies

Make sure you have Node.js installed.

On Linux, install chromium. For the Raspberry Pi running Debian:

```bash
$ sudo apt-get install chromium
```
You can also use Chromium on the mac if you want -- download the Chromium app and put it in your Applications directory. Then you can use the `-c` flag to start the app in Chromium (it will open in kiosk mode on a new desktop).

#### Installation

From the command line, clone this repo and cd into the root of the project.

```bash
$ git clone https://github.com/jmwohl/OpenFrame-NodeClient.git
$ cd OpenFrame-NodeClient
```

Install the npm dependencies.

```bash
$ npm install
```

You should now be able to run the client (see Usage).


### Usage

```bash
$ node frame.js -u username -f framename [-d domain] [-c] [-r]
```

As an example, to start up the frame for user jonwohl, with a server at www.openframe.io:

```bash
$ node frame.js -u jonwohl -f Home -d openframe.io
```

The presence of the `-c` flag will force the system to try to open the frame using Chromium instead of whatever the default browser is. At present, on linux Chromium is a required dependency, and will always be used.

The presence of the `-r` flag will reset the frame, causing the server to treat it as if it is an entirely new frame.

