---
layout: post
title: "How to use MongoDB & NodeJS with Docker (video included)"
date: 2015-01-09 19:29:10 +0200
comments: true
categories: [Tips, MongoDB, Docker, Node.js, Technical]
permalink: /how-to-mongodb-nodejs-docker
path: /source/_posts/2015-01-28-how-to-mongodb-nodejs-docker.markdown
redirects:
    - docker-for-mongodb-course
---

This is the short intro on how to use spin up MongoDB and NodeJS containers using Docker. This will take you step by step on how to run those containers, some problems you might run into, how to avoid some pitfalls. After it you will have enough experience on working with Docker, MongoDB & NodeJS. It will provide enough foundation to use those technologies and will give a head start if you will want to learn more. Initial intent was to use it for MongDB course from MongoDBUniversity, but it was reworked for general use. Part of the tutorial will provide tips on how to use it with the mentioned course.

<del datetime="2015-01-27">A few months ago a friend mentioned a [MongoDB course from MongoDBUniversity][mongodb-course-from-mongodb-university], which sounded like a lot of fun so of course I enrolled into it. It started a few days ago and it's a lot of fun. As I like to keep my OS clean the Docker looked like a great solution (one of the reasons I like it, just do something and throw it away after you're done, just like with cloud computing). This way I could take three rabbits with one shot learning [MongoDB][mongodb-home], [Node.js][nodejs-home] and [Docker][docker-home] at the same time.</del>

<del datetime="2015-01-27">I just noticed that because I had to figure some things to make it all work this can be a great opportunity for an article to help my fellow companions with this step.</del>

Please note that I'm using Mac OS so you might need to adjust examples to your OS and/or user. Please use the [installation instructions][docker-install-docs] to launch the docker on your machine.

## MongoDB

<iframe width="732" height="412" src="https://www.youtube.com/embed/axt6O6myUvs?list=PLOyuTJZcQNNDSVMlAkIEoPX9CDrOGyTVt" frameborder="0" allowfullscreen></iframe>

First get the latest [mongo image][mongo-image-link]:

```bash
docker pull mongo:latest
```

And when launch your MongoDB container:

```bash
docker run -v "$(pwd)":/data --name mongo -d mongo mongod --smallfiles
```

The current directory you're running this command from will be used as data directory in your container (provided by `$(pwd)`). Change it if you need to by entering the full path.

The running containers can be checked by:

```bash
# display only running containers
docker ps

# or if you want all containers displayed
docker ps -a
```

There are two options for connecting to your Mongo database.

```bash
docker run -it \
    --link mongo:mongo \
    --rm mongo sh \
    -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/test"'

# or on one line for easier copy-paste
docker run -it --link mongo:mongo --rm mongo sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/test"'
```

This will create a new mongo container which is linked with an existing mongo container. After container is created the command which connects to database is executed.

Personally, I like just connecting to a running container and executing needed commands from it. You can do what with:

```bash
docker exec -it 442c2541fe1a bash # by ID
# or
docker exec -it mongo bash # by Name
```

To test that your mongo database is working execute the following commands from mongo container:

```bash
mongo
db.col.insert({"a": 4})
db.col.find().pretty()
```

The new document should have been inserted and displayed back to you. You Mongo database is up and ready to be used in your projects.

### Dump and restore the database

<iframe width="732" height="412" src="https://www.youtube.com/embed/bZFXxhkrD44?list=PLOyuTJZcQNNDSVMlAkIEoPX9CDrOGyTVt" frameborder="0" allowfullscreen></iframe>

Please note that depending on your set up the database files might not be synced with your host OS. You can check this by listing the files of database directory:

```bash
ls -la db
```

If it's empty then database files are not synced.

If the data you have in your database is important and you don't want to lose it export it before removing your container (stopping the container will preserve the files).

Please check the documentation or `--help` output for more information, but to do a simple export run the following from the container (export `test` database to `/data/test-backup` destination):

```bash
mongodump --db test --out /data/test-backup
```

Your data directory (from the container) should now contain the backup files and it should be synced with your host OS.

To restore the data run the following from container (restore `/data/test-backup/test/` into a `test-restored` database):

```bash
mongorestore --db test-restored /data/test-backup/test
```

## Node.js

<iframe width="732" height="412" src="https://www.youtube.com/embed/0frJFB9toFQ?list=PLOyuTJZcQNNDSVMlAkIEoPX9CDrOGyTVt" frameborder="0" allowfullscreen></iframe>

First get the latest [node image][node-image-link]:

```bash
docker pull node:latest
```

To launch the NodeJS container run:

```bash
docker run -it --rm node
```

This will run the node container and will put you in the interactive shell (REPL) from which you can execute code. You can test it by entering:

```bash
console.log('It works!!')
```

To exit the interactive shell and remove the container (as it contains `--rm` option) press <code>Control+C</code> twice.

You have multiple ways of running your NodeJS applications. One which I personally like (especially for MongoDB course) is to create a container which has all the required data mounted and is linked to mongo container. This allows to run multiple applications without having to create new containers. It also exposes the port to host machine so you could open the application in your browser. If you want you can set working directory with `-w` option.

```bash
docker run -it --name node -v "$(pwd)":/data --link mongo:mongo -w /data -p 8082:8082 node bash
```

Now to run the application just enter its directory, install dependencies and run front controller script:

```bash
# execute commands in container
cd hw3-2and3-3/blog
npm install
node app.js
```

If you're running these examples with MongoDB course examples it will fail. This is because it's trying to connect to Mongo database on localhost, but our Mongo database isn't on local machine. There are multiple ways to fix this:

* hard code the connection string (with linked container IP);
* use environment variables which are added automatically by Docker (when linking);
* use hosts entry which is added automatically by Docker (when linking).

Example below contains the representation of all those methods. Please choose the one which you like most or is best for your use case.

```javascript
// Original connect
MongoClient.connect('mongodb://localhost:27017/blog', function(err, db) {
    // ...
});

// Connect using environment variables
MongoClient.connect('mongodb://'+process.env.MONGO_PORT_27017_TCP_ADDR+':'+process.env.MONGO_PORT_27017_TCP_PORT+'/blog', function(err, db) {
    // ...
});

// Connect using hosts entry
MongoClient.connect('mongodb://mongo:27017/blog', function(err, db) {
    // ...
});
```

After fixing the `connect()` method the application should run successfully. You can reach it by opening `http://192.168.59.103:8082` (if it was IP address of your Docker application) or if you added the Docker IP as `docker` in your hosts file `http://docker:8082`.

To exit your application press `Control-C`

It's also possible to run the application in container directly.

```bash
# from host OS terminal
docker run \
    --name nodeapp \
    -v "$(pwd)":/data \
    --link mongo:mongo \
    -w /data/hw3-2and3-3/blog \
    -p 8082:8082 \
    -d node node app.js

# or on one line for easy copy-paste
docker run --name nodeapp -v "$(pwd)":/data --link mongo:mongo -w /data/hw3-2and3-3/blog -p 8082:8082 -d node node app.js
```

The following commands might be useful when running containers as daemons (replace `nodeapp` with ID or name of container):

```bash
# to see running containers
docker ps

# to check output of container
docker logs nodeapp

# to tail the output of container
docker logs -f nodeapp

# to stop running container
docker stop nodeapp
```

## MongoDB Course Manual Validation Tips

<iframe width="732" height="412" src="https://www.youtube.com/embed/TwzNfD1L3vM?list=PLOyuTJZcQNNDSVMlAkIEoPX9CDrOGyTVt" frameborder="0" allowfullscreen></iframe>

If you using this for MongoDB University course and chose to do manual validation (haven't tested with MongoProc validation) you will need to keep a few things in your mind.

For second week second homework it's not possible to configure the validation script and it tries to connect to Mongo database which is on localhost. To fix this open your `/etc/hosts` file (you might need to install some editor on your container), enter the `MONGOIP localhost` as the first entry (**replace `MONGOIP` with mongo container IP address, should be in the same hosts file**) and comment out the real `localhost` entry. Now running validation script should succeed and you should receive the validation code if you did homework assignment correctly. **Don't forget to revert the changes to `/etc/hosts` file!!!**

Other assignment validation is simpler as it allows to configure the validation script. Run validation with `--help` to see what is available for configuration. The defaults for web server should be correct (as you should have one container and two terminals for it, one running the application, another executing validation) you only need to change connection string for Mongo database. Enter the following to validate third week second assignment:

```bash
node hw3-2validate.js --db mongodb://mongo:27017/blog
```

If you done your homework correctly you should receive the validation code.

## Conclusion

Now you should have enough knowledge to be able to run MongoDB and NodeJS using Docker. You can take most of that knowledge and expand it to other containers even if you don't want to learn more about Docker. This would still provide you with ability to rapidly test your ideas and throw away the resources as needed.

If you're using this for MongoDB University course it should help with most of the issues you could run while completing your assignments.

If you're willing to hurt your ears by listening to my voice you can find the screen cast of this whole tutorial at [YouTube][youtube-screencast]. If you're listening on mute or can't understand what I'm saying the [script for screen cast is available][script-screencast].

If you have any questions, suggestions or any part of it is unclear please leave a comment.

>If you liked this article and would like to learn more about developing web applications try out the [Web Development with Node.js and MongoDB](https://www.packtpub.com/web-development/web-development-nodejs-and-mongodb-video) video course (created by me). In that course you will learn how to convert the ideas in your head to custom web applications. It covers the topics like preparing development environment, scaffolding a web application, storing data, working with RESTful APIs, testing your application and improving performance. **Take the course and learn how to convert your ideas into web applications**.

[mongodb-course-from-mongodb-university]: https://university.mongodb.com/courses/M101JS/about
[nodejs-home]: http://nodejs.org/
[mongodb-home]: http://www.mongodb.org/
[docker-home]: https://www.docker.com/
[docker-install-docs]: https://docs.docker.com/installation/#installation
[mongo-image-link]: https://registry.hub.docker.com/_/mongo/
[boot2docker-home]: http://boot2docker.io/
[node-image-link]: https://registry.hub.docker.com/_/node/
[youtube-screencast]: https://www.youtube.com/playlist?list=PLOyuTJZcQNNDSVMlAkIEoPX9CDrOGyTVt
[script-screencast]: scripts/screencast-how-to-mongo-node-docker
