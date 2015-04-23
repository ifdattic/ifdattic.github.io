---
layout: post
title: "Stub Test Double Using Prophecy"
date: 2015-04-23 09:11:17 +0300
comments: true
categories: [TDD, Prophecy, PHP, Technical]
permalink: /stub-test-double-using-prophecy
path: /source/_posts/2015-04-23-stub-test-double-using-prophecy.markdown
---

Stub is the next simplest test double after the [Dummy](dummy-test-double-using-prophecy).

It doesn't have any expectations about the object behavior, but behaves in a specific way when put in a specific environment.

Below is the class under the test:

```php
<?php

namespace App;

class Questioner
{
    private $output;
    private $questions = [];

    public function __construct(OutputInterface $output)
    {
        $this->output = $output;
    }

    /** @return int */
    public function getQuestionsCount()
    {
        return 0;
    }

    /**
     * Save under a new name.
     *
     * @param  string $name
     * @return boolean
     */
    public function saveAs($name)
    {
        return $this->output->save($this->questions, $name);
    }
}
```

`saveAs` method can be tested by using a stub test double:

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

    /**
     * @test
     */
    function questioner_is_saved_under_a_new_name()
    {
        $outputStub = $this->prophesize(Output::class);
        $outputStub->save([], 'new name')->willReturn(true);
        $questioner = new Questioner($outputStub->reveal());

        $this->assertTrue($questioner->saveAs('new name'));
    }
}
```

The test will pass as long as first parameter for `save` method is an empty array (`[]`) and the second parameter is `new name`. Prophecy allows you to use argument wildcards making your tests more durable. Below you can see a new test which allows any string for a name:

```php
<?php

// ...
use Prophecy\Argument;

class QuestionerTest extends \PHPUnit_Framework_TestCase
{
    // ...

    /**
     * @test
     */
    function questioner_is_saved_under_any_name()
    {
        $outputStub = $this->prophesize(Output::class);
        $outputStub->save([], Argument::type('string'))->willReturn(true);
        $questioner = new Questioner($outputStub->reveal());

        $this->assertTrue($questioner->saveAs('any name'));
    }
}
```

For the full list of arguments you can you check the code of `Prophecy\Argument` class. Here's some of them you might want to use in your tests:

* `Argument::is($value)` checks that the argument is identical to a specific value
* `Argument::exact($value)` checks that the arguments matches a specific value
* `Argument::type($typeOrClass)` checks that the argument matches a specific type or class name
* `Argument::any()` matches any argument

{% render_partial series/test-doubles-using-prophecy.markdown %}
