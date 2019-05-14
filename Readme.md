# Microfrontend Experiment

> It's a WIP experiment to simulate an agnostic view render frontend 

This approach fits in projects where there are several teams working on separated modules and they don't need to compose fragmented views like [this](https://micro-frontends.org/).
This experiment doesn't aim explain the entire CI/CD cicle.

Feel free to make questions and send PR's 👍

## Prerequisites
* Docker
* Docker compose 1.2 +
* Node 8.9 +
* NPM 5 +

> P.S. Tested only in a Windows 10 machine

## Frontends
* app-a: React 17 App;
* app-b: A Angular 6 App;
* root-app: The main app. This app requests the index.html file from each App, parse it and append it to body. Also it appends all resources like scripts and css files to the head section.

## Containers
* http-server: A Docker container running a simple static NGNIX server;
* registry-server (TODO): A service where a CI or a bash script can upload compiled frontend apps. This service send these apps to the http-server. Also it provides a REST API for avaiable apps listing.

## Before running it for the first time
You have to build all both frontend apps and containers images, so:
```
$ sh build-all.sh
```
> It will take a long time depending on your internet connection and your pc processing availability.

## Running

If all goes well while building, run the follow command:
```
$ docker-compose up
# or "docker-compose up --build"
# in case you changed some Dockerfile
```

## What now?
After You get all containers up You shall be able to access the url http://127.0.0.1:18080 in your browser. Click on the links and see what happens.

## Caveats
* There is a ``eval()`` in the root-app/index.ts file. For while I'll keep it but I'm looking for a safer solution
* It still doesn't support deep links. This issue relies on NGIX config.

## TODO
* A router that can forward the deeplinks from the root-app to the sub apps and change the route when it receive a kind of navigation event
* The registry-server: A service where a CI or a bash script can upload compiled frontend apps. This service send these apps to the http-server. Also it provides a REST API for avaiable apps listing so the root-app can fetch this.
* Create WebComponents to show how to share components between the apps