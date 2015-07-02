---
layout: post
title: "Mock Test Double Using Prophecy"
date: 2015-07-02 16:42:18 +0300
comments: true
categories: [TDD, Prophecy, PHP, Technical]
permalink: /mock-test-double-using-prophecy
path: /source/_posts/2015-07-02-mock-test-double-using-prophecy.markdown
---

Mock is a test double which simulates behavior and we have expectations for it. You define predictions for it and later check if any of them failed.

```php
<?php

namespace tests;

use App\Output;
use App\Questioner;
use App\Scorer;
use Prophecy\Argument;

class QuestionerTest extends \PHPUnit_Framework_TestCase
{
    // ...

    /**
     * @test
     */
    function questioner_is_saved()
    {
        $outputMock = $this->prophesize(Output::CLASS);
        $outputMock->save([], Argument::type('string'))->shouldBeCalled();
        $questioner = new Questioner($outputMock->reveal());

        $questioner->saveAs('any name');
    }
}
```

Some of the predictions you can make:

* `CallPrediction` or `shouldBeCalled()` - checks that method was called 1 or more times
* `NoCallsPrediction` or `shouldNotBeCalled()` - checks that method was not called
* `CallTimesPrediction` or `shouldBeCalledTimes($count)` - checks that method was called a specified number of times
* `CallbackPrediction` or `should($callback)` - checks method against custom callback

Custom predictions can be created by implementing `PredictionInterface`.

{% render_partial series/test-doubles-using-prophecy.markdown %}
