---
layout: post
title: "Dummy Test Double Using Prophecy"
date: 2015-03-19 16:23:51 +0200
comments: true
categories: [TDD, Prophecy, PHP, Technical]
permalink: /dummy-test-double-using-prophecy
path: /source/_posts/2015-03-19-dummy-test-double-using-prophecy.markdown
---

Dummy is the simplest test double.

It doesn't contain any logic and you use it when you need to satisfy a dependency which is not needed for functionality being tested.

Below is the class which has a constructor dependency:

```php
<?php

namespace App;

class Questioner
{
    private $output;

    public function __construct(OutputInterface $output)
    {
        $this->output = $output;
    }

    public function getQuestionsCount()
    {
        return 0;
    }
}
```

The dependency can be satisfied by providing a dummy object:

```php
<?php

namespace tests;

use App\Output;
use App\Questioner;

class QuestionerTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @test
     */
    function new_questioner_has_no_questions()
    {
        $outputDummy = $this->prophesize(Output::class);
        $questioner  = new Questioner($outputDummy->reveal());

        $this->assertSame(0, $questioner->getQuestionsCount());
    }
}
```
