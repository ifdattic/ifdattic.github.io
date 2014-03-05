---
layout: post
title: "Create Yii Extension by Example - EPrism"
date: 2014-03-05 21:46:37 +0200
comments: true
categories: [Yii, Extensions, Tutorials]
permalink: /create-yii-extension-by-example-eprism
path: /source/_posts/2014-03-05-create-yii-extension-by-example-eprism.markdown
---

This is the tutorial about how to make a simple [Yii][yii-homepage] extension. It would be most useful to people who are just starting with Yii framework. The tutorial is step-by-step guide using an [EPrism][eprism-homepage] extension as a base. This would be really helpful if for example you found a nice JavaScript plugin and want to use it as a part of framework rather than just adding it statically in your application.

## 1. Set up

Everything needs to start from something, so do the following steps to have a base on which you can build your extension:

* Create a folder `EPrism` for extension
* Create an extension file name `EPrism.php` inside the folder
* Create a class `EPrism` which extends a framework class of `CWidget` in the `EPrism.php` file
* Add `init()` and `run()` methods

[`CWidget` class][cwidget-docs-page] is a base class for widgets. You can think of a widget as a self-contained component that may generate presentation based on model data.

The [`init()` method][cwidget-init-docs-page] initializes the widget.

The [`run()` method][cwidget-run-docs-page] executes the widget.

#### Step results

By now your folder structure should be:

```bash Folder structure after first step
EPrism/
└── EPrism.php
```

The contents of `EPrism.php` file should be:

```php Extension contents after first step
class EPrism extends CWidget
{
    public function init()
    {
        return parent::init();
    }

    public function run()
    {
    }
}
```

## 2. Add extension assets

To be able to use the extension *out of the box*, you need to add the assets for it. Start by creating a folder `assets` which will contain the extension assets.

Now go to the [Prism download page][prism-download-page], generate the wanted configuration, and download provided code. Save JavaScript code as `prism.js` in `assets` folder, and CSS code as `prism.css` in the same folder.

To use the downloaded assets you will need to add the code to `run()` method.

First you want to [publish your assets][asset-publish-docs-page] to a web accessible directory:

```php Publish assets to a web accessible directory
$assets = Yii::app()->getAssetManager()->publish(dirname(__FILE__) . '/assets');
```

Also get *ClientScript* component to help you with registering your assets:

```php Get & assign ClientScript component to a variable
$cs = Yii::app()->getClientScript();
```

Because *Prism* only needs the asset files added to page for it to run, all that is left is to register the assets:

```php Register assets to the page
$cs->registerCssFile($assets . '/prism.css');

$cs->registerScriptFile($assets . '/prism.js');
```

The [`registerCssFile()`][registercssfile-docs-page] and [`registerScriptFile()`][registerscriptfile-docs-page] adds the CSS and JavaScript files to the rendered page. If you needed to run some JavaScript code to run the plugin then you will need to add a call to [`registerScript()`][registerscript-docs-page] method which will add your JavaScript code to the page.

And this is it. You only need this much code to create a simple Yii extension. But of course it can be improved so continue reading if you want to get some ideas how to improve your extensions after having the minimal needed code.

#### Step results

By now your folder structure should be:

```bash Folder structure after second step (minimal working extension)
EPrism/
├── EPrism.php
└── assets
    ├── prism.css
    └── prism.js
```

The contents of `EPrism.php` file should be:

```php Extension contents after second step (minimal working extension)
class EPrism extends CWidget
{
    public function init()
    {
        return parent::init();
    }

    public function run()
    {
        $assets = Yii::app()->getAssetManager()->publish(dirname(__FILE__) . '/assets');

        $cs = Yii::app()->getClientScript();

        $cs->registerCssFile($assets . '/prism.css');

        $cs->registerScriptFile($assets . '/prism.js');
    }
}
```

## 3. Add customizations for script

The extension currently does what it's supposed to do, but how about adding a couple of customizations like allowing to change the position of where script is inserted and disabling automatic highlighting.

### Change script position

First add the class variable which will tell where JavaScript files should be inserted:

```php Add variable to hold script position
public $scriptPosition;
```

Then add the following code at the start of `init()` method:

```php Set to default position if none provided
if (is_null($this->scriptPosition)) {
    $this->scriptPosition = Yii::app()->clientScript->defaultScriptFilePosition;
}
```

It will make sure that if you don't set a custom script position for the extension, the default position for all script files will be used.

To finish it off just set the position then registering script file in `run()` method:

```php Set the position of script through second parameter
$cs->registerScriptFile($assets . '/prism.js', $this->scriptPosition);
```

Now if for example you need to have some script loaded in the `<head>` element while your application is configured to add all scripts before closing `<body>` it is very simple to do in a widget configuration.

### Disable automatic highlighting

*Prism* automatically highlights the code in your page, but you can turn it off by adding `data-manual` attribute to the `<script>` element which loads the plugin.

You will need to add two variables, one for holding all the options for script and another as a flag for manual highlighting:

```php Add variables to allow script customization
private $scriptOptions = [];

public $manualHighlight = false;
```

The `$scriptOptions` variable is private because you don't want anyone changing it (the widget will populate it with needed values). To make sure it happens add the following code in the `init()` method before returning parent method:

```php Populate script options from public variables
if ($this->manualHighlight) {
    $this->scriptOptions['data-manual'] = true;
}
```

And then add options then registering your script file:

```php Customize registered script with 3rd parameter
$cs->registerScriptFile(
    $assets . '/prism.js',
    $this->scriptPosition,
    $this->scriptOptions
);
```

Now you can disable the automatic highlighting when you call the widget just by setting `manualHighlight` attribute to `true`.

### Allow to use custom asset files

To make extension re-usable and easy to use we added the JavaScript and CSS assets to it, but in some cases you might not want to use them. Maybe you only need to use a small portion of highlighter or maybe you have all the needed code in another file. To take care of those cases lets make asset files configurable using the following rules:

* If value is `false` don't register asset
* If value is `null` register default asset
* If value is `string` register the provided value

To allow for this configuration first add the following class variables:

```php Add variables for asset files customization
public $cssFile

public $scriptFile
```

And then change the asset registration lines with extended logic:

```php Extend the asset registration
if ($this->cssFile !== false) {
    $cs->registerCssFile(
        $this->cssFile ? $this->cssFile : $assets . '/prism.css'
    );
}

if ($this->scriptFile !== false) {
    $cs->registerScriptFile(
        $this->scriptFile ? $this->scriptFile : $assets . '/prism.js',
        $this->scriptPosition,
        $this->scriptOptions
    );
}
```

This simple change allows you to be much more flexible with widget usage.

#### Step results

You folder structure hasn't changed so it will be the same as before.

The contents of `EPrism.php` file should be:

```php Extension contents with all improvements
class EPrism extends CWidget
{
    private $scriptOptions = [];
    
    public $manualHighlight = false;
    
    public $scriptPosition;
    
    public $cssFile;
    
    public $scriptFile;
    
    public function init()
    {
        if (is_null($this->scriptPosition)) {
            $this->scriptPosition = Yii::app()->clientScript->defaultScriptFilePosition;
        }
        
        if ($this->manualHighlight) {
            $this->scriptOptions['data-manual'] = true;
        }
        
        return parent::init();
    }
    
    public function run()
    {
        $assets = Yii::app()->getAssetManager()->publish(dirname(__FILE__) . '/assets');
        
        $cs = Yii::app()->getClientScript();
        
        if ($this->cssFile !== false) {
            $cs->registerCssFile(
                $this->cssFile ? $this->cssFile : $assets . '/prism.css'
            );
        }
        
        if ($this->scriptFile !== false) {
            $cs->registerScriptFile(
                $this->scriptFile ? $this->scriptFile : $assets . '/prism.js',
                $this->scriptPosition,
                $this->scriptOptions
            );
        }
    }
}
```

## Bonus points: Sharing is caring

At this point you have a working, customizable extension which will kick ass in your project. But how about sharing it with your fellow programmers?

Simply add **readme** explaining how to use your extension and some comments in the code explaining what is what. Even if you're not going to share the extension with others, you will thank yourself later when the time comes to improve it. Include the `composer.json` file to make it possible to use your extension through [Composer][composer-homepage] and just share it on [GitHub][github-homepage] or somewhere else for everyone to enjoy.


## Conclussion

Now you can relax and take a well deserved cup of tea.

[registerscript-docs-page]: http://www.yiiframework.com/doc/api/1.1/CClientScript/#registerScript-detail
[registercssfile-docs-page]: http://www.yiiframework.com/doc/api/1.1/CClientScript/#registerCssFile-detail
[eprism-homepage]: http://www.yiiframework.com/extension/eprism
[registerscriptfile-docs-page]: http://www.yiiframework.com/doc/api/1.1/CClientScript/#registerScriptFile-detail
[composer-homepage]: https://getcomposer.org/
[prism-download-page]: http://prismjs.com/download.html
[yii-homepage]: http://www.yiiframework.com/
[asset-publish-docs-page]: http://www.yiiframework.com/doc/api/1.1/CAssetManager/#publish-detail
[cwidget-run-docs-page]: http://www.yiiframework.com/doc/api/1.1/CWidget#run-detail
[cwidget-init-docs-page]: http://www.yiiframework.com/doc/api/1.1/CWidget#init-detail
[cwidget-docs-page]: http://www.yiiframework.com/doc/api/1.1/CWidget/
[github-homepage]: https://github.com/
