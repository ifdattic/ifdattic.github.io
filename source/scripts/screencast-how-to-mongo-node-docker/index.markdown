---
layout: page
title: "Script for \"How to use MongoDB & NodeJS with Docker\" Screen Cast"
date: 2015-01-27 19:40
comments: true
sharing: true
footer: true
path: /source/scripts/screencast-how-to-mongo-node-docker/index.markdown
---


```text
# MongoDB

Pull the latest mongo image

$ docker pull mongo:latest

To launch the MongoDB container run

$ docker run -v "$(pwd)":/data --name mongo -d mongo mongod --smallfiles

The current directory you're running this container from will be used as data directory in your container. Change it if you need to.

You can check the running containers by entering

$ docker ps

You have two options for connecting to your Mongo database

$ docker run -it --link mongo:mongo --rm mongo sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/test"'

This command will create a new mongo container which is linked with an existing mongo container. After container is created the command which connects to your existing container is executed

I personally use a different way to do it, which is to simply connect to an existing container.

It can be done by executing

$ docker exec -it 442 bash

This will connect and execute the bash on the running container by using the ID. You will notice that you don't need to enter the full ID, as long as it's unique it's fine to use only the part of it

You can also connect by using the name of the container

$ docker exec -it mongo bash

To test that your mongo database is working let's try to insert a record

$$ mongo

$$ db.col.insert({"a": 4})

$$ db.col.find().pretty()

You Mongo database is up and ready to be used in your projects

::NOTE::

     Please note that depending on your set up the database files might not be synced with your host OS

     {{ CMD+] }}

     $ ls -la db

     As you will notice the database directory was created, but the files are not synced.
     
     If the data you have in your database is important and you don't want to lose it export it before removing your container

     To export your data connect to your database container

     {{ CMD+[ }}

     $ docker exec -it mongo bash

     You have multiple options for exporting your database, please check the documentation or the help of the command

     $ mongodump --help

     To do a simple export run

     $ mongodump --db test --out /data/test-backup

     Now if you will check your data directory you will see that it contains the backup

     {{ CMD+] }}

     $ ls -la

     To restore the data run

     {{ CMD+[ }}

     $ mongorestore --db test-restored /data/test-backup/test

# Node

Pull the latest node image

$ docker pull node:latest

To launch the NodeJS container run

$ docker run -it --rm node

This will run the node container and will put you in the interactive shell (REPL) from which you can execute code

Enter the following to test it:

$$ console.log('It works!!')

To exit the interactive shell and remove container (as it contains --rm option) press Control-C twice

You have multiple ways of running your nodejs apps. One which I personally like (especially for MongoDB course) is to create a container which has all the required data mounted and is linked to mongo container. It also exposes the port to host machine so you could open the app in your browser. If you want you can also set working directory with -w option

$ docker run -it --name node -v "$(pwd)":/data --link mongo:mongo -w /data -p 8082:8082 node bash

Now if we wanted to run an application enter its directory, install dependencies and run front controller script.

$$ cd hw3-2and3-3/blog
$$ npm install
$$ node app.js

You will see that application failed as it was not able to connect to Mongo database. This is because the application uses localhost for connection, but our mongo database isn't on local machine. There are multiple ways to fix this.

{{ ALT-TAB to Sublime }}
{{ Select line number 7 }}

Line seven is our current connection to database.

We can use environment variables which are automatically created by Docker when you link other containers.

{{ Comment line 7, down arrow, uncomment line 8 }}

To find environment variables enter `env` in the terminal

{{ ALT-TAB }}
$$ env

{{ ALT-TAB }}

You can also use hosts entry which is automatically inserted by Docker in your hosts file when linking containers

{{ Comment line 8, down arrow, uncomment line 9 }}
{{ CMD-S }}

Choose the method which you like most or is best for your use case.

{{ ALT-TAB }}

If you run the node command again it will be successful

$$ node app.js

{{ CMD+] }}

$ curl docker:8082

To make sure the application is reachable from host machine let's curl the address. `docker` is the IP address saved in my hosts file. You can also use your Docker IP address (which will be different depending on your set up, you should have received it after installing Docker).

$ curl 192.168.59.103:8082

{{ CMD+[ }}

To exit your node application press Control-C

{{ TYPE: exit }}

You can also run the container with your node application directly. Enter the following

$ docker run --name nodeapp -v "$(pwd)":/data --link mongo:mongo -w /data/hw3-2and3-3/blog -p 8082:8082 node node app.js

To check that it's responding you can curl for response

{{ CMD+] }}

$ curl docker:8082

{{ CMD+[ }}

If you want to quit the container and stop your application press Control-C

Lets remove it before running another example.

$ docker ps -a
$ docker rm nodeapp
$ docker ps -a

You can also run your application as a daemon, just add the -d option

$ docker run --name nodeapp -v "$(pwd)":/data --link mongo:mongo -w /data/hw3-2and3-3/blog -p 8082:8082 -d node node app.js

See if your container is running and curl for response to make sure it works

$ docker ps

{{ CMD+] }}
{{ CMD+up arrow }}
{{ CMD+[ }}

If you want to check the output of your container it can be done with logs command

$ docker logs nodeapp

Or if you want to tail the output add -f option

$ docker logs -f nodeapp

{{ CMD+] }}
{{ CMD+up arrow }}
{{ CMD+[ }}
{{ CONTROL+C }}

To stop your running node application container run stop command

$ docker stop nodeapp

::NOTE::

     If you're using this for MongoDB University course and chose manual validation you will need to make a few changes.

     Start and connect to your node container (or create it if it doesn't exist)

     $ docker start node
     $ docker exec -it node bash

     First lets do second week second homework. Navigate to validation directory

     $$ cd /data/hw2-2/hw2-2validate

     Install dependencies

     $$ npm install

     And run the validation script

     $$ node validate.js

     You will notice that it will fail as our mongo database isn't on localhost. Unfortunately this script doesn't allow to change the connection string so you will need to hack it.

     If your container doesn't have any editor install it first

     $$ apt-get install -y vim

     Then open your hosts file and edit it

     $$ vim /etc/hosts

     Use the IP address of your mongo container and include it as a first entry with a name of localhost. Also comment out your localhost entry

     {{ TYPE: i }}
     {{ ENTER }}
     {{ UP ARROW }}
     {{ TYPE: IP SPACE localhost }}
     {{ DOWN ARROW }}
     {{ DOWN ARROW }}
     {{ FN+LEFT ARROW }}
     {{ TYPE: # }}
     {{ ESC }}
     {{ TYPE: :wq }}
     {{ ENTER }}

     If you will run validation script again it will connect successfully

     $$ node validate.js

     Just make sure to revert the changes to your host file after getting validation code for your homework assignment.

     ---

     Validation for other assignments is much simpler as it allows configuration.

     Navigate to third week second assignment validation directory and install dependencies

     $$ cd /data/hw3-2and3-3/hw3-2validate
     $$ npm install

     To see what is allowed for configuration run validation script with --help option

     $$ node hw3-2validate.js --help

     The defaults for web server are correct, but you need to change connection string for mongo database. Enter the following to validate your homework assignment

     $$ node hw3-2validate.js --db mongodb://mongo:27017/blog

     Validation fails as our web server is not running. To run it connect to your node container and run the application

     {{ CMD+] }}

     $$ docker exec -it node bash
     $$ cd hw3-2and3-3/blog
     $$ node app.js

     {{ CMD+[ }}
     {{ UP ARROW }}
     {{ ENTER }}

     If you done your homework assignment correctly you should receive the validation code
```
