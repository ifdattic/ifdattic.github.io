---
layout: post
title: "Review of Node.js the Right Way Book"
date: 2014-12-25 16:08:52 +0200
comments: true
categories: [Node.js, Review, Books, Technical]
permalink: /review-nodejs-right-way-book
path: /source/_posts/2014-12-25-review-of-node-dot-js-the-right-way-book.markdown
---

{% img left http://ecx.images-amazon.com/images/I/51+VjuSvKJL._SL250_.jpg 'Node.js the Right Way Book Cover' 'Node.js the Right Way Book Cover' %}

I'm a big fan of learning something new. After enrolling into [MongoUniversity MongoDB course][mongodb-course] where all the examples would be in Node.js, decided it would be great time to at least get acquainted with Node.js. Then as the luck would have it, someone tweeted about "[Node.js The Right Way][amazon-book-link] by [Jim. R. Wilson][book-author-link]" from [The Pragmatic Programmers][pragmatic-programmers-book-link], which is always a great place to look for books. As the ebook version is available on Amazon (screw the discounts, I require my ebooks to be locked into the Amazon ecosystem), I bought it. Now I knew how I will be spending my mornings for a while.

<!-- more -->

The book is made from the following chapters:

1. **Getting Started** introduces the Node.js event loop, outlines the five aspects of Node.js development and provides instructions you would need for the following chapters.
2. **Wrangling the File System** will help you write your first Node.js program - using Node's filesystem tools to create asynchronous, nonblocking file utilities.
3. **Networking with Sockets** is were you will create a TCP servers and client programs for accessing them. This chapter will offer insight into Node application design and provide experience creating testable and fault-tolerant systems.
4. **Robust Message-Passing** will introduce you to using third-party libraries. Using ØMQ (ZeroMQ) you will create suites of programs that work together in concert, and you will learn the clustering tools for managing them.
5. **Accessing Databases** introduces databases and how to interact with them asynchronously in Node. The database created in this chapter is the foundation for RESTful APIs you'll be developing in later chapters.
6. **Scalable Web Services** chapter will use Express, a popular Node.js web framework for routing requests. It will introduce objects called promises for managing asynchronous code flows and how to couple them in interesting ways with generator functions.
7. **Web Apps** is the final chapter were you will build a single-page web application for integrating with web services created in previous chapters. In this chapter you will be using Passport module for authenticating with Google account credentials and storing session data in Redis.

Each chapter provides some aspects of Node.js development like: Architecture and Core, Patterns, JavaScriptisms, Supporting Code.

A few issues (suggestions) for the book is that code samples could be more concise. It does not take any value away from them, but would just be nicer.

The database chapter requires a dataset which extracts to at least 500 MB (didn't wait for it to finish). My suggestion would be to provide a cropped dataset or simply add a note to kill the extraction at some point (just extract enough to make the examples work).

In my opinion it would be great if book provided a Vagrant or Docker file for having an environment which contains all the required software and working code examples.

The book has a very nice flow. Providing a lot of code examples and giving explanations for each line (block) of code. Still, you should have at least some JavaScript knowledge.

At the end of each chapter, questions and exercises are provided for improving your knowledge of what you learned from the chapter.

If you want to learn Node.js in my opinion this is the great book for that. It would provide you with enough knowledge where you will be confident to start using it in your everyday life and continue learning it through practice.

You can buy it from [Amazon][amazon-book-link] or [The Pragmatic Programmers][pragmatic-programmers-book-link].

[mongodb-course]: https://university.mongodb.com/courses/M101JS/about
[book-author-link]: https://twitter.com/hexlib
[amazon-book-link]: http://www.amazon.com/gp/product/B00HSO6YD8/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00HSO6YD8&linkCode=as2&tag=if015-20&linkId=2KSSTQD6Z2X2CDRS
[pragmatic-programmers-book-link]: https://pragprog.com/book/jwnode/node-js-the-right-way
