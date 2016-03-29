---
layout: post
title: "How to use Composer - a PHP package manager"
date: 2016-03-29 19:15:26 +0300
comments: true
categories: [Technical, PHP, Composer, 80/20]
permalink: /how-to-use-composer
path: /source/_posts/2016-03-29-how-to-use-composer-a-php-package-manager.markdown
---

Composer is a tool for dependency management in PHP. It allows you to declare the libraries your project depends on and helps to manage those dependencies.

Dependencies are managed on a per-project basis, installing them in a directory inside your project. For convenience some dependencies can be installed globally (e.g., Symfony project installer).

Skip to any of the sections:

* [How to install and update](#how-to-install-update#)
    * [Installing on OS X](#install-on-osx)
* [Adding dependencies](#adding-dependencies)
    * [Adding specific version](#adding-specific-version)
* [Removing dependency](#removing-dependency)
* [Initializing composer.json file](#initializing-composerjson-file)
* [Updating the dependency](#updating-dependency)
* [Installing dependencies](#installing-dependencies)
    * [Installing dependencies on production servers](#installing-dependencies-on-production)
* [Autoloading](#autoloading)
    * [PSR-4](#psr4)
    * [PSR-0](#psr0)
    * [Classmap](#classmap)
    * [Development autoloading](#development-autoloading)
* [Creating a project](#creating-project)
* [Loading custom package / replacing existing package](#loading-custom-package)
    * [Adding / removing repository through CLI](#adding-repository-cli)
* [Running Composer globally](#running-composer-globally)
* [Adding platform requirements](#adding-platform-requirements)

<a name="how-to-install-update"></a>
## How to install and update

Composer can be installed by running:

```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

This will install Composer in the directory `/usr/local/bin` (which should be in your path) allowing you to run it from anywhere by using `composer` command.

If your installation is working correctly you should see the version and available commands:

```bash
composer
```

To make sure that you're using the latest version of Composer, constantly run the self update:

```bash
composer self-update
```

<a name="install-on-osx"></a>
### Installing on OS X

If you use OS X you can install Composer through [Homebrew](http://brew.sh/):

```bash
brew install homebrew/php/composer
```

Check the [documentation](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx) if any of the installation options doesn't work for you (e.g., install locally or on Windows).

<a name="adding-dependencies"></a>
## Adding dependencies

To add a dependency your project needs to use the `require` command with a package name (format `<vendor>/<name>`) command:

```bash
composer require monolog/monolog

# Signature:
composer require <vendor>/<name>

# Signature of adding multiple dependencies:
composer require <vendor>/<name> <vendor2>/<name> <vendor2>/<name2>
```

This creates the `composer.json` file (if it doesn't exist), and installs the dependency (including dependencies your dependency depends on).

**Avoid changing `composer.json` file manually**, most of the time the `require` command is enough to manage dependencies.

To add a development dependency use the `--dev` flag with `require` command:

```bash
composer require --dev phpspec/phpspec

# Signature:
composer require --dev <vendor>/<name>
```

<a name="adding-specific-version"></a>
### Adding specific version 

The `require` command **will automatically choose a suitable version** you can use in your project. If you need to provide the specific version of dependency provide it with the package name:

```bash
composer require monolog/monolog:~1.17.0

# Signature:
composer require <vendor>/<name>:<version>
```

Version to use can be defined in the following ways:

* The `^` (caret) operator means *any non-breaking version / until major* (e.g., `^1.2.3` is equivalent to `>=1.2.3 <2.0.0`)
* The `~` (tilde) operator means *approximate / increment right most digit* (e.g., `~1.2` is equivalent to `>=1.2 <2.0.0` or `~1.2.3` is equivalent to `>=1.2.3 <1.3.0`)
* Read the [documentation](https://getcomposer.org/doc/articles/versions.md) to learn about other version constraints (exact, range, wildcard)

Versions are described using semantic versioning (SemVer) which uses the format `MAJOR.MINOR.PATCH`. Each of the numbers have a specific meaning:

* `MAJOR` - API changes that break backwards-compatibility
* `MINOR` - new features
* `PATCH` - bug fixes

<a name="removing-dependency"></a>
## Removing dependency 

If you don't need the dependency anymore use the `remove` command to remove it from the `composer.json` file and directory:

```bash
composer remove monolog/monolog

# Signature:
composer remove <vendor>/<name>
```

To remove the development dependency add `--dev` flag to `remove` command:

```bash
composer remove --dev phpspec/phpspec

# Signature:
composer remove --dev <vendor>/<name>
```

<a name="initializing-composerjson-file"></a>
## Initializing composer.json file 

If you are creating a package or want to fill a `composer.json` file interactively, use the `init` command:

```bash
composer init
```

This will ask you to provide information like package name, description, dependencies, etc. After you provide all the information it will generate a `composer.json` file.

<a name="updating-dependency"></a>
## Updating the dependency 

To get the latest versions of the dependencies (also updates the `composer.lock` file) use the `update` command:

```bash
composer update
```

If you want to update only specific packages provide them to the `update` command:

```bash
composer update monolog/monolog

# Signature:
composer update <vendor>/<name>

# Wildcard is allowed to update multiple packages (without listing them):
composer update <vendor>/*
```

<a name="installing-dependencies"></a>
## Installing dependencies 

Use the `install` command to install project dependencies:

```bash
composer install
```

This will read the `composer.json` file and resolve your dependencies. After finishing the installation it will create a `composer.lock` file, which contains the exact versions installed. This makes sure that the same versions are installed every time the `install` command is executed.

**Commit your application's `composer.lock` file (along with `composer.json`) into version control**.

By convention dependencies are installed into a `vendor` directory, which **should not be committed to version control**.

<a name="installing-dependencies-on-production"></a>
### Installing dependencies on production servers 

You will want to use a few flags when installing dependencies on production servers:

```bash
composer install --prefer-dist --no-dev --optimize-autoloader --no-interaction
```

This will optimize the dependency installation which is really useful for production servers. It will try to install distribution packages (`--prefer-dist` flag), won't install development dependencies (`--no-dev` flag), and generate a classmap for faster autoloader (`--optimize-autoloader` flag). The `--no-interaction` flag will make sure that no interactive questions are asked (needed for automated deployments).

<a name="autoloading"></a>
## Autoloading 

Composer generates a `vendor/autoload.php` file which automatically loads the classes your project depends on. Just include that file in your PHP script:

```php
require __DIR__.'/vendor/autoload.php'
```

You can change the `autoload` key in your `composer.json` file to define the mapping.

If you added new classes you might need to update the autoloader. Use the `dump-autoload` command to do that:

```bash
composer dump-autoload

# For production use
composer dump-autoload --optimize --no-dev
```

<!-- https://getcomposer.org/doc/01-basic-usage.md#autoloading -->

<a name="psr4"></a>
### PSR-4 

Under the `psr-4` key you define a mapping from namespaces to paths, relative to the package root. The PSR-4 is the *recommended* choice for autoloading (avoids having to regenerate the autoloader after adding classes).

**Namespace prefixes must end in `\\` to avoid conflicts between similar prefixes**.

In addition to normal mapping definition, you can define multiple directories, or define a fallback directory:

```json
{
    "autoload": {
        "psr-4": {
            "Vendor\\Namespace\\Normal\\": "src/",
            "Vendor\\Namespace\\Multi\\": ["src/", "lib/"],
            "": "src/fallback/"
        }
    }
}
```

<a name="psr0"></a>
### PSR-0 

Under the `psr-0` key you define a mapping from namespaces to paths, relative to the package root. This also supports the PEAR-style non-namespaced convention.

**Namespace prefixes should end in `\\` to avoid conflicts between similar prefixes**.

In addition to normal mapping definition, you can define multiple directories, or define a fallback directory:

```json
{
    "autoload": {
        "psr-0": {
            "Vendor\\Namespace\\Normal\\": "src/",
            "Vendor_Namespace_PEAR_": "src/",
            "Vendor\\Namespace\\Multi\\": ["src/", "lib/"],
            "": "src/fallback/"
        }
    }
}
```

<a name="classmap"></a>
### Classmap 

For libraries that do not follow PSR-0/4 you can specify directories or files to search for classes (using the `classmap` key):

```json
{
    "autoload": {
        "classmap": ["src/", "lib/", "Something.php"]
    }
}
```

<a name="development-autoloading"></a>
### Development autoloading 

You should avoid polluting the autoloader in production with classes it doesn't need (like test suite). Using the `autoload-dev` key you can define classes that should be loaded only in development:

```json
{
    "autoload-dev": {
        "psr-4": {
            "MyLibrary\\Tests\\": "tests/"
        }
    }
}
```

<a name="creating-project"></a>
## Creating a project 

The `create-project` command will create a new project from an existing package. It's the equivalent of doing a git clone followed by installation of dependencies. The command takes the package name and the directory to create it in (optional: provide the version as third parameter):

```bash
composer create-project symfony/framework-standard-edition my_project_name
# or
composer create-project symfony/framework-standard-edition my_project_name 3.1.*

# Signature:
composer create-project <vendor>/<name> <path> <optional:version>
```

<a name="loading-custom-package"></a>
## Loading custom package / replacing existing package 

In some cases you might want to use a custom package. For example you fixed a bug in open source library and while waiting for PR to be merged you want to use the fixed library.

The branch on the forked repository should be prefixed with `dev-` (e.g., in the repository it will be `bugfix`, in the `composer.json` file it will be `dev-bugfix`). Then change the `repositories` key in `composer.json` (in example assume that I forked `Monolog` and created `bugfix` branch):

```json
{
    "repositories": [
        "type": "vcs",
        "url": "https://github.com/ifdattic/monolog"
    ],
    "require": {
        "monolog/monolog": "dev-bugfix"
    }
}
```

Now after updating the dependency it should replace the original package with a changed one (don't change the package name for override to work):

```bash
composer update monolog/monolog

# Signature
composer update
# or
composer update <vendor>/<name>
```

To avoid conflicts you might need to alias the branch for it to be treated as a specific version. To make in-line aliases use the `as` keyword:

```json
{
    "require": {
        "monolog/monolog": "dev-bugfix as 1.18.1"
    }
}
```

<!-- https://getcomposer.org/doc/articles/aliases.md -->

<a name="adding-repository-cli"></a>
### Adding / removing repository through CLI 

If you don't want to manually add repository use the `composer config repositories` command:

```bash
composer config repositories.monolog vcs https://github.com/ifdattic/monolog

# Signature:
composer config repositories.<name> <type> <url>
```

To remove a repository use `--unset` flag (`repo` is alias for `repositories`):

```bash
composer config --unset repo.monolog

# Signature:
composer config --unset repo.<name>
```

<!-- https://getcomposer.org/doc/05-repositories.md#loading-a-package-from-a-vcs-repository -->

<a name="running-composer-globally"></a>
## Running Composer globally 

Sometimes you might want to install some CLI tools globally. Using `global` command it will allow to install them to the directory defined in `COMPOSER_HOME` environment variable:

```bash
composer global require fabpot/php-cs-fixer

# Signature:
composer global <command> <vendor>/<name>
```

<!-- https://getcomposer.org/doc/03-cli.md#global  -->

<a name="adding-platform-requirements"></a>
## Adding platform requirements 

If you need to add requirements for the system you can use platform packages. They are virtual packages of the things that are installed on the system. For example the following snippet requires for PHP 7 to be available:

```json
{
    "require": {
        "php": "^7.0"
    }
}
```

The following platform packages are available: `php`, `hhvm`, `ext-<name>`, `lib-<name>`.

To get a list of locally available platform packages run:

```bash
composer show --platform
```

<!-- https://getcomposer.org/doc/02-libraries.md#platform-packages -->

## Conclusion

You can do a lot more with Composer, but this should take care of most of the use cases while developing.
