---
layout: post
title: "Symfony Events: Require Account Information After Registration"
date: 2014-12-03 09:04:45 +0100
comments: true
categories: [Symfony, Tips, Technical]
permalink: /symfony-events-require-account-information-after-registration
path: /source/_posts/2014-12-03-symfony-events-require-account-information-after-registration.markdown
---

The user visits your application, clicks "Sign up with Twitter", authorizes the application and he's ready to use your application with his profile data already filled. Unfortunately in this case you won't have a users' email address as Twitter doesn't share it. Or what if you require something else that might not be provided by a different social network. In this case you might want to require your user to fill mandatory information before using the application. And in Symfony it's easy to do using events.

**Note:** the tutorial assumes that your application is using [FOSUserBundle][fosuserbundle-link] for user management.  If you want to add registration/login using social networks, I recommend using [HWIOAuthBundle][hwioauthbundle-link] (not needed for this tutorial). Application assumes what when registering a user he is disabled and he is not enabled until he provides all the required information.

First initialize the `src/Ifdattic/UserBundle/EventListener/AccountInformationListener.php` (change namespaces as required) with following contents:

```php
<?php

namespace Ifdattic\UserBundle\EventListener;

use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\FOSUserEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;

class AccountInformationListener implements EventSubscriberInterface
{
    /**
     * Route to redirect to
     *
     * @var string
     */
    private $redirectRoute;

    /**
     * @param string $redirectRoute Route to redirect to if conditions not met
     */
    public function __construct($redirectRoute)
    {
        $this->redirectRoute = $redirectRoute;
    }

    /**
     * {@inheritDoc}
     */
    public static function getSubscribedEvents()
    {
        return [
            'kernel.controller' => 'onKernelController',
            FOSUserEvents::PROFILE_EDIT_SUCCESS => 'onProfileEdit',
        ];
    }
}
```

The listener is provided a route name when initializing it (via constructor argument) and it subscribes to two events: `kernel.controller` and `FOSUserEvents::PROFILE_EDIT_SUCCESS`.

Add the method which will be executed on `kernel.controller` event:

```php
class AccountInformationListener implements EventSubscriberInterface
{
    // ...
   
    /**
     * If user is not enabled (haven't provided all information) make him to
     * finish it before using the application.
     *
     * @param  FilterControllerEvent $event
     * @return mixed
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        if ($this->redirectRoute === $event->getRequest()->attributes->get('_route')) {
            return;
        }

        $controller = $event->getController();

        if (!is_array($controller) || !method_exists($controller[0], 'get')) {
            return;
        }

        $security = $controller[0]->get('security.context');

        if (!$security->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            return;
        }

        $user = $security->getToken()->getUser();

        if ($user->isEnabled()) {
            return;
        }

        $redirectUrl = $controller[0]->generateUrl($this->redirectRoute);
        $event->setController(function () use ($redirectUrl) {
            return new RedirectResponse($redirectUrl);
        });
    }
}
```

The method first checks what redirect route and controller is provided. Then using `security.context` service make sure the user is authenticated before continuing. If user is authenticated, but he is not enabled a URL is generated and controller is replaced with an anonymous function which returns a redirect response.

Some might be wondering how much of an overhead this will add. Don't worry, it will probably won't even show on your profiler (if threshold is set to >0ms).

It should be possible to enable a user when he provides all the required information. Add a method to execute on profile edit:

```php
class AccountInformationListener implements EventSubscriberInterface
{
    // ...

    /**
     * Enable user after he filled all the required account information.
     *
     * @param  FormEvent $event
     * @return void
     */
    public function onProfileEdit(FormEvent $event)
    {
        $user = $event->getForm()->getData();

        if (false === $user->isEnabled()) {
            $user->setEnabled(true);
        }
    }
}
```

This will return a user after successful form submit (after validation, etc.) and enable him if he was not enabled before. This point is a great place to collect some metrics to help you track activated users, how long it takes to activate, etc. It can be done simply by sending another event (event dispatcher can be returned from current event using `getDispatcher()` method).

To enable the listener add it as a service (`src/Ifdattic/UserBundle/Resources/config/services.yml`):

```yaml
services:
    ifdattic_user.account_information.listener:
        class: Ifdattic\UserBundle\EventListener\AccountInformationListener
        arguments: ["fos_user_profile_edit"]
        tags:
            - { name: kernel.event_subscriber }
```

Now if you visited the application with a user which is not enabled, he should be redirected to a profile edit page. If a new field which is required for using the application is added, you could disable a user to make sure he provides that information before continuing. If you want to send a user to a different page (e.g., profile edit page has a lot of optional fields and you want to display only required fields) just change the first argument for the listener.

This is optional, but to help users understand the next step add some visuals.

```yaml
# in app/Resources/FOSUserBundle/translations/FOSUserBundle.en.yml
profile:
    edit:
        message_for_disabled_user:
            header: Required account information
            message: Please provide the required information before using the application
```

{% raw %}
```jinja
{# in src/Ifdattic/UserBundle/Resources/views/Profile/_disabled_user_message.html.twig #}
{% trans_default_domain 'FOSUserBundle' %}

{% if app.user.isEnabled == false %}
    <div>
        <h3>{{ 'profile.edit.message_for_disabled_user.header'|trans }}</h3>
        <p>{{ 'profile.edit.message_for_disabled_user.message'|trans }}</p>
    </div>
{% endif %}
```
{% endraw %}

{% raw %}
```jinja
{# in src/Ifdattic/UserBundle/Resources/views/Profile/edit_content.html.twig #}
{% include "IfdatticUserBundle:Profile:_disabled_user_message.html.twig" %}
```
{% endraw %}

Requiring account information was very easy to implement with a simple listener and now it can be extended by adding more logic and actions to it.

Source files are available as a [gist][gist-link].

Do you have any suggestions, ideas, questions? Please share them.

[fosuserbundle-link]: https://github.com/FriendsOfSymfony/FOSUserBundle
[hwioauthbundle-link]: https://github.com/hwi/HWIOAuthBundle
[gist-link]: https://gist.github.com/ifdattic/21a0575dc4878633430e
