---
layout: post
title: "Review of Vagrant: Up and Running book"
date: 2013-10-15 18:35:14 +0200
comments: true
categories: [Review, Books, Vagrant, Technical]
permalink: /review-of-vagrant-up-and-running-book
path: /source/_posts/2013-10-15-review-of-vagrant-up-and-running-book.markdown
redirects:
    - blog/13-review-vagrant-and-running-book
---

This is the review of [Vagrant: Up and Running by Mitchell Hashimoto][amazon-buy-link]. The book gets you started with using [Vagrant][vagrant-homepage]. Vagrant allows you to create environments which can be similar or exactly like the environment your application will run on then it reaches the production stage.<!-- more --> Have you ever had a situation where application works perfectly on your Windows environment, but when you push it to Linux server you get errors, because you have a case typo in your code? Or how about when you need some third-party library and installation on Windows is as simple as building an Eiffel Tower, and even then, documentation says it might not work on Windows? Or maybe you're working on a few projects which require different PHP versions? Sounds familiar? Well, this is where Vagrant is going to help you, especially with "*works on my machine*" bugs.

All the bugs described above can really get on your nerves, especially if the deadline is already nibbling at your fingers, and the last thing you need is some bug running around, having a party at your expense. So I was thinking about starting to use manually created virtual machines which have their own cons, so I was putting this away *for "tomorrow"* for some time. And recently I learned about Vagrant, which sounded like a perfect way to get rid of a couple headaches and work more professionally. I just wish I found about it sooner, because it's very easy to start using it, doesn't take forever to configure, if you mess something up it's easy to start over, and my application will be running on the environment which is the same or similar to the production environment.

So, I was about to hit the Vagrant documentation when I found that this book was available to read an on-line version for free (some kind of promotion or something like that). And because I like reading (and books) which led to this review. 

Vagrant: Up and Running is very well written, so it was a pleasure to read it. Most of the time it actually didn't feel like you're reading a technical book, it felt more like you asked a colleague or a friend to teach Vagrant to you (just hope it's not someone like me as I'm not very good at explaining, probably should work on that a bit). 

The book has clear topics with progressive tasks, code examples, code results and notes. This allows you to read again any topic for reference without the need to re-read a previous topic, but you still need to have a least some understanding of what was done before (it would be hard to provision a virtual machine if you don't know how to start it first). There are also a couple of images to help you along the way. Of course it's nice sometimes to see something else than just a bunch of "letter monsters", but in my opinion the chosen images are not that useful (image of two words command, which gives three words output feels a bit like a waste of space/money/bytes/etc.).

If you want to follow the examples when you're reading the book, Internet connection is a must. You can download Vagrant, VirtualBox and a vagrant box beforehand, but as soon as you reach the provisioning of the virtual machine it will be impossible to follow the examples without Internet. Also unless you have a blazingly fast connection, you might want to jump around the book a little bit. If it feels like something that needs to be downloaded is coming up, I would suggest skipping a bit, start the download and go back to continue reading while it's downloading. This way you won't end waiting until it is possible to continue reading.

The book is made from the following chapters:

* **An Introduction to Vagrant** - provides information why you should be using Vagrant, the alternatives to Vagrant, and full installation with setup. The installation is provided for Windows, Linux, Mac OS X so no matter which OS you're using there will be no need for figuring out how it's installed.
* **Your First Vagrant Machine** - is where you end running a vagrant machine (two commands & that's it, I'm not lying). Of course the chapter won't leave you hanging. It will provide extensive explanations about *Vagrantfile* (configuration file), how to configure your machine, and what to do with your machine once the work is done and it's time to relax.
* **Provisioning Your Vagrant VM** - explains about virtual machine provisioning (how to do it manually or automatically). An empty running machine probably won't be very useful without needed software so the chapter explains how to provision your machine through *SSH*, *shell*, *Chef*, *Puppet*. It also has some other information you might need for provisioning.
* **Networking in Vagrant** - the chapter is about how to configure Vagrant virtual machine so it could communicate with a host and/or other devices.
* **Modeling Multimachine Clusters** - shows how to configure Vagrant to use multiple machines. This is especially useful if you work in the cloud where web/db/cache/etc. is on different machines. This will allow you to get close to your production environment (helping to get rid of "works on my machine" bugs), and you will be able to test in a controllable environment, what will happen if one of machines goes down.
* **Boxes** - is a chapter about Vagrant boxes. You will learn about boxes in general, how to manage them and how to create them from an existing environment or completely from scratch.
* **Extending Vagrant with Plug-Ins** - is quite a long chapter about managing and creating Vagrant plug-ins. But unless you know *Ruby* and think about creating plug-ins, you won't lose (just save a lot of time) anything skipping the whole chapter after the plug-in management section.
* **Appendix A/B** - is two appendix chapters giving some information about Vagrant variables for quick reference.

The book takes about *11 hours* to finish. This of course will depend on your reading speed, how long you will play with the code and a couple more things.

Now, would I suggest reading it? I actually not sure.. It's a nice book which I really enjoyed reading, and it will get you up and ready for using Vagrant for your projects, but in my opinion you can easily get it just from reading the documentation. Vagrant documentation is really good, without circling about the same topic for ages, and in couple hours of reading and playing around you would be just as ready to use Vagrant as with the book. Also, something that really got on my nerves while reading the book was that the book wasn't released that long ago, but it uses version 1 of configuration while `vagrant init` gives you Vagrantfile in version 2. Of course Vagrant is made in a way which allows to use any configuration version together, but it's not fun jumping around (and plug-ins chapter goes with V2, because otherwise it won't work).

Even if a documentation is good enough, you might want to get this book for different reasons. For example if you have some free time while taking a train to work. It would be a great chance to put yourself on "*the next level*". Also, I know a lot of people hate reading ebooks or documentations on-line, so getting a paper book would be a great investment. Don't get me wrong, I love paper books, but just not then the topic is technical, it's just no fun trying to juggle an open book and typing an example at the same time.

That I do know is that if you're a programmer, you definitely won't lose if you will learn Vagrant. Especially when there are services like [PuPHPet][puphpet-homepage] which allows you to create virtual machines using a simple GUI.

You can buy this book from [Amazon][amazon-buy-link] or [O'Reilly][oreilly-buy-page].

[amazon-buy-link]: http://www.amazon.com/gp/product/1449335837/ref=as_li_ss_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=1449335837&amp;linkCode=as2&amp;tag=if015-20
[vagrant-homepage]: http://www.vagrantup.com
[puphpet-homepage]: https://puphpet.com
[oreilly-buy-page]: http://shop.oreilly.com/product/0636920026358.do
