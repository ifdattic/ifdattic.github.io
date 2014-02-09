---
layout: post
title: "Using same native bookmarks between Firefox profiles"
date: 2011-10-19 18:32:33 +0200
comments: true
categories: [Bookmarks, Firefox, Hack, Tutorials]
permalink: /using-same-native-bookmarks-between-firefox-profiles
path: /source/_posts/2011-10-19-using-same-native-bookmarks-between-firefox-profiles.markdown
redirects:
    - 2011/10/19/using-same-native-bookmarks-between-firefox-profiles
    - blog/1-using-same-native-bookmarks-between-firefox-profiles
---

Firefox profiles are a great way to keep your personal and work habits separate. For example to save yourself from procrastinating you can log in to Facebook only on your personal profile, or you can save yourself from clutter and performance problems by keeping your work extensions on your work profile. However, one thing I wanted to keep between profiles were bookmarks, as few bookmarks are used on both profiles. Or I find a bookmark while I’m on personal profile and I would like to check it then I’m in a work mood, and vice versa.

<!-- more -->

## Story which led to this hack

I looked at available extensions for synchronizing bookmarks, but none of them met my standards.

[Firefox Sync][firefox-sync] was my first choice as it was already built-in Firefox browser. At first it looked like a good choice, but after testing it for some time, I run into few problems. The problem was that Firefox Sync wasn’t synchronizing my bookmarks constantly, so after exiting one profile and opening another one, I would be left with old bookmarks and with no idea when it would be updated. Using a sync button didn’t help either. After searching the internet on how to change synchronization interval I found that you can change it in config, but it won’t matter as Firefox Sync would decide by itself when to synchronize, based on its mood. What was the point when I decided it’s not what I’m looking for. Of course after it messed my bookmarks (I don’t know, maybe it was reading my mind, but it’s a great way to learn that you need to back up everything) I decided I won’t be looking into this service anymore.

> We lost (probably) quite a few good bookmarks in the journey.

My next choice was [GMarks][gmarks] extension which uses *Google Bookmarks* for synchronizing bookmarks. As I enjoy using Google services (yes, I know Google is “evil”, and I don’t care) that looked like a good solution as I will be able to sync my bookmarks between profiles and keep them with my Google account just in case. Of course like it happens most of the time, good impressions didn’t last for long. I had to wait for data to move back and forth every time I wanted to search for bookmarks, or just to browse through them. GMarks is completely separate from your Firefox bookmarks, which is probably a good thing. But I don’t like things getting in my way so using a sidebar just wasn’t for me. This is when I decided to add another requirement: extension must use native Firefox bookmarks.

After that I was looking into [Xmarks Sync][xmarks-sync] extension. I heard good things about this service and though this one will be the winner. Third time’s the charm, right? There were some comments suggesting not to use this service as it was bought by [LastPass][lastpass] and you shouldn’t trust them. That made me think for a second, but LastPass already has all my passwords, I might as well give my bookmarks to them. I removed Xmarks Sync after few weeks, mostly because I though it was messing with my browser, but also I knew I won’t be using it as it wasn’t what I was looking for. I’m not saying it’s a bad service, but it’s just not for me, as I don’t care about checking the rankings of the link or any other information about it. Also most of the time it was asking me to wait while it synchronizes my bookmarks when exiting my browser, this was really getting on my nerves (I’m not a very patient person).

## Hacking Firefox bookmarks

At this point it looked like I would have to get my hands dirty and use an axe to fix something that is not broken. If you need help on how to create a profile you can find it on [Firefox help website][firefox-help-website].

The first logical solution was to use symbolic links to share bookmarks between profiles. After digging (you need an axe, a shovel and some duct tape if you want to do some real work) around the Firefox profile folder, I found out that Firefox keeps bookmarks inside `places.sqlite` file. (Make a backup first and I take no responsibility if something bad will happen). So just move this file from your profile folder somewhere else (you can move it to your Dropbox folder to use between different machines) and then delete `places.sqlite` file from your profile folders. You can create symbolic links the easy way or the hard way. The hard way will be using `windows command shell (cmd)`. Open `cmd` and enter `mklink driveletter:\path\to\profile\folder\places.sqlite driveletter:\path\to\moved\file\places.sqlite` and press enter.

I keep my `places.sqlite` file in `D:\Other\Firefox` which also contains profile folders named `ifd-personal-profile` and `ifd-work-profile`, so I will need to run these two commands to create symbolic links:

``` bash Create symbolic places.sqlite link in Windows
mklink d:\other\firefox\ifd-personal-profile\places.sqlite d:\other\firefox\places.sqlite
mklink d:\other\firefox\ifd-work-profile\places.sqlite d:\other\firefox\places.sqlite
```

If you want to go the easy way (which I would suggest in this case) you will need to install [Link Shell Extension][link-shell-extension] which allows you to create symbolic links by dragging the file. Simply drag your `places.sqlite` file on your Firefox profile folder while holding right mouse button and select `Drop Here... -> Symbolic Link` from the menu after you release it.

{% img https://googledrive.com/host/0B3f3EKRXYPx4dUxwcTdSUk0tU0U/content/images/lse-create-places-sqlite-symbolic-link.jpg '' 'Screenshot of creating symbolic link using Link Shell Extension' %}

Of course then your start “fixing” something that isn’t broken, you can’t expect it to work perfectly every time. However, I’m using this trick for about half a year now and haven’t run into too much problems. Just remember to keep backups, at least until you get used to this hack. Actually the only problem I had so far is when `places.sqlite` file gets corrupted. This is very easy to fix. You just need to quit your browser, delete `places.sqlite` and `places.sqlite.corrupt` files from your profile folder and re-create symbolic link again (this is why I suggested the easy way). The corruption is very easy to spot if you are using Bookmarks Toolbar as all your bookmark favicons will disappear. `places.sqlite` might get corrupted when:

* browser doesn’t exit properly
* sometimes after extension updates
* if `browser.bookmarks.autoExportHTML` is enabled
* influenced by mysterious powers.

Using different profiles at the same time might also lead to `places.sqlite` corruption. Also changes to bookmarks won’t be synchronized, so if you add a new bookmark in one profile, it won’t be visible in another profile. You can still use multiple windows of the same profile without any problems.

This hack doesn’t work very well on Linux (tested on Ubuntu 11.04). Temporary bookmark files doesn’t get removed after closing Firefox which leads to corrupted or un-synchronized `places.sqlite` file. You can still give it a shot, maybe you will have more luck than I did.

Just remember to make backups (just in case) and watch for bookmarks file corruption (re-create symbolic links then this happens). This looks like a lot of work, but if you want to use same native bookmarks between different profiles it works quite well.

[firefox-sync]: https://services.mozilla.com
[gmarks]: https://addons.mozilla.org/en-US/firefox/addon/gmarks
[xmarks-sync]: https://addons.mozilla.org/en-US/firefox/addon/xmarks-sync
[lastpass]: http://lastpass.com
[firefox-help-website]: http://support.mozilla.com/en-US/kb/Managing-profiles
[link-shell-extension]: http://schinagl.priv.at/nt/hardlinkshellext/hardlinkshellext.html
