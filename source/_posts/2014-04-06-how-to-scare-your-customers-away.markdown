---
layout: post
title: "How to Scare Your Customers Away"
date: 2014-04-06 18:38:16 +0300
comments: true
categories: [Mistakes, Tips, Technical]
permalink: /how-to-scare-your-customers-away
path: /source/_posts/2014-04-06-how-to-scare-your-customers-away.markdown
---

A while ago after quitting my job I decided it would be a great time to update all the passwords I use (hey my paranoia can sometimes get paranoid). It's no easy task, but you got to do what you got to do. So one Saturday I sit down armed with a bucket of tea (I'm joking, it was only half a bucket) ready to change credentials for all my accounts. When you do a task like that you begin to notice that a lot of websites have made some choices that can really get on your nerves (personally, your experience might differ). At the end of the day my password manager had a lot less accounts to remember. I started to compile a list of that should be avoided unless you want to risk losing customers (again, this is personal preference). Through the series of articles I will try to provide every item from that list (order is of no particular importance).

## Password max length at 16 characters

I promise if I go back in time a couple of decades, I would even use a password with the value of *"password"* and just throw a number at the end to make it impossible to brute force. But we live now at 201something, I think **"don't limit password length"** should be old news by now (but knowing situation about SQL injection I shouldn't get my hopes up). I'm not saying you can't limit it, but choose some better limit (60 or so). Some people use password managers so they don't even know that is their 40 characters long random password (until you are cursed to type it on your mobile). I might don't pay attention to this if it was in some site on which I created an account for hell knows what reason, but most often you see this in online banks and financial services. I would at least like 20 characters before someone gets the hand on my money. Or worst case scenario, just don't show the error about max length restriction, I will be much happier believing my accounts are secure.

## Send my password to email

You should know the scenario: finding some useful service, creating an account, checking an email for confirmation email. And in one of them finding something similar to: *"Your password is **plain-text-password-you-used**"*. Why? Why would you do this? Not only now I have to delete this email, but also I will have to go to trash and permanently delete it. You start to inconvenience me (your customer) and this is not a good idea. As an added bonus, I start thinking that you're saving passwords as plain text. This also happens when changing your password. And, *(Insert a name of higher entity)* forgive, you send the password I used after submitting *Forgot Password* form.

## Send an email to all customers that they new password is "test"

(facepalm). One more time. (doublefacepalm). If you don't find anything wrong with this one, then... I don't know what.. see no future/salvation for humanity, or something like what... You probably want a story about this one? One summer morning I sit down to check my emails. I take care of them one by one while sipping my enormous cup of tea. Then I reach one with subject similar to "We updated our shop!!!". My professional curiosity rises a bit trying to think about that changes they might have done. So I open it and start reading it. At first it is general text and pleasantries. Until I reach a bottom of email where black on white *"We had to change passwords for all accounts and you can log in to your new account using 'test'"*. **WTF?!!!** *You have just received a critical facepalm, please insert a token to continue.* Programmers are born in WTF moments, they embrace those moments, they take strength from these moments.. But really, WTF??? The chance of only me getting that password is &ndash; impossible, and even then, WTF? So, just like a good puppy... I mean programmer, how about trying to debug that happened.

Business is going well, so you decide to start using something new and more powerfull. All good so far. You import or re-type user accounts from old system to a new system and because you didn't do so bad on your old e-shop you don't know the passwords of your users. Nods of approvement continue. So then you change a password of your account to "test", run a SQL query on all the rows to update them to the same value and then send an email to everyone that their new password is "test". This is where people like me start raising their eyebrow(s) and embracing WTF moments. I think I made my point clear to everyone, but just in case, imagine me making growling sounds for a bit.

## Conclusion

This should be enough for this article in the series. Did you run into any of the described issues? What was your reaction?
