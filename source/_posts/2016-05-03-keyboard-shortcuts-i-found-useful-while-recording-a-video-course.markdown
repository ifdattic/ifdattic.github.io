---
layout: post
title: "Keyboard Shortcuts I Found Useful While Recording a Video Course"
date: 2016-05-03 11:51:43 +0300
comments: true
categories: [Technical, Terminal, Tips]
permalink: /useful-keyboard-shortcuts-recording-video-course
path: /source/_posts/2016-05-03-keyboard-shortcuts-i-found-useful-while-recording-a-video-course.markdown
---

While recording a video course you constantly need to put your environment in the same state and you often repeat the same action. Having a few keyboard shortcuts up your sleeve can make your life a lot easier. Here is some keyboard shortcuts that I found useful while recording the [Web Development with Node.JS and MongoDB](https://www.packtpub.com/web-development/web-development-nodejs-and-mongodb-video) video course.

Please keep in mind that my local environment is OSX, so shortcuts and applications are based for it. Not all shortcuts are set by default (for example I set them myself for Screenflow).

Skip to any of the sections or continue reading:

* [Full screen](#full-screen)
* [Screenshots](#screenshots)
* [Finder](#finder)
* [Chrome](#chrome)
* [Sublime Text](#sublime-text)
* [iTerm](#iterm)
* [Screenflow](#screenflow)
* [Recording resolution](#resolution)
* [Quick display mirroring](#display-mirroring)

<a name="full-screen"></a>
## Full screen

Note that for most of applications `⌃⌘F` will put them in full screen mode.

<a name="screenshots"></a>
## Screenshots

The `⇧⌘3` (*whole screen*) and `⇧⌘4` (*selected area*) was really helpful for taking screenshots. The screenshots were later used inside the scripts, slides, or videos. **Use the mouse** when taking area screenshots for the scripts. If you don't have one, spend a few bucks for a cheap one. It will be much faster and less painful.

<a name="finder"></a>
## Finder

You will probably end managing a lot of files. Finder might not be the best application for managing files, but it's perfectly fine once I learned how to do **copy/paste**. This was a life saver and saved me from using the mouse for file manipulations. 

`⌘C` => Cut

`⌥⌘V` => Paste

It's mostly fine to use the default Finder. Though, depending on your set up you might want to make a few changes.

`⌥⌘P` => Hide path bar

`⌥⌘S` => Hide sidebar

`⌥⌘T` => Hide toolbar

<a name="chrome"></a>
## Chrome

For my most day to day I use FireFox. Chrome is used for additional testing and video watching (plays most videos without needing Flash). I chose Chrome as my default browser for the course for a single reason. *FireFox doesn't have a shortcut to hide bookmarks toolbar*. Just didn't feel like constantly going through menus using a mouse to hide/show it.

`⇧⌘B` => Hide bookmarks bar

While doing another video experiment started to notice how problematic bookmarks toolbar is on FireFox, but found one solution for easy hiding. By using [Menu Bar Search Workflow for Alfred](http://www.packal.org/workflow/menu-bar-search), it's possible to hide/show it using only the keyboard. Still not as easy as using a shortcut.

<a name="sublime-text"></a>
## Sublime Text

If you do other work with the editor while recording, keeping the font size at `16px` is not the best choice (depends on preference / quality of eyes). You will want to constantly change the font size depending on the work you do.

`⌘+` => Increase font size

`⌘-` => Decrease font size

<a name="iterm"></a>
## iTerm

For the course related terminal I had a new window that run a dedicated profile on a few tabs. That way they didn't get in the way, and didn't need any changes (like making font size bigger).

The iTerm has a different shortcut for a full screen (`⌘⏎`).

Sometimes something messed up and the terminal was not recorded. In that case turning full screen off and on fixed the problem. This mostly happened on the next day (after a lot of putting laptop to sleep and similar activities).

Another very useful shortcut was `⌃L` for clearing the terminal window. Unlike `⌘K` (clear buffer) shortcut, this command re-loads the prompt too.

If you want to learn more useful iTerm shortcuts read [iTerm Shortcut Keys](/iterm-shortcut-keys) article.

<a name="screenflow"></a>
## Screenflow

Screenflow is a great application for recording and editing your videos. It takes some time to get used to. After a while you make your own workflow and get good at it.

`⌃⌥⌘R` => Record; for starting new a recording and stopping an existing one

`⌃⌥⌘P` => Pause; for pausing a recording, didn't use often as most of recordings was done in short clips (also very long recording are harder to manage/edit)

`⌃⌥⌘M` => Mark; for adding a marker on the recording. Useful for longer recordings. Comes in handy to mark the places you need to edit (like to cut out a part of it)

`⌥⌘N` => Nest clips; would depend on your chosen workflow. As I chose to do everything in small clips (slides), each of them was made from multiple videos/images/audio, and then nested into a single clip for easier maintenance.

<a name="resolution"></a>
## Recording resolution

When recording your videos you might want to set your screen resolution to `1280x720` or an equivalent of it (e.g., at `2560x1440` for retina display). That way you get a nice HD quality videos without any cropping or similar artifacts (an would guess that exporting is faster).

To change the resolution I used the [Set Resolution Workflow for Alfred](https://github.com/ramiroaraujo/alfred-set-resolution-workflow). Press `⌥SPACE` (my preference for opening Alfred), enter `setresolution ` (using tab key autocomplete it after a few letters), enter `720`, and choose the resolution you want. After finishing switch back.

<a name="display-mirroring"></a>
## Quick display mirroring

I use the external monitor in my daily life. Normally the laptop is in front (for keyboard and touchpad), with mirroring turned on, and laptop brightness all the way down (only single display used). For recording, having two displays is very useful. You can record on one and have all the notes on another.

Normally it would mean going to `System Preferences -> Displays -> Arrangement -> Mirror Displays`. That takes a lot of time and a lot of mouse maneuvering.

Oh, how happy I was then I found you can do this with `⌘F1` (actually it's `⌘BrightnessDown`). This will turn display mirroring on and off.
