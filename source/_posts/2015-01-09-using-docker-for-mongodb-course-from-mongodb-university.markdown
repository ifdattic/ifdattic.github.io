---
layout: post
title: "Using Docker for MongoDB Course from MongoDB University"
date: 2015-01-09 19:29:10 +0200
comments: true
categories: [Tips, MongoDB, Docker, Node.js]
permalink: /docker-for-mongodb-course
path: /source/_posts/2015-01-09-using-docker-for-mongodb-course-from-mongodb-university.markdown
---

A few months ago a friend mentioned a [MongoDB course from MongoDBUniversity][mongodb-course-from-mongodb-university], which sounded like a lot of fun so of course I enrolled into it. It started a few days ago and it's a lot of fun. As I like to keep my OS clean the Docker looked like a great solution (one of the reasons I like it, just do something and throw it away after you're done, just like with cloud computing). This way I could take three rabbits with one shot learning [MongoDB][mongodb-home], [Node.js][nodejs-home] and [Docker][docker-home] at the same time.

I just noticed that because I had to figure some things to make it all work this can be a great opportunity for an article to help my fellow companions with this step.

Please note that I'm using Mac OS so you might need to adjust examples to your OS and/or user. Please use the [installation instructions][docker-install-docs] to launch the docker on your machine.

## MongoDB

First get the latest [mongo image][mongo-image-link]:

```bash
docker pull mongo:latest
```

And when launch your MongoDB container:

```bash
docker run \
    -v /docker-data/db:/data/db \
    -v /Users/ifdattic/docker-data:/data \
    --name mongodb -d mongo mongod --smallfiles

# or on one line for easier copy-paste
docker run -v /docker-data/db:/data/db -v /Users/ifdattic/docker-data:/data --name mongodb -d mongo mongod --smallfiles
```

This will run your MongoDB container as a daemon.

The command mounts one volume (`-v /docker-data/db:/data/db`) for keeping the data. This volume is only available for [boot2docker][boot2docker-home] VM image. This was done because for me the database files were not synced to the Mac OS and this was my compromise to still be able to access the database files in case I would need it.

It also mounts volume (`-v /Users/ifdattic/docker-data:/data`) in which you will keep your files for easy access (e.g., dumps required for homework). They are available on your OS allowing you to use your personal IDE without any problems. On Mac (and Windows I guess) the `/Users` directory is shared with boot2docker VM image to allow you to work with files on your OS. Don't forget to change the user or the path.

You could connect to your MongoDB database with mongo shell using:

```bash
docker run -it \
    --link mongodb:mongodb --rm \
    mongo sh -c 'exec mongo "$MONGODB_PORT_27017_TCP_ADDR:$MONGODB_PORT_27017_TCP_PORT/test"'

# or on one line for easier copy-paste
docker run -it --link mongodb:mongodb --rm mongo sh -c 'exec mongo "$MONGODB_PORT_27017_TCP_ADDR:$MONGODB_PORT_27017_TCP_PORT/test"'
```

Personally, I like just connecting to a running container and executing needed commands from it. You can do what with:

```bash
docker exec -it 442c2541fe1a bash # by ID
# or
docker exec -it mongodb bash # by Name
```

## Node.js

First get the latest [node image][node-image-link]:

```bash
docker pull node:latest
```

And to connect to a container on which you can run node code just enter:

```bash
docker run -it --rm \
    --name node \
    -v /Users/ifdattic/docker-data:/data \
    --link mongodb:mongodb \
    node bash

# or on one line for easier copy-paste
docker run -it --rm --name node -v /Users/ifdattic/docker-data:/data --link mongodb:mongodb node bash
```

This would provide you a container on which you could run node application. For example if on current directory you have an `app.js` file you could run it with:

```bash
node app.js
```

Also notice the command has a `--rm` which will remove the container once you're done with it.

If you want to run the node.js application an access it from your OS (e.g., homework assignment number 3) you can do it by running:

```bash
docker run -it --rm \
    -p 8080:8080 \
    -v /Users/ifdattic/docker-data:/data \
    --link mongodb:mongodb \
    -w /data/homework_1_3/hw1-3/hw1-3 \
    node node app.js

# or on one line for easier copy-paste
docker run -it --rm -p 8080:8080 -v /Users/ifdattic/docker-data:/data --link mongodb:mongodb -w /data/homework_1_3/hw1-3/hw1-3 node node app.js
```

The `-p 8080:8080` exposes the port so you could access the node application running on the docker container from your OS.

The `-w` sets the working directory. Set it to the directory which contains your `app.js` file. On your OS the homework application is at `/Users/ifdattic/docker-data/homework_1_3/hw1-3/hw1-3`, but in your docker container it's translated to mounted volume making it available at `/data/homework_1_3/hw1-3/hw1-3`.

If you would run this command you will get an error as the application fails to connect to a MongoDB database. This is because the scripts use `localhost:27017` and your database is on another container and not on localhost. You will need to change that with IP address and a port of your mongodb container. If you don't want to do it manually, you can get that information from your environment (as you linked the mongodb container to your node container that information is available as environment variables). To get environment variable from your node.js application use `process.env.ENV_VARIABLE` where `ENV_VARIABLE` is the name of the environment variable.

So make the following change to the connect function in your node.js application:

```javascript
// Replace ->
MongoClient.connect('mongodb://localhost:27017/m101', function(err, db) {
    // ...
});

// With ->
MongoClient.connect('mongodb://'+process.env.MONGODB_PORT_27017_TCP_ADDR+':'+process.env.MONGODB_PORT_27017_TCP_PORT+'/m101', function(err, db) {
    // ...
});
```

Now if you will run container command again you should see `Express server started on port 8080`. Enter your docker IP address with an exposed port in the browser and you should see the output of the homework assignment.

## Conclusion

This should be enough to allow you to run MongoDB and Node.js in Docker. Make adjustments as required and break a few fingers (a strange way to encourage someone) while having fun during the course.

If you have anything to add or have any questions please share them in the comments.

[mongodb-course-from-mongodb-university]: https://university.mongodb.com/courses/M101JS/about
[nodejs-home]: http://nodejs.org/
[mongodb-home]: http://www.mongodb.org/
[docker-home]: https://www.docker.com/
[docker-install-docs]: https://docs.docker.com/installation/#installation
[mongo-image-link]: https://registry.hub.docker.com/_/mongo/
[boot2docker-home]: http://boot2docker.io/
[node-image-link]: https://registry.hub.docker.com/_/node/
