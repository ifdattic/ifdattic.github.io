---
layout: post
title: "Converting px to ems with LESS"
date: 2011-10-20 18:46:27 +0200
comments: true
categories: [Tutorials, LESS, Mixins, Responsive, Tips, Technical]
permalink: /converting-px-to-ems-with-less
path: /source/_posts/2011-10-20-converting-px-to-ems-with-less.markdown
redirects:
    - 2011/10/19/converting-px-to-ems-with-less
    - blog/2-converting-px-ems-less
---

[LESS][less] is great with adding variables, mixins, operations and functions to CSS. Here is the little trick to convert pixels to ems I use when coding responsive designs:

<!-- more -->

``` css Mixin for converting px to em
// Create variables [optional]
@basefont: 14; // in pixels
@baseline: 20; // in pixels

// Create a converter namespace [optional]
#pxtoem {
    // Create convert mixin [required]
    .font-size( @target: @basefont, @context: @basefont ) {
        font-size: (@target / @context) + 0em;
    }
}
```

Usage is pretty straight forward, for example if you want to make links the size of `10px` then parent element font size is `16px` you will use:

``` css Usage of mixin
a {
    #pxtoem > .font-size( 10, 16 );
}
```

You can expand it with mixins for margins, paddings, etc. The most important part to remember is what you use numbers without units and then convert it to a wanted unit by adding a zero value to it.

[less]: http://lesscss.org
