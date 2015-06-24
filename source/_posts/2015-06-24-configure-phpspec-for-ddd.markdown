---
layout: post
title: "Configure phpspec for DDD"
date: 2015-06-24 07:16:35 +0200
comments: true
categories: [phpspec, Tips, Technical]
permalink: /configure-phpspec-for-ddd
path: /source/_posts/2015-06-24-configure-phpspec-for-ddd.markdown
---

A lot of my architecture for DDD is taken from [David Adams](http://programmingarehard.com/), [Mathias Verraes](http://verraes.net/), [William Durand](http://williamdurand.fr/) & other smart people.

While developing an application I try to keep the code separated. I also love testing and one wonderful tool which helps me produce good quality code is [phpspec](http://www.phpspec.net/). The issue is what by default it keeps all the tests in the root directory.

phpspec requires some configuration to keep the tests where they belong. You might notice that I'm using Symfony framework for my application. When you do DDD development the framework used isn't that important. My domain login is kept in `src/Domain` directory & infrastructure code is kept as bundles in `src` directory.

The following configuration is required to make phpspec work correctly (finding specs, creating/updating specs, running specs):

```yml
suites:
    core_suite:
        namespace: Domain\Core
        psr4_prefix: Domain\Core
        spec_path: src/Domain/Core
        src_path: src/Domain/Core
        spec_prefix: Spec

    user_infrastructure_suite:
        namespace: UserBundle
        psr4_prefix: UserBundle
        spec_path: src/UserBundle
        src_path: src/UserBundle
        spec_prefix: Spec

    user_suite:
        namespace: Domain\User
        psr4_prefix: Domain\User
        spec_path: src/Domain/User
        src_path: src/Domain/User
        spec_prefix: Spec
```

Save the file as `phpspec.yml` in root directory.

<a href="https://www.flickr.com/photos/ifdattic/18485964273" title="Configure phpspec for DDD by Andrew Marcinkevičius, on Flickr"><img src="https://c4.staticflickr.com/4/3898/18485964273_ac0e4e5e5b_z.jpg" width="640" height="296" alt="Configure phpspec for DDD"></a>

If you would run:

```bash
phpspec describe Domain/User/ValueObject/UserName
```

It should create a file `UserNameSpec.php` in `src/Domain/User/Spec/ValueObject`.

Some lines in suites might look like duplication, but I found that you have to set all the options. Otherwise there are issues with file creation/updating. You could skip `spec_prefix` option if you don't mind specifications directory in lowercase.
