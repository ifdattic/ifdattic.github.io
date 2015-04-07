---
layout: post
title: "How to Use MongoDB for Sessions in Symfony Application"
date: 2014-10-20 16:48:25 +0300
comments: true
categories: [Symfony, Tutorials, MongoDB, Technical]
permalink: /how-to-mongodb-sessions-symfony-application
path: /source/_posts/2014-10-20-how-to-use-mongodb-for-sessions-in-symfony-application.markdown
---

The tutorial assumes that the project is using MongoDB and has everything configured (Doctrine ODM bundle, etc.).

Add the services to `app/config/services.yml`:

```yaml
services:
    mongo:
        class: Mongo
        factory_service: mongo.connection
        factory_method: getMongo

    mongo.connection:
        class: MongoDoctrine\MongoDB\Connection
        factory_service: doctrine.odm.mongodb.document_manager
        factory_method: getConnection
        calls:
            - [initialize, []]

    mongo.session.handler:
        class: Symfony\Component\HttpFoundation\Session\Storage\Handler\MongoDbSessionHandler
        arguments: ["@mongo", "%mongo.session.options%"]
```

Add the parameters for session handler:

```yaml
# app/config/parameters.yml.dist
parameters:
    mongo.session.options:
        database: "%mongodb_database%"
        collection: sessions
```

Change the session handler in `app/config/config.yml`:

```yaml
framework:
    session:
        handler_id: mongo.session.handler
```

Now your sessions should be saved in the MongoDB database.

If you want to change how long the session is persisted and improve security, add the following code to your configuration:

```yaml
framework:
    session:
        cookie_lifetime: 1209600 # 14 days
        cookie_httponly: true
```

You might also find "[How to save Symfony logs to MongoDB][article-symfony-logs-to-mongodb]" interesting.

[article-symfony-logs-to-mongodb]: /how-to-send-symfony-application-logs-to-mongodb
