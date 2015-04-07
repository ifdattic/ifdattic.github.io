---
layout: post
title: "Integrating DataDog &amp; logstash on AWS EC2"
date: 2014-11-26 14:36:49 +0100
comments: true
categories: [Symfony, AWS, ElasticBeanstalk, DataDog, logstash, stats, Tips, Technical]
permalink: /integrating-datadog-and-logstash-on-aws-ec2
path: /source/_posts/2014-11-26-integrating-datadog-and-logstash-on-aws-ec2.markdown
---

If you have an application you should collect metrics and data about it to be able to improve your application. There is multiple solutions for collecting stats, but I chose [DataDog][datadog-link] for my application. Below you will find how to integrate DataDog agent on EC2 server using ElasticBeanstalk and how to send Apache logs to DataDog using logstash.

**Note:** The tutorial assumes that you're [deploying a Symfony application using AWS ElasticBeanstalk][deploy-symfony-app-aws-eb-link] (the link points to an article on how to do it). If you're deploying a different application or don't want to use EB, you will need to make some changes (which will be left as an exercise for the reader).

## Add DataDog Config

To install and configure the DataDog agent create `.ebextensions/02-datadog.config` file with following contents:

```yaml
packages:
    yum:
        datadog-agent: []
    rpm:
        datadog: http://yum.datadoghq.com/rpm/x86_64/datadog-agent-5.1.0-539.x86_64.rpm

container_commands:
    100-copy-config:
        command: "source .ebextensions/bin/copy-datadog-config.sh"
    200-restart-agent:
        command: "/etc/init.d/datadog-agent restart"
        test: "[ $SYMFONY__ENV__DATADOG__API__KEY ]"
    250-stop-agent:
        command: "/etc/init.d/datadog-agent stop"
        test: "[ ! $SYMFONY__ENV__DATADOG__API__KEY ]"
```

And `.ebextensions/bin/copy-datadog-config.sh` file:

```bash
#!/bin/bash

sed 's/api_key:.*/api_key: '"$SYMFONY__ENV__DATADOG__API__KEY"'/' /etc/dd-agent/datadog.conf.example > /etc/dd-agent/datadog.conf
```

If you will deploy an application with these configuration files, EB will install DataDog agent and run the configuration script to update the API key. The API key should be set as an environment variable for the hosts you want to measure. When if `SYMFONY__ENV__DATADOG__API__KEY` environment variable is set on the host it will restart the DataDog agent to reload the configuration and give a deployment event in DataDog application. If the environment variable is not set (for example you don't want to track a host anymore) it would stop the agent.

This is enough to start receiving some metrics about your hosts on DataDog application, but more can be done.

## Apache Rewrite For Symfony

Apache has a `server-status` handler which provides some statistics about current server status. The Symfony application configuration blocks this route, add the following condition in your `.htaccess` or Apache configuration file (will depend on your project) before queries are rewritten to front controller:

```apache
# Allow internal requests
RewriteCond %{REQUEST_URI} !^/internal/.+$
```

This will allow requests to `/internal` URLS (in case you need to add more locations reachable by URL).

## DataDog Apache Integration

To send server statistics first create internal server status location in your Apache configuration:

```apache
# Enable server-status for internal IP
<Location /internal/server-status>
   SetHandler server-status
   Order Deny,Allow
   Deny from all
   Allow from 127.0.0.1
</Location>
```

This will allow to get server statistics locally (when connected to a host or from the host).

Next update `.ebextensions/02-datadog.config` file and add:

```yaml
files:
    /etc/dd-agent/conf.d/apache.yaml:
        mode: "000644"
        owner: dd-agent
        group: root
        content: |
            init_config:

            instances:
                -   apache_status_url: http://127.0.0.1/internal/server-status?auto
```

This will create Apache configuration file for DataDog agent pointing it to an URL where it can get server statistics. After deployment you should start receiving metrics about your current server status.

## Install & logstash

[logstash][logstash-link] is a tool for managing events and logs.

To install logstash (optional: contrib plugin is installed only once, if you don't use it you can remove the `200-install-contrib-plugin` command) on deployment create `.ebextensions/02-logstash.config` file with following contents:

```yaml
files:
    /etc/yum.repos.d/logstash.repo:
        mode: "000644"
        owner: root
        group: root
        content: |
            [logstash-1.4]
            name=logstash repository for 1.4.x packages
            baseurl=http://packages.elasticsearch.org/logstash/1.4/centos
            gpgcheck=1
            gpgkey=http://packages.elasticsearch.org/GPG-KEY-elasticsearch
            enabled=1

commands:
    100-install-logstash:
        command: "yum -y install logstash-1.4.2"
    200-install-contrib-plugin:
        command: "wget -O /tmp/logstash-contrib-1.4.2.tar.gz http://download.elasticsearch.org/logstash/logstash/logstash-contrib-1.4.2.tar.gz && tar zxf /tmp/logstash-contrib-1.4.2.tar.gz -C /opt/logstash --strip 1 && touch /tmp/logstash-contrib-installed"
        test: "[ ! -f /tmp/logstash-contrib-installed ]"
```

## Parse Apache Logs

To start parsing Apache logs the logstash first has to be configured. Add the contents bellow to `.ebextensions/02-logstash.config` file. You will notice what command `300-restart-service` is commented out, why will be explained shortly.

```yaml
container_commands:
    100-delete-configs:
        command: "rm -f /etc/logstash/conf.d/*"
    200-copy-configs:
        command: "cp .ebextensions/logstash/* /etc/logstash/conf.d/"
    # 300-restart-service:
    #     command: "service logstash restart"
```

Add the following to Apache configuration to have more information in Apache logs:

```apache
<IfModule log_config_module>
    LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\" %D %T" combined
</IfModule>
```

Create logstash configuration for parsing Apache logs in `.ebextensions/logstash/apache.conf`:

```
input {
  file {
    exclude => "*.gz"
    path => "/var/log/httpd/*"
    type => "apache-access"
  }
}

filter {
  grok {
    match => ["message", "%{COMBINEDAPACHELOG} %{NUMBER:microseconds} %{NUMBER:seconds}"]
  }
}

output {
  statsd {
    count => ["apache.count.bytes", "%{bytes}"]
    increment => "apache.count.response.%{response}"
    increment => "apache.count.request.%{request}"
    timing => ["apache.timing.request.%{request}", "%{microseconds}"]
  }

  if [response] =~ /^2\d\d/ {
    statsd { increment => "apache.count.response.2XX" }
  } else if [response] =~ /^3\d\d/ {
    statsd { increment => "apache.count.response.3XX" }
  } else if [response] =~ /^4\d\d/ {
    statsd { increment => "apache.count.response.4XX" }
  } else if [response] =~ /^5\d\d/ {
    statsd { increment => "apache.count.response.5XX" }
  }
}
```

This will process apache logs and will send metrics using statsd output. Make changes to track what you need.

{% img https://googledrive.com/host/0B3f3EKRXYPx4dUxwcTdSUk0tU0U/content/images/datadog-http-response-chart.png '' 'Chart of HTTP status responses' %}

As a use case one of tracked metrics with this configuration is HTTP status responses by type. You can create a graph helping you visualize for spikes of 4xx responses (e.g., a bug was introduced in latest deployment or hackers are scanning for vulnerabilities).

Unfortunately I wasn't able to make any of logstash service scripts to work (this is why restart command was commented out). With all the scripts the logstash service is started fine, but no metrics are being output. If you have any suggestions please share. For now I'm using the following way to run logstash.

Create the `.ebextensions/01-pre.config` file with following contents:

```yaml
commands:
    100-create-posthook-dir:
        command: "mkdir /opt/elasticbeanstalk/hooks/appdeploy/post"
        test: "[ ! -d /opt/elasticbeanstalk/hooks/appdeploy/post ]"
container_commands:
    100-chmod-posthooks:
        command: "chmod +x .ebextensions/hooks/appdeploy/post/*"
    200-copy-posthooks:
        command: "cp .ebextensions/hooks/appdeploy/post/* /opt/elasticbeanstalk/hooks/appdeploy/post/"
```

This will create a post hooks directory for ElasticBeanstalk and copy the post hooks to it. Create the `.ebextensions/hooks/appdeploy/post/logstash-background-job.sh` script which will start logstash after deployment:

```bash
#!/bin/bash

. /opt/elasticbeanstalk/support/envvars

for pid in `ps aux | grep /etc/logstash/conf.d | grep -v grep | tr -s ' ' | cut -d ' ' -f 2`
do
    disown $pid
    kill -9 $pid
done

export HOME=/var/lib/logstash

/opt/logstash/bin/logstash \
    -f /etc/logstash/conf.d \
    -l /var/log/logstash/logstash.log \
    > /var/log/logstash/logstash.stdout \
    2> /var/log/logstash/logstash.err \
    &
```

This script will first kill all the running logstash processes (you should have only one, otherwise your metrics would be sent multiple times) and then start a new logstash process. After deployment you should start receiving metrics from processed Apache logs.

## Conclusion

You should be receiving a lot of different metrics in your DataDog account and it's easy to extend to receive even more. This will allow you to measure how your application is performing and make important business decisions.

All files can be found in the [gist][gist-link], the first line displays the full path for it and should be removed from files.

What about you: are you tracking how your application is performing? Or maybe you have suggestions? Please share them in comments.

[datadog-link]: http://www.datadoghq.com/
[deploy-symfony-app-aws-eb-link]: /how-to-deploy-symfony-application-to-aws-elasticbeanstalk
[logstash-link]: http://logstash.net/
[gist-link]: https://gist.github.com/ifdattic/61a5b2708dff8811e7e2
