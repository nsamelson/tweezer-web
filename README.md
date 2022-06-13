# **tweezer-web**
#### A web architecture project - Social network application

![alt-text](https://github.com/wasanico/tweezer-web/blob/main/res/post_tweez.png?raw=true)

## Introduction

In the course of Web architecture, I will be implementing a web interface for a social network
application, which is a [project](https://github.com/wasanico/tweezer) in development as part of the Mobile development course.  
The web application will use the same database as the mobile app (hosted on Firebase
services). The back-end server will be built under NodeJs and the front-end under Angular.  

## 1. Architecture  

The application is divided in 3 parts :
- _**The API**_ , which is fully documented on [SwaggerHub](https://app.swaggerhub.com/apis-docs/wasanico/tweezer/1.0);
- _**The Back-end**_ , which handles the routing and controllers;
- _**The Front-end**_ , which is built under the SPA architecture.

## 2. Scripts

### 2.1. API

The API is written in yml format and is found in the root folder as [tweezer_API.yml](https://github.com/wasanico/tweezer-web/blob/main/tweezer_API.yml) 

### 2.2. Back-end

The Back-end application can be found under the [server](https://github.com/wasanico/tweezer-web/tree/main/server) folder.  
Inside, you will find the following :

- The script [server.js](https://github.com/wasanico/tweezer-web/blob/main/server/server.js) is the core of the back-end server;
- The folder [firebase](https://github.com/wasanico/tweezer-web/tree/main/server/firebase) contains the scripts to connect the application to the Firebase services (i.e. Firstore database);
- The folder [models](https://github.com/wasanico/tweezer-web/tree/main/server/models) contains the different Objects used in the application;
- The folder [routes](https://github.com/wasanico/tweezer-web/tree/main/server/routes) contains the scripts to redirect http requests to the corresponding functions inside a specific controller script;
- The folder [controllers](https://github.com/wasanico/tweezer-web/tree/main/server/controllers) contains all the functions that will be used to communicate with the database.

### 2.3. Front-end

The Front-end application can be found under the [client](https://github.com/wasanico/tweezer-web/tree/main/client) folder.
The components of this project are under the [client/src/app](https://github.com/wasanico/tweezer-web/tree/main/client/src/app) folder.  

Inside, you will find 4 components, that are under the Module ```App``` :

- [App.component.ts](https://github.com/wasanico/tweezer-web/blob/main/client/src/app/app.component.ts) is the main component of this module. It contains all the scripts related to the side menus and top-bar of the page, as well as to post a new Tweez;
- [login.component.ts](https://github.com/wasanico/tweezer-web/blob/main/client/src/app/login/login.component.ts) handles the connection of a user to the application;
- [home.component.ts](https://github.com/wasanico/tweezer-web/blob/main/client/src/app/home/home.component.ts) will show the feed of the user. It displays only the posts of the users the connected user follows in a descending order;
- [profile.component.ts](https://github.com/wasanico/tweezer-web/blob/main/client/src/app/profile/profile.component.ts) handles displaying a searched user information (as well as its posts) but also the currently connected user. The user can also modify its information.

## 3. How to run

1. Create a new web project on [Firebase](https://console.firebase.google.com/)
2. Insert your project parameters inside [firebase.config.js](https://github.com/wasanico/tweezer-web/blob/main/server/firebase/firebase.config.js)
3. In the terminal, under the ```server``` path, write ```npm run dev``` to start the back-end server
4. In the terminal, under the ```client``` path, write ```ng serve``` to start the front-end application
5. Open your browser, and type [localhost:4200/](http://localhost:4200/) to access to the site.

## 4. Dependencies



## 5. Continue the project