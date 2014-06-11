---
layout: post
title: "How to move changes between repositories (git cherry-pick)"
date: 2013-12-29 21:21:07 +0200
comments: true
categories: [Tutorials, Tips, Git]
permalink: /how-to-move-changes-between-repositories-git-cherry-pick
path: /source/_posts/2013-12-29-how-to-move-changes-between-repositories-git-cherry-pick.markdown
redirects:
    - blog/14-how-move-changes-between-repositories-git-cherry-pick
---

I'm currently refactoring a project which has a lot of similar copies with some slight (most often) differences between them. A difference can be from a simple value to a complete feature. Of course the best way would be to move everything to be modular and configurable, but unfortunately in real life this doesn't always happen instantly (you can always dream about it).

<!-- more -->

So to save myself from doing any copy-paste I started playing around with different ideas how to do it using *git* (at least I would be able to play around with a terminal). At first experimentation started using `rebase`, but unfortunately after some bigger changes it began to mess the history. So then I started experimenting with a `cherry-pick` command. This gives me quite a good control of what commits to pick up and keeps the history clean. It just adds a little bit more typing.

If you feel confident in *git*, then check a "[summary][gist-summary-url]" of commands to get the idea.

Otherwise the step by step tutorial is available below (I tried my best to make it, but it can be improved a lot, suggestions are welcome). It doesn't contain any images as I don't think they are needed. Tutorial can be easily typed in the terminal, the only difference will be file system changes depending on operating system you are using.

## Step-by-step tutorial

The set up for a tutorial is simple:

* The **repoone** directory contains **README.md** files with the line *This line will be the same between both repositories*.
* **repoone** directory is a *git* repository.
* The **repotwo** directory is a copy of **repoone**.

Now make a change in **repoone**:

``` bash
echo -e "\n\nThis will be moved from one repository to another\n\n" >> README.md
```

And then commit the changes:

``` bash
git add README.md
git commit -m "Add line about moving"
```

Now add another change which is only for **repoone**:

``` bash
echo "This is only for repoone" > repoone.config
```

And then commit the changes:

``` bash
git add repoone.config
git commit -m "Add repoone configuration"
```

This should start feeling similar. Add one more change and commit it:

``` bash
echo "__*.config__ files contain the configuration values" >> README.md

git add README.md
git commit -m "Add explanation about .config files"
```

For the next part of tutorial move to the second repository by executing: `cd ../repotwo`.

To start moving changes between the repositories first we need to add it as a remote and download objects and refs from it.

**Important:** Note that I'm using *Windows* for the code example so you should escape the `\`. The `D:\\gitcherrybetweenrepos\\repoone` will be different depending on your OS and/or file organization, replace as needed.

``` bash
git remote add repoone D:\\gitcherrybetweenrepos\\repoone
git fetch --progress -prune repoone
```

Now when running the following command (*tip:* add it as an alias to your `.gitconfig`):

``` bash
git log --graph --decorate --pretty=oneline --abbrev-commit --all
```

It will output the following results (*commit id*s might be different on your run, replace as needed):

``` bash
* f761364 (repoone/master) Add explanation about .config files
* 80a8db4 Add repoone configuration
* 2ac430f Add line about moving
* 5745330 (HEAD, master) Initial commit
```

So we want to add **2ac430f** & **f761364** commits to this repository. The `cherry-pick` command can be used for that:

``` bash
git cherry-pick 2ac430f
git cherry-pick f761364
```

[**Optional**] Let's try it with a branch:

``` bash
# go back to the first repository
cd ../repoone

# create a branch
git checkout -b add-branch-example

# add some changes and commits
touch branch-example.md

git add branch-example.md
git commit -m "Initial commit"

echo -e "\n\nThis line only for repoone\n\n" >> README.md
git add README.md
git commit -m "Add repoone specific commit"

date >> branch-example.md
git add branch-example.md
git commit -m "Add current date value"
```

Leave **repoone** here and return to **repotwo** (also at the same time retrieve the data from **repoone**):

``` bash
cd ../repotwo

# check the branches of repoone
git remote show repoone

# imagine we got a lot of stuff going on in the remote repository
# so just get back one branch and no tags
git fetch --progress -n repoone refs/heads/add-branch-example:refs/remotes/repoone/add-branch-example

# check the git log
git log --graph --decorate --pretty=oneline --abbrev-commit --all
* 13b1080 (repoone/add-branch-example) Add current date value
* 94b5a67 Add repoone specific commit
* 240ae14 Initial commit
* f761364 (repoone/master) Add explanation about .config files
* 80a8db4 Add repoone configuration
* 2ac430f Add line about moving
| * 78427ed (HEAD, master) Add explanation about .config files
| * 54bd60b Add line about moving
|/
* 5745330 Initial commit
```

Now get the changes what are needed from the branch and merge it back to the master:

``` bash
git checkout -b add-branch-example

git cherry-pick 240ae14
git cherry-pick 13b1080

git checkout master
git merge --no-ff add-branch-example
```

And because we're done the branch and remote can be removed (cleanup time):

``` bash
git branch -d add-branch-example
git remote rm repoone
```

## Conclusion

You probably won't use this trick in your everyday projects, but it can definitely come in handy in case you will get into similar situation like me (refactoring a lot of copies of similar project).

What tricks you're using for similar situations?

[gist-summary-url]: https://gist.github.com/ifdattic/8174883#file-git-cherry-pick-between-repositories-sh