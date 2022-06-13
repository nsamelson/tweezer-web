# **tweezer-web**
#### A web architecture project - Social network application

![alt-text](https://github.com/wasanico/tweezer-web/blob/main/res/post_tweez.png?raw=true)

## Introduction

In the course of Web architecture, I will be implementing a web interface for a social network
application, which is a [project](https://github.com/wasanico/tweezer) in development as part of the Mobile development course.  
The web application will use the same database as the mobile app (hosted on Firebase
services). The back-end server will be built under NodeJs and the front-end under Angular.  

### User stories

1. As a user, I want to create an account;
2. As a user, I want to connect to my account;
3. As a user, I want to modify my password in order to increase security;
4. As a user, I want to modify my profile information;
5. As a user, I want to create a post;
6. As a user, I want to like another user’s posts;
7. As a user, I want to search a specific user in order to see its profile;
8. As a user, I want to see all the posts of a user;
9. As a user, I want to follow a user;
10. As a user, I want to see the new posts of the users I follow.


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

## 4. Dependencies and links

- The project uses the following services of [Firebase](https://console.firebase.google.com/u/0/) : Authentication, Firestore Database and Storage;
- The API documentation is written under the OpenAPI Specification and is available on [SwaggerHub](https://app.swaggerhub.com/apis-docs/wasanico/tweezer/1.0)
- The Backend application requires the following packages :
    - express
    - bodyParser
    - cors
    - firebase
- The Frontend application requires the following packages :
    - angular
    - rxjs
    - zone
    - tslib



## 5. Continue the project

The first suggested improvement would be to add better and consistent error handling accross the whole application.  
On the security side, it would be advised to set strict rules in the [Firebase console](https://console.firebase.google.com/u/0/), and also remove redundant and insecure data. Furthermore, each function in the controller should first verify the identity of the user, in case he is unexpectedly disconnected.  
An other improvement would be to subdivide responses in subsets of 100 items, to improve response speed if there are too many items.  
Finally a last improvement would be to allow more profile personnalization (e.g. change profile picture, profile cover,..).