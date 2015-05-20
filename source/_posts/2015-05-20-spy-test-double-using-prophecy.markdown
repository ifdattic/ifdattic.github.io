---
layout: post
title: "Spy Test Double Using Prophecy"
date: 2015-05-20 13:47:25 +0300
comments: true
categories: [TDD, Prophecy, PHP, Technical]
permalink: /spy-test-double-using-prophecy
path: /source/_posts/2015-05-20-spy-test-double-using-prophecy.markdown
---

Spy is a test double which records its actions. After code execution you can check if interaction is as expected. You use it to make sure the method(s) was called.

Below is the class which has an optional dependency which is called:

```php
<?php

namespace App;

class Questioner
{
    private $output;
    private $questions = [];
    private $scorer;

    public function __construct(OutputInterface $output, ScorerInterface $scorer = null)
    {
        $this->output = $output;
        $this->scorer = $scorer;
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
        $saved = $this->output->save($this->questions, $name);

        if ($saved && $this->scorer) {
            $this->scorer->update();
        }

        return $saved;
    }
}
```

To check that the `update()` method on `Scorer` is called use the following spy test double:

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
    function score_is_updated_on_save()
    {
        $outputStub = $this->prophesize(Output::CLASS);
        $outputStub->save([], Argument::type('string'))->willReturn(true);
        $scorerSpy = $this->prophesize(Scorer::CLASS);
        $questioner = new Questioner($outputStub->reveal(), $scorerSpy->reveal());

        $questioner->saveAs('any name');

        $scorerSpy->update()->shouldHaveBeenCalled();
    }
}
```

{% render_partial series/test-doubles-using-prophecy.markdown %}
