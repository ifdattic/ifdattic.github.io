---
layout: post
title: "EUpdateDialog Extension"
date: 2011-10-18 19:04:24 +0200
comments: true
categories: [Yii, jQuery, Extensions, Projects]
permalink: /eupdatedialog-extension
path: /source/_posts/2011-10-18-eupdatedialog-extension.markdown
redirects:
    - work/eupdatedialog-extension
    - projects/9-eupdatedialog-extension
---

EUpdateDialog is an extension for Yii framework.

This extension allows to run controller actions using jQuery UI dialog. This allows you to enhance your application making it act more like a desktop applications, which will be appreciated by your users.

<!-- more -->

It is used for extending your application to allow easy CRUD (create-read-update-delete) actions or any other action which returns a proper JSON response. Click event can be added to any link element using a jQuery selector, allowing you to extend your application with additional functionality, without sacrificing design.

Extension degrades gracefully, so your application won’t lose any functionality if JavaScript is turned off.

## Features

Here's some of the features provided by the extension:

* CRUD actions through AJAX calls;
* degrades gracefully with JavaScript turned off;
* works with grid view widget or links;
* no inline JavaScript needed;
* works with or without CSRF validation;
* a lot of configuration options to better suit your needs;
* i18n (Internationalization and localization).

You can find more information and source code at [GitHub repository][github-extension-page] or [Yii Framework website][yii-extension-page].

[yii-extension-page]: http://www.yiiframework.com/extension/eupdatedialog
[github-extension-page]: https://github.com/ifdattic/EUpdateDialog
