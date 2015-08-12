---
layout: post
title: "Fake Test Double Using Prophecy"
date: 2015-07-22 09:17:53 +0300
comments: true
categories: [TDD, Prophecy, PHP, Technical]
permalink: /fake-test-double-using-prophecy
path: /source/_posts/2015-07-22-fake-test-double-using-prophecy.markdown
---

Fake test double is a simplified version of a dependency. A good example is an in memory or file system repository in exchange for database repository. Fake objects implement the interface of dependency.

Below is the class which has a constructor dependency:

```php
<?php

namespace App;

class Questioner
{
    /** @var OutputInterface */
    private $output;

    public function __construct(OutputInterface $output)
    {
        $this->output = $output;
    }
}

```

The `OutputInterface` is:

```php
<?php

namespace App;

interface OutputInterface
{
    /**
     * Save the data.
     *
     * @param  array  $data
     * @param  string $name
     * @return boolean
     */
    public function save(array $data, $name = null);
}
```

In production you would like to use a database output for persistence. The following object might be used:

```php
<?php

namespace App;

class DatabaseOutput implements OutputInterface
{
    /** @inheritDoc */
    public function save(array $data, $name = null)
    {
        // call database or do other time consuming tasks
    }
}
```

This will make unit testing impossible. To test the code you would need to use functional tests which would require a database. Code using the database will run much longer and the longer tests run the higher the chance they won't be run at all.

For this reason in unit testing a simpler version of dependency can be used:

```php
<?php

namespace App;

class InMemoryOutput implements OutputInterface
{
    /** @inheritDoc */
    public function save(array $data, $name = null)
    {
        // simple, fast implementation for testing
    }
}
```

{% render_partial series/test-doubles-using-prophecy.markdown %}
