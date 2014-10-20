---
layout: post
title: "How to Send Symfony Application Logs to MongoDB"
date: 2014-10-05 15:01:41 +0300
comments: true
categories: [Symfony, Tutorials, Logs, MongoDB]
permalink: /how-to-send-symfony-application-logs-to-mongodb
path: /source/_posts/2014-10-05-how-to-send-symfony-application-logs-to-mongodb.markdown
---

The tutorial assumes that the project is using MongoDB and has everything configured (Doctrine ODM bundle, etc.).

Add the log connection to `app/config/config.yml`:

```yaml
doctrine_mongodb:
    connections:
        log:
            server: "%mongodb_log_server%"
            options:
                password: "%mongodb_log_password%"
                username: "%mongodb_log_username%"
    document_managers:
        log:
            auto_mapping: false
            logging: false
```

A separate connection is needed with `logging` disabled as otherwise it will lead to a circular reference error (as the connection is using a logger).

In `app/config/config_prod.yml` add the mongo handler for Monolog and replace `fingers_crossed` handler with it:

```yaml
monolog:
    handlers:
        main:
            type:         fingers_crossed
            action_level: error
            handler:      mongo
        mongo:
            type: mongo
            level: debug
            mongo:
                id: mongolog
                database: "%mongodb_log_database%"
                collection: "%mongodb_log_collection%"
```

If you want to log to MongoDB on development environment, replace main handler with following code (or add an additional handler):

```yaml
monolog:
    handlers:
        main:
            type: mongo
            level: debug
            mongo:
                id: mongolog
                database: "%mongodb_log_database%"
                collection: "logs_%kernel.environment%"
```

Update the parameters file `app/config/parameters.yml.dist`:

```yaml
parameters:
    mongodb_log_server: "%env.mongodb_log.server%"
    mongodb_log_database: "%env.mongodb_log.database%"
    mongodb_log_password: "%env.mongodb_log.password%"
    mongodb_log_username: "%env.mongodb_log.username%"
    mongodb_log_collection: "%env.mongodb_log.collection%"
```

Create the services used by Monolog handler.

```yaml
# app/config/services.yml
services:
    mongolog:
        class: Mongo
        factory_service: mongolog.connection
        factory_method: getMongo

    mongolog.connection:
        class: MongoDoctrine\MongoDB\Connection
        factory_service: doctrine_mongodb.odm.log_document_manager
        factory_method: getConnection
        calls:
            - [initialize, []]
```

If everything was set correctly the logs should start appearing in MongoDB database.
