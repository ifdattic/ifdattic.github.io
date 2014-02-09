---
layout: post
title: "Review of Yii Application Development Cookbook SE book"
date: 2013-06-02 22:53:41 +0200
comments: true
categories: [Yii, Review, Books]
permalink: /review-of-yii-application-development-cookbook-se-book
path: /source/_posts/2013-06-02-review-of-yii-application-development-cookbook-se-book.markdown
redirects:
    - 2013/06/02/review-of-yii-application-development-cookbook-se
    - blog/8-review-yii-application-development-cookbook-se-book
---

This is the review of **Yii Application Development Cookbook (Second Edition)** book by **[Alexander Makarov][alexander-makarov-homepage]**. The cookbook covers practical Yii application development tips which will help you develop better applications, and it also has recipes for important Yii features which are very useful to know.

<!-- more -->

This isn't the first time I read Yii Application Development Cookbook. The first time I read it was then it was still in per-order (the first edition), and because it was such a good book I was already thinking about reading it for the second time after I finish reading [The Yii Book by Larry Ullman][yii-book-homepage] (which by the way you should pre-order, at the end of the review I will explain why). So when I found that a second edition is coming out and got my hands of a review copy I was quite happy.

The book is written by Alexander Makarov who is an experienced engineer from Russia and has been a Yii framework core team member since 2010. He also was the technical reviewer for three other books related to Yii, so you can be sure the cookbook is written by someone who knows inner workings of Yii framework.

The cookbook has a similar format to other PacktPub cookbooks and is easy to follow, but you should have at least a basic understanding on how Yii framework works before starting with recipes ([The Definitive Guide to Yii][yii-guide-page] is a good place to start). The recipes are split into 13 chapters that will show you how to use Yii efficiently.

Every recipe is split into smaller sections (depending on the recipe some sections might be missing):

* *Introduction* - explanation about the recipe, what it solves or any other information that might be needed.
* *Getting ready* - contains instructions how to make this recipe work (e.g., setting up new application or database tables needed for a recipe).
* *How to do it* - is a step by step instructions of recipe code.
* *How it works* - gives a fuller explanation of the recipe code and how it works.
* *There's more* - instructions about how the recipe can be improved or expanded. It also contains URLs for further information about the subject.
* *See also* - a list of similar recipes about the topic.

The cookbook contains 90 recipes (if my finger counting is correct) and covers a wide range of topics. Recipes could be categorized in: simple recipes (you're probably already using them), advanced (or good to know) recipes, complex recipes (which will need more fiddling around to completely understand how they work) and recipes which will make you question yourself "Why the hell I'm not using this in my application?". Some recipes will feel like a duplicates because the topic was more or less covered in another recipe. I also think that a couple more recipes would have made the book a lot more "stronger" (like a dedicated recipe for caching just a part of your application).

Below is the list of the chapters in a cookbook:

1. **Under the Hood** provides information about the most interesting Yii features. Even if you already have some experience with Yii framework you might not know about them or might not be sure how exactly they work. A couple of features covered in this chapter: events, import, autoloading, exceptions, components, widget configuration.
2. **Router, Controller, and Views** is about how to connect different parts of the framework to make a good application. Recipes will explain how to use pretty URLs, how to write reusable actions, views and other handy things.
3. **AJAX and jQuery** focuses on adding jQuery and JavaScript functionality to your application. The chapter is about Yii specific tricks and will explain how to render the content on the client side, manage assets and a couple more useful things.
4. **Working with Forms** shows how Yii works with forms which is a big part of any application. The chapter will explain how to write custom validators, handle file uploads and create custom input widgets.
5. **Testing Your Application** covers unit testing, functional testing and code coverage reports. Recipes follow a test-driven development approach and will explain how to set your environment and start writing your own tests. This is a very important chapter because as soon as your application starts to grow the chance of breaking something is rising, and it can lead to a lot of problems.
6. **Database, Active Record, and Model Tricks** is about working with databases efficiently. It will explain how to get data from the database using Active Record, query builder and SQL. It will explain which method is best used for which scenario. The chapter also has recipes for how to connect to more than one database, how to use scopes, create complex queries along with a few more tricks.
7. **Using Zii Components** covers the default Yii framework widgets which help you work with your data.
8. **Extending Yii** shows how to create widgets, actions, modules, filters, commands which would be useful for your applications and community (if you decide to share them).
9. **Error Handling, Debugging, and Logging** explains how to configure your application to help you as much as possible when the time comes to catch and fix some nasty bug.
10. **Security** provides information how to make your application follow security principle "filter input, escape output". Recipes will explain how to use filters, how to use role-based access control, prevent XSS, CSRF, and SQL injections.
11. **Performance Tuning** will show how to make your application run smoothly until you start getting very high loads.
12. **Using External Code** will explain how to use third-party code in you applications. It's very easy to use third-party stand-alone libraries or libraries from other frameworks and the recipes in this chapter will show different ways how to do it.
13. **Deployment** gives various tips that are useful for then you're ready to deploy your application.

The book takes about 13 hours to finish. This of course will depend on your reading speed, how long you will play with the code and a couple more things.

If you're serious about learning Yii framework you should definitely buy this book. Even if you already have a good understanding of Yii framework I'm sure you will find recipes which will make you even better. Of course if you're just thinking about learning Yii framework you shouldn't start with this book. Here's my suggestion I always give for anyone wanting to learn Yii framework. You should start with [The Definitive Guide to Yii][yii-guide-page] (if you don't feel like investing into a book before you're sure Yii framework is for you) or [Web Application Development with Yii and PHP by Jeffrey Winesett][amazon-buy-yii-app-development] or [The Yii Book by Larry Ullman][yii-book-homepage]. I would definitely suggest to get "*The Yii Book*" because it's a great book for newcomers to Yii framework. The book is still in pre-order but so far from that I read it's a great book. And a big plus is that your book will be upgraded after it will be updated for Yii 2 version, so you get two rabbits with one stone (because birds are too small for a nice meal). After that you should already have a good understanding about Yii framework and be able to develop applications with it, but to make them really great and get a better understanding of Yii you should read [Yii Application Development Cookbook by Alexander Makarov][amazon-buy-yii-cookbook]. Or if you still don't feel like investing into your future as a web developer then you can go start reading wiki articles, documentation and dissecting Yii source code. There is also a [Yii Rapid Application Development Hotshot][amazon-buy-yii-hotshot] book, which I personally haven't read, but my logic puts it as an optional book if you're still not confident enough about starting to develop great applications using Yii framework. Also, Yii framework has a great and friendly community so even if you get stuck somewhere, someone will help you out.

You can buy this book from [Amazon][amazon-buy-yii-cookbook] or [PacktPub][packtpub-buy-yii-cookbook].

[alexander-makarov-homepage]: http://rmcreative.ru/author
[yii-book-homepage]: http://yii.larryullman.com/index.php
[yii-guide-page]: http://www.yiiframework.com/doc/guide
[amazon-buy-yii-app-development]: http://www.amazon.com/gp/product/B00A9TUK8E/ref=as_li_ss_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=B00A9TUK8E&amp;linkCode=as2&amp;tag=if015-20
[amazon-buy-yii-cookbook]: http://www.amazon.com/gp/product/B00BKZHDGS/ref=as_li_ss_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=B00BKZHDGS&amp;linkCode=as2&amp;tag=if015-20
[amazon-buy-yii-hotshot]: http://www.amazon.com/gp/product/B00ATYE3WI/ref=as_li_ss_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=B00ATYE3WI&amp;linkCode=as2&amp;tag=if015-20
[packtpub-buy-yii-cookbook]: http://www.packtpub.com/yii-application-development-cookbook-2nd-edition/book
