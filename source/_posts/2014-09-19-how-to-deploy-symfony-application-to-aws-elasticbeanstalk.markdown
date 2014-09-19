---
layout: post
title: "How-to: Deploy Symfony Application to AWS ElasticBeanstalk"
date: 2014-09-19 09:03:02 +0300
comments: true
categories: [Symfony, AWS, ElasticBeanstalk, Deploy, Tips]
permalink: /how-to-deploy-symfony-application-to-aws-elasticbeanstalk
path: /source/_posts/2014-09-19-how-to-deploy-symfony-application-to-aws-elasticbeanstalk.markdown
---

I while ago I started working on an application so I could learn Symfony and solve a problem I had. After it reached a minimal state where it could be deployed to "production" environment I chose to push it to AWS ElasticBeanstalk as I'm quite comfortable with using it. Unfortunately (or maybe fortunately as the best way to learn something is still through practice), I bumped into a few problems while deploying. The article is split into sections explaining what and why a piece of code is added. You might not need all of them or you might need some adjustments. For this article I will use the default Symfony application and full code can be found at [github][symfony-demo-app-github-repo].

You can jump to any of the sections:

* [Prerequisites](#prerequisites)
* [Add AWSDevTools to Repository](#add-awsdevtools)
* [Create a Key Pair (optional)](#create-key-pair)
* [Create ElasticBeanstalk environment configuration/description](#create-eb-config)
* [Add environment variables](#add-environment-variables)
* [Add vendors Directory to Repository](#add-vendors-dir)
* [Add environment configuration and Update Composer](#add-environment-config)
* [Install mongo extension](#install-mongo-extension)
* [Run Composer Install](#run-composer-install)
* [Update Cache Files](#update-cache-files)
* [Add Apache Configuration (optional)](#add-apache-config)
* [Remove dev Entry Point (optional)](#remove-dev-entry)
* [Add Cron (optional)](#add-cron)
* [Add New Relic Configuration (optional)](#add-new-relic-config)
* [Conclusion](#conclusion)

## Prerequisites <a name="prerequisites"></a>

The article assumes you already have the [AWS account][aws-home], [AWS CLI][aws-cli-home] configured and a project in [git repository][symfony-demo-app-github-repo] ready to be deployed. The application will be deployed to `us-east-1` region, so make changes accordingly if you want to deploy to a different region.

For deployment we will use the `t2.micro` instance type, which is a new free tier eligible instance type. This updated instance type can only be launched in VPC so you might need to create it for your account, it can be done using a [wizard][aws-vpc-wizard].

If you will be creating a single instance ElasticBeanstalk application you only need *"VPC with a Single Public Subnet."* If you want to create a load balanced application you will need *"VPC with Public and Private Subnets."* Just note what VPC with public and private subnets requires a NAT instance which will add additional charges. You can learn more about creating VPC at [AWS Docs][aws-docs-vpc-howto].

You will also need to create the IAM role to be used for ElasticBeanstalk deployments.

Some of the steps can be done using the web GUI or different applications, but for the most part I will be using the terminal on OS X.

Check **[.ebextensions/misc/aws-cli-commands-used.md][demo-app-repo-misc-directory]** from demo application for more information (commands used).

## Add AWSDevTools to Repository <a name="add-awsdevtools"></a>

To be able to push your repository to the ElasticBeanstalk the repository has to be extended with [AWSDevTools][aws-dev-tools-home]. Download, extract and go to correct directory depending on your OS (for Linux and Mac it will be `AWSDevTools/Linux`). You need to run the `AWSDevTools-RepositorySetup.sh` from the directory which contains your repository.

If everything was done correctly you should get a few new commands under `git aws.` namespace. Now run the `git aws.config` command to initialize configuration required for pushing repository to ElasticBeanstalk (comments after `#`, don't enter them).

```bash
AWS Region [default to us-east-1]: # enter your region
AWS Elastic Beanstalk Application: demo-app # enter your application name
AWS Elastic Beanstalk Environment: demo-prod-env # enter your environment name
```

The command should output some explanations about how to set the AWS credentials. As I work with multiple AWS accounts I personally set the credentials in the project. The command created a `.elasticbeanstalk` directory which you should avoid adding to source control (especially if it contains credentials). The directory should have `config` and `aws_credential_file` files with contents (including a manual change for credentials):

```ini
# below is contents of .elasticbeanstalk/config

[global]
ApplicationName=demo-app
DevToolsEndpoint=git.elasticbeanstalk.us-east-1.amazonaws.com
EnvironmentName=demo-prod-env
Region=us-east-1
AwsCredentialFile=.elasticbeanstalk/aws_credential_file

# below is contents of .elasticbeanstalk/aws_credential_file

AWSAccessKeyId=your-access-key
AWSSecretKey=your-secret-key
```

**Bonus tip:** One of [best IAM practices][best-iam-practices-youtube] is to allow users only what they need. I use the separate group and user for pushing repository to ElasticBeanstalk. Bellow is the policy you can attach to your group/user to allow only what is needed for deploying an application (modify for your own needs):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticbeanstalk:*",
        "ec2:*",
        "elasticloadbalancing:*",
        "autoscaling:*",
        "cloudwatch:*",
        "s3:*",
        "sns:*",
        "cloudformation:*",
        "rds:*"
      ],
      "Resource": "*"
    }
  ]
}
```

## Create a Key Pair (optional) <a name="create-key-pair"></a>

If you want to connect to your instances (e.g., to debug) you will need a key pair. You should avoid making any changes to your instances as it won't persist and can bring your instance to unknown state.

You can create a key pair by running:

```bash
aws ec2 create-key-pair --key-name demoapp_prodkey > demoapp_prodkey.pem
```

After the command completes open the file, delete everything that is not inside `KeyMaterial` value and replace `\n` with newlines.

Before you start using the key pair you need to change the permissions which can be done with command:

```bash
chmod 400 demoapp_prodkey.pem
```

To connect to your instance you will need to know the IP address of it. So for example if it was `54.88.29.72` you could SSH to it with the following command (to connect to Amazon Linux instances the user is `ec2-user`):

```bash
ssh -i demoapp_prodkey.pem ec2-user@54.88.29.72
```

## Create ElasticBeanstalk environment configuration/description <a name="create-eb-config"></a>

To always get the ElasticBeanstalk environment in the same state all the required information should be saved inside configuration files.

Create a file `.ebextensions/env/prod-single.json` with the following contents:

```json
[
    {
        "Namespace": "aws:elasticbeanstalk:environment",
        "OptionName": "EnvironmentType",
        "Value": "SingleInstance"
    },
    {
        "Namespace": "aws:autoscaling:launchconfiguration",
        "OptionName": "EC2KeyName",
        "Value": "demoapp_prodkey"
    },
    {
        "Namespace": "aws:autoscaling:launchconfiguration",
        "OptionName": "IamInstanceProfile",
        "Value": "aws-elasticbeanstalk-ec2-role"
    },
    {
        "Namespace": "aws:autoscaling:launchconfiguration",
        "OptionName": "InstanceType",
        "Value": "t2.micro"
    },
    {
        "Namespace": "aws:ec2:vpc",
        "OptionName": "VPCId",
        "Value": ""
    },
    {
        "Namespace": "aws:ec2:vpc",
        "OptionName": "Subnets",
        "Value": ""
    },
    {
        "Namespace": "aws:ec2:vpc",
        "OptionName": "ELBSubnets",
        "Value": ""
    },
    {
        "Namespace": "aws:elasticbeanstalk:container:php:phpini",
        "OptionName": "memory_limit",
        "Value": "800M"
    },
    {
        "Namespace": "aws:elasticbeanstalk:container:php:phpini",
        "OptionName": "document_root",
        "Value": "/web"
    },
    {
        "Namespace": "aws:elasticbeanstalk:hostmanager",
        "OptionName": "LogPublicationControl",
        "Value": "true"
    }
]
```

This configuration will create a single instance environment. For all available options and their explanations check the [docs][aws-eb-environment-config-docs]. If you would like to create a load balanced environment you will need to make some changes to the configuration file (you can find it all at `.ebextensions/env/prod-load.json`). In short, you should remove `EnvironmentType` option (or change to `LoadBalanced`) and add the options provided below (just know what you will need a VPC with private and public subnets if you want to use new instance types):

```json
[
    {
        "Namespace": "aws:autoscaling:asg",
        "OptionName": "MinSize",
        "Value": "1"
    },
    {
        "Namespace": "aws:autoscaling:asg",
        "OptionName": "MaxSize",
        "Value": "4"
    },
    {
        "Namespace": "aws:autoscaling:launchconfiguration",
        "OptionName": "SecurityGroups",
        "Value": ""
    }
]
```

You will also need to fill values (will depend on application type, read **[Prerequisites](#prerequisites)** and [AWS VPC How To][aws-docs-vpc-howto]) for `VPCId`, `Subnets`, `ELBSubnets`, `SecurityGroups` from your created VPC.

Run the following command to create your `demo-app` ElasticBeanstalk application (change the name or provide description if needed):

```bash
aws elasticbeanstalk create-application --application-name demo-app --description ""
```

Now you only need to choose the the solution stack name. All available stacks can be returned with command (we will choose the latest as of this writing 64 bit stack named `64bit Amazon Linux 2014.03 v1.0.4 running PHP 5.5`):

```bash
aws elasticbeanstalk list-available-solution-stacks
```

Run the command below to create the ElasticBeanstalk environment (configure the arguments if needed):

```bash
aws elasticbeanstalk create-environment \
    --application-name demo-app \
    --environment-name demo-prod-env \
    --description "" \
    --option-settings file://.ebextensions/env/prod-single.json \
    --solution-stack-name "64bit Amazon Linux 2014.03 v1.0.4 running PHP 5.5"
```

After a while if everything was fine the new environment for application should be up and ready.

## Add environment variables <a name="add-environment-variables"></a>

Keeping credentials and other information (API keys, passwords, connection data, etc.) in source control is a bad idea and not really scalable. Your environment should contain all the information needed to make the application on it work. You can configure your environment variables using `aws:elasticbeanstalk:application:environment` namespace. Create the `.ebextensions/env/prod-variables.json` file and put the following into it:

```json
[
    {
        "Namespace": "aws:elasticbeanstalk:application:environment",
        "OptionName": "APP_ENV",
        "Value": "prod"
    },
    {
        "Namespace": "aws:elasticbeanstalk:application:environment",
        "OptionName": "SYMFONY__ENV__SECRET",
        "Value": ""
    },
    {
        "Namespace": "aws:elasticbeanstalk:application:environment",
        "OptionName": "SYMFONY__ENV__MONGODB__SERVER",
        "Value": ""
    },
    {
        "Namespace": "aws:elasticbeanstalk:application:environment",
        "OptionName": "SYMFONY__ENV__MONGODB__DATABASE",
        "Value": ""
    },
    {
        "Namespace": "aws:elasticbeanstalk:application:environment",
        "OptionName": "SYMFONY__ENV__MONGODB__PASSWORD",
        "Value": ""
    },
    {
        "Namespace": "aws:elasticbeanstalk:application:environment",
        "OptionName": "SYMFONY__ENV__MONGODB__USERNAME",
        "Value": ""
    }
]
```

You should fill the `Value` key with your values (just avoid committing the values to repository). The `APP_ENV` is the variable for describing the type of environment and will be used later. As the deployment should happen automatically and you won't be able to enter your parameters manually they should be set automatically using the environment variables. This can be done using variables which start with `SYMFONY__` as they are automatically converted (the `__` becomes a `.`). As an example the `SYMFONY__ENV__MONGODB__SERVER` will become `%env.mongodb.server%`. The `parameters.yml.dist` has to be updated for this to work, make sure it contains the following changes:

```yaml
parameters:
    secret:           "%env.secret%"

    mongodb_server:   "%env.mongodb.server%"
    mongodb_database: "%env.mongodb.database%"
    mongodb_password: "%env.mongodb.password%"
    mongodb_username: "%env.mongodb.username%"
```

Run the following command to update your environment with variables:

```bash
aws elasticbeanstalk update-environment \
    --environment-name demo-prod-env \
    --option-settings file://.ebextensions/env/prod-variables.json
```

## Add vendors Directory to Repository <a name="add-vendors-dir"></a>

The `10_composer_install.sh` hook on application deployment automatically runs `composer install` if it finds the `composer.json` file in the root directory. As I would like to run composer myself (and it might fail depending on your application) it can be disabled by moving `composer.json` file outside of main directory or by adding vendor directory to repository. This can be done by creating a `.gitkeep` file inside `vendor` directory and modifying `.gitignore` to contain:

```text
/vendor/*
!vendor/.gitkeep
```

This change will add a `vendor` directory to your repository, but everything inside it will be ignored (as it has to be installed automatically and not committed to repository).

## Add environment configuration and Update Composer <a name="add-environment-config"></a>

The ElasticBeanstalk environment can be configured by using `.config` files inside `.ebextensions` directory. You can read more about how to [customize EC2 intances in docs][aws-docs-customize-ec2]. In short it reads the `.config` files from `.ebextensions` directory and runs them in alphabetical order. After the deployment `.ebextensions` directory is removed.

The composer by default used in environments has an old version, it's a good idea to have it updated. All of this can be done by creating `03-main.config` file and adding the following contents to it:

```yaml
commands:
    300-composer-update:
        command: "export COMPOSER_HOME=/root && composer.phar self-update -n"
```

The config file starts with `03-` so we could have some breathing room if other configuration files have to be run before it. The commands are also run alphabetically so it's a good idea to start with a hundred based number as it will give you enough space for 99 commands before you will need to modify the order of them.

Now you could push your application to the environment (it still won't work as additional steps are required) by running:

```bash
git aws.push
```

## Install mongo extension <a name="install-mongo-extension"></a>

Our project uses the MongoDB and the required PHP mongo extension is not available by default on created environment. This can be easily taken care of by adding a command to install it.

```yaml
commands:
    200-install-mongo-ext:
        command: "yes '' | pecl install mongo"
        ignoreErrors: true
```

The `ignoreErrors` is required as it would be thrown if the extension is already installed. This way if extension is already installed, it just skips this step. If for some reason the extension failed to install, your deployment would still fail on composer install step as it won't have the required extension.

## Run Composer Install <a name="run-composer-install"></a>

The next step would be to run the composer install. This can be done by adding `container_command` which runs after the application and web server have been set up, but before the application version is deployed. Add the following to `03-main.config`:

```yaml
container_commands:
    300-run-composer:
        command: "composer.phar install --no-dev --optimize-autoloader --prefer-dist --no-interaction"
```

This will run composer install without `require-dev` packages (in production we don't need them), optimize the autoloader (performance improvements), preferring distribution packages (performance improvement) and without any interaction (as the deployment is being done automatically).

This command will fail right now as composer runs scripts using the dev environment and required dev packages doesn't exist. At the moment there is no way to inform the commands to run with custom options. From my research of the commands being run by composer some are not really required after the first (which will happen when you create a new Symfony project) and some can be run "manually" giving you much more control of them.

The scripts which are left will build the parameters file and the bootstrap file. Update your `composer.json` to have the following for `scripts` entry (makes changes according to your project):

```json
{
    "scripts": {
        "post-root-package-install": [
            "SymfonyStandard\\Composer::hookRootPackageInstall"
        ],
        "post-install-cmd": [
            "Incenteev\\ParameterHandler\\ScriptHandler::buildParameters",
            "Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::buildBootstrap"
        ],
        "post-update-cmd": [
            "Incenteev\\ParameterHandler\\ScriptHandler::buildParameters",
            "Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::buildBootstrap"
        ]
    }
}
```

Mostly by default you want to remove the following scripts:

```text
"Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::clearCache"
"Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::installAssets"
"Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::installRequirementsFile"
"Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::removeSymfonyStandardFiles"
```

On your local environment run the `composer update` command to update your `composer.lock` file.

Now because we removed scripts from composer we should run them from our environment configuration. Add the following to `03-main.config`:

```yaml
container_commands:
    400-clear-cache:
        command: "php app/console cache:clear --env=$APP_ENV --no-debug"
    425-install-assets:
        command: "php app/console assets:install --env=$APP_ENV --no-debug"
    450-dump-assets:
        command: "php app/console assetic:dump --env=$APP_ENV --no-debug"
```

The commands use `$APP_ENV` value for environment so for different environments you won't need to change your configuration file.

## Update Cache Files <a name="update-cache-files"></a>

Because all commands are being run while in *"staging"* area the locations are incorrect after deployment (`/var/app/ondeck` should be changed to `/var/app/current`). This can be fixed by running a `sed` command on cache files. Add the following to `03-main.config`:

```yaml
container_commands:
    600-update-cache:
        command: "source .ebextensions/bin/update-cache.sh && source .ebextensions/bin/update-cache.sh"
```

You have to run this command twice as it doesn't replace all of it during the first run. Create the file `.ebextensions/bin/update-cache.sh` with contents:

```bash
#!/bin/bash

sed -i -e "s/\/var\/app\/ondeck/\/var\/app\/current/" app/cache/$APP_ENV/*.php
```

This script will replace all `/var/app/ondeck` occurrences with `/var/app/current` in cache files.

If you pushed your application to an environment at this moment you should have a completely functioning application. Read the following sections to improve your deployment.

## Add Apache Configuration (optional) <a name="add-apache-config"></a>

The PHP values can be changed using Apache configuration. The Apache configuration can also be updated to improve the security of your application (e.g., disallow entering hidden directories or files). Add an Apache configuration file to `.ebextensions/apache/zapplication.conf` with following contents:

```apache
php_value short_open_tag off

# "-Indexes" will have Apache block users from browsing folders without a
# default document Usually you should leave this activated, because you
# shouldn't allow everybody to surf through every folder on your server (which
# includes rather private places like CMS system folders).
<IfModule mod_autoindex.c>
  Options -Indexes
</IfModule>

# Block access to "hidden" directories or files whose names begin with a
# period. This includes directories used by version control systems such as
# Subversion or Git.
<IfModule mod_rewrite.c>
  RewriteCond %{SCRIPT_FILENAME} -d [OR]
  RewriteCond %{SCRIPT_FILENAME} -f
  RewriteRule "(^|/)\." - [F]
</IfModule>

# Block access to backup and source files. These files may be left by some
# text/html editors and pose a great security danger, when anyone can access
# them.
<FilesMatch "(\.(bak|config|sql|fla|psd|ini|log|sh|inc|swp|dist|pem)|~)$">
  Order allow,deny
  Deny from all
  Satisfy All
</FilesMatch>

# Block access to files & directories starting with a dot
<FilesMatch "^\.">
  Order allow,deny
  Deny from all
</FilesMatch>
<DirectoryMatch "^\.|\/\.">
  Order allow,deny
  Deny from all
</DirectoryMatch>
```

This will change PHP `short_open_tag` value to `off` and make other changes to make your application more secure. The configuration file starts with letter `z` as we want to load this configuration at the end.

Add the container command to your `03-main.config` file to copy this configuration file:

```yaml
container_commands:
    200-copy-apache-config:
        command: "cp .ebextensions/apache/zapplication.conf /etc/httpd/conf.d/zapplication.conf"
```

## Remove dev Entry Point (optional) <a name="remove-dev-entry"></a>

As we are deploying to production, it doesn't make a lot of sense to keep development environment entry point (especially if you remove IP or similar checks). This entry point can be removed on deployment by adding following container command to `03-main.config`:

```yaml
container_commands:
    700-remove-dev-app:
        command: "rm web/app_dev.php"
```

## Add Cron (optional) <a name="add-cron"></a>

Your application might need to use the cron to run some tasks on schedule. Create a new file `.ebextensions/cron/main` and put your commands in it (just make sure this file ends with an empty line).

```bash
*/5 * * * * . /opt/elasticbeanstalk/support/envvars && php /var/app/current/app/console --env=$APP_ENV --no-debug acme:hello

```

This command will run every five minutes. Crontab runs in a minimal environment so we start with `. /opt/elasticbeanstalk/support/envvars` to make sure it has all the environment variables. After that we run the Symfony console command from our application using the environment which is set as the environment variable. Add as many commands as you need in this file.

Make changes to `03-main.config` to update crontab tasks:

```yaml
container_commands:
    800-run-cron:
        command: "crontab .ebextensions/cron/main"
```

If you decide you don't need to run cron tasks anymore, **don't** just delete the container command. Make sure you make this change incrementally, by first removing all the contents from `.ebextensions/cron/main` file (leave it empty or change the existing `800-run-cron` command to `crontab -r`) and deploying it to your ElasticBeanstalk environment. Only after it's done should you remove the container command and a file. If you just removed the container command, your existing instances will keep the commands in `crontab` from previous deployment.

## Add New Relic Configuration (optional) <a name="add-new-relic-config"></a>

In case you would like to add [New Relic][new-relic-home] monitoring for your application, all the required configuration can be added to your deployment. Create a new file `02-newrelic.config` which will contain the following configuration:

```yaml
packages:
    yum:
        newrelic-php5: []
        newrelic-sysmond: []
    rpm:
        newrelic: http://yum.newrelic.com/pub/newrelic/el5/x86_64/newrelic-repo-5-3.noarch.rpm
commands:
    300-install-newrelic:
        command: "newrelic-install install"
container_commands:
    300-update-newrelic-ini:
        command: "source .ebextensions/bin/update-newrelic-ini.sh"
    400-configure-newrelic-sysmond:
        command: "nrsysmond-config --set license_key=$NEW_RELIC_LICENSE_KEY"
    430-start-sysmond:
        command: "/etc/init.d/newrelic-sysmond start"
```

This will install New Relic agent and system monitoring daemon and update configuration used by them.

To update the configuration used by the agent create a `.ebextensions/bin/update-newrelic-ini.sh` script:

```bash
#!/bin/bash

sed -i -e 's/newrelic.license.*/newrelic.license = '"$NEW_RELIC_LICENSE_KEY"'/' /etc/php-5.5.d/newrelic.ini
sed -i -e 's/newrelic.appname.*/newrelic.appname = "'"$SYMFONY__ENV__NEW_RELIC__APPLICATION_NAME"'"/' /etc/php-5.5.d/newrelic.ini
```

The script will set the license and application name using values from environment variables. Add the new environment variables to `.ebextensions/env/prod-variables.json` file and update your environment using AWS CLI.

```json
[
    ...
    {
        "Namespace": "aws:elasticbeanstalk:application:environment",
        "OptionName": "SYMFONY__ENV__NEW_RELIC__API__KEY",
        "Value": ""
    },
    {
        "Namespace": "aws:elasticbeanstalk:application:environment",
        "OptionName": "SYMFONY__ENV__NEW_RELIC__APPLICATION_NAME",
        "Value": ""
    },
    {
        "Namespace": "aws:elasticbeanstalk:application:environment",
        "OptionName": "NEW_RELIC_LICENSE_KEY",
        "Value": ""
    }
]
```

Install [EkinoNewRelicBundle][ekino-newrelic-bundle] in your Symfony application by running the following on your development environment (don't forget to enable the bundle in your `app/AppKernel.php`):

```bash
composer require ekino/newrelic-bundle "1.2.*@dev"
```

Add the following to your configuration files:

```yaml
# in app/config/config.yml

ekino_new_relic:
    enabled: false
    application_name: "%new_relic_application_name%"
    api_key: "%new_relic_api_key%"

# in app/config/config_prod.yml

ekino_new_relic:
    enabled: true
```

Update your `app/config/parameters.yml.dist` with new parameters:

```yaml
parameters:

    new_relic_application_name: "%env.new_relic.application_name%"
    new_relic_api_key: "%env.new_relic.api.key%"
```

To notify about deployment add a new container command to `03-main.config`:

```yaml
container_commands:
    900-notify-deployment:
        command: "php app/console newrelic:notify-deployment --env=$APP_ENV --no-debug --user=eb"
```

Push the application to your environment and if everything was done correctly you should start seeing some stats in your New Relic account.

## Conclusion <a name="conclusion"></a>

This article might not had all the steps required for deploying your Symfony application to ElasticBeanstalk, but it should point you on the right way to deploying your application. If something was not informative enough or confusing, please let me know and I will try to clarify it. If you have any questions or ideas, leave them in the comments to start the knowledge sharing.

[aws-home]: http://aws.amazon.com
[aws-cli-home]: http://aws.amazon.com/cli
[aws-vpc-wizard]: https://console.aws.amazon.com/vpc/home
[symfony-demo-app-github-repo]: https://github.com/ifdattic/symfony-app-deploy-to-aws-eb-article-code
[aws-docs-vpc-howto]: http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo-vpc-basic.html
[best-iam-practices-youtube]: http://youtu.be/tTJrbsu_Wzc
[aws-dev-tools-home]: http://aws.amazon.com/code/6752709412171743
[aws-eb-environment-config-docs]: http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html
[aws-docs-customize-ec2]: http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/customize-containers-ec2.html
[new-relic-home]: http://newrelic.com
[ekino-newrelic-bundle]: https://github.com/ekino/EkinoNewRelicBundle
[demo-app-repo-misc-directory]: https://github.com/ifdattic/symfony-app-deploy-to-aws-eb-article-code/tree/master/.ebextensions/misc
