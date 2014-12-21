---
layout: post
title: "How to set up encrypted backup with duplicity"
date: 2014-06-11 09:11:39 +0300
comments: true
categories: [Backup, Security, Tutorials]
permalink: /howto-encrypted-backup-with-duplicity
path: /source/_posts/2014-06-11-how-to-set-up-encrypted-backup-with-duplicity.markdown
---

In the last half year or so, I started moving to the point where for example getting my laptop stolen (or I noticed a lot of people like installing liquids on their laptops) would be just a loss of money and a few hours. Rather than a complete disaster which might take a few days to recover. The first step of course was cleaning up my hard drive from all the personal photos, videos and a bunch of other stuff you constantly keep, but never really use. The great step to automating everything was using [dotfiles][ifdattic-dotfiles] (or you can check original project [mathiasbynens/dotfiles][mathiasbynens-dotfiles]). Not only it allows to automate how my machine behaves, but if I will have to set up a different one I won't miss some step for setting it up. Mostly what was left to do, was keeping some files available for any device. *Google Drive* was working great for it at first, but unfortunately the files in the drive isn't encrypted. It's fine for simple un-important files, but once you start adding more important files you start wanting a bit more security. This let to searching for a solution which will back up and encrypt my files and [duplicity][duplicity-home] looked promising.

## Prerequisites

After reading documentation about how to use it I was getting my data encrypted and synced. Of course being a programmer I wanted to write some script to automate some of the things. It was quite fun to hack and experiment with something I haven't tried before, but fortunately found an already mature project which automates usage of duplicity. For those interested (or for myself in the future) here is the [initial script][gist-of-expect-script] I was making.

But from this point on we will be using [zertrin/duplicity-backup][zertrin-duplicity-backup] bash script for automating and simplifying the working with duplicity.

Because, I already have it all set up on my OS X everything will be done on the *precise64* (Ubuntu) box using [Vagrant][vagrant-homepage]. If you want to test everything on virtual machine first, just check the Vagrant documentation on how to get started, it's only a couple of steps.

The biggest difference of making duplicity work on different operating systems (OS X, Centos, etc.) would be the installation of required programs.

Our box is missing git and pip so lets install them by running:

```bash
sudo apt-get install -y git
sudo apt-get install -y python-pip
```

To make it simpler at first we will backup to a different HDD location. Run the following commands to create the directories & files to be used for tutorial:

```bash Create directories & files for testing
mkdir directory-to-backup
mkdir directory-to-backup/cache
mkdir directory-holding-backup

# Create some files to be used for backup
touch directory-to-backup/cache/20140601 directory-to-backup/cache/20140602 directory-to-backup/cache/20140603
touch directory-to-backup/20140601 directory-to-backup/20140602 directory-to-backup/20140603 directory-to-backup/20140604 directory-to-backup/20140605
```

You should have the following structure for your backup directory:

```bash Structure of backup directory
directory-to-backup/
|-- 20140601
|-- 20140602
|-- 20140603
|-- 20140604
|-- 20140605
`-- cache
    |-- 20140601
    |-- 20140602
    `-- 20140603
```

## Generate GPG keys for encryption

To encrypt the backup you will need two (for increased security) GPG keys which will be used by duplicity. As the passphrase will be used in clear text, try to avoid re-using your personal passphrase. For this tutorial we will be using the following passphrases (for *production* use your own and keep them in the secure place): *I34Bs$YXvn@* (for signing key) and *P$ts&#@qgD* (for encryption key).

Our Vagrant box has GPG installed, but if it's missing from your OS please install it first. If you're running this on the Vagrant you might need to give some work for your OS to generate random bytes. It can be done with the following commands:

```bash Only for Vagrant box: random byte generation
# Install the program
sudo apt-get install -y rng-tools

# Run it
sudo rngd -r /dev/urandom

# After finishing to generate keys, kill it
sudo service rng-tools stop
```

### Generate signing key

Generate the signing key with:

```bash
gpg --gen-key
```

And answer the prompts (just press enter if you want to use the default value):

```bash Answer prompts with following for signing key generation
Your selection?: (1) RSA and RSA (default)
What keysize do you want?: 2048
Key is valid for?: 0 = key does not expire
Is this correct?: y
Real name: duplicitysign
Email address: duplicitysign@example.com
Comment:
Change ... (O)kay/(Q)uit?: O
Enter passphrase: I34Bs$YXvn@
Repeat passphrase: I34Bs$YXvn@
```

If everything was done correctly you should have the signing key.

### Generate encryption key

Do this again for generating the encryption key:

```bash Answer prompts with following for encryption key generation
gpg --gen-key

Your selection?: (1) RSA and RSA (default)
What keysize do you want?: 2048
Key is valid for?: 0 = key does not expire
Is this correct?: y
Real name: duplicityencrypt
Email address: duplicityencrypt@example.com
Comment:
Change ... (O)kay/(Q)uit?: O
Enter passphrase: P$ts&#@qgD
Repeat passphrase: P$ts&#@qgD
```

### List and export GPG keys

At this point you should have your signing & encryption keys. You can check your keys with the following command (this includes the output which might differ for you):

```bash List GPG keys
gpg --list-keys

/home/vagrant/.gnupg/pubring.gpg
--------------------------------
pub   2048R/841BFBA2 2014-06-10
uid                  duplicitysign <duplicitysign@example.com>
sub   2048R/B5C9CA2B 2014-06-10

pub   2048R/F953BE5A 2014-06-10
uid                  duplicityencrypt <duplicityencrypt@example.com>
sub   2048R/BE767308 2014-06-10
```

Export the public keys and save them in the secure place:

```bash Export public keys
# gpg --armor --export -a [gpg key id] > [name]public.key
gpg --armor --export -a 841BFBA2 > duplicitysignpublic.key
gpg --armor --export -a F953BE5A > duplicityencryptpublic.key
```

Export the private keys and save them in the secure place:

```bash Export private keys
# gpg --armor --export-secret-keys -a [gpg key id] > [name]private.key
gpg --armor --export-secret-keys -a 841BFBA2 > duplicitysignprivate.key
gpg --armor --export-secret-keys -a F953BE5A > duplicityencryptprivate.key
```

### Sign encryption key

To sign your encryption key run the following:

```bash Answer the prompts to sing your encryption key
gpg --sign-key duplicityencrypt


Are you sure that you want to sign this key with your
key "duplicitysign <duplicitysign@example.com>" (841BFBA2)

Really sign? (y/N) y

Enter passphrase: I34Bs$YXvn@
```

## Install duplicity

First you will need to install duplicity:

```bash
sudo apt-get install -y duplicity
```

And download the wrapper script for managing the duplicity. You could just get the script or download the project using different ways (e.g., wget), but we will use git for it:

```bash
git clone https://github.com/zertrin/duplicity-backup.git
```

## Configure wrapper script (default configuration)

The wrapper script uses a configuration file for running a backup. It allows to fine tune your backup. As you can have multiple configurations (e.g., to backup to different locations) they will be kept in the `duplicity-conf` directory (or use one of your choosing). Run the following commands to initialize your first initial config:

```bash Initialize the backup configuration file
mkdir duplicity-conf
cp ./duplicity-backup/duplicity-backup.conf.example ./duplicity-conf/duplicity-backup.conf
```

The default configuration file has sensible defaults (it has a very descriptive comments if you start wondering that something does), but you need to change a few values to change how the script behaves. Just make sure the file has the following changes inside it (lines wrapped in `#` explains what and why it should have this value):

```bash duplicity-backup.conf should have the following changes
# Your signing key passphrase.
# If your passphrase contains a `$` (dollar sign) make sure you
# escape it with `\`, only need to escape in config
PASSPHRASE="I34Bs\$YXvn@"

# ID of GPG encryption key
GPG_ENC_KEY="F953BE5A"
# ID of GPG signing key
GPG_SIGN_KEY="841BFBA2"

# The starting directory of your backup. You might want to change it
# to something like "/Users" if you're using OS X.
# You might also want to add the directory of the user who will be
# making backups, but it's completely up to you
ROOT="/home/vagrant"

# To make it simpler we just gonna back up to a different directory
# on the same machine.
# Later examples for different locations will be provided and the
# script file has examples for many different locations
DEST="file:///home/vagrant/directory-holding-backup/"

# Currently we only want to backup one directory, you can expand
# this list or even use a text file
INCLIST=( "/home/vagrant/directory-to-backup/" )

# We don't want to backup OS X automatically generated files so we
# exclude them.
# We also don't want to backup contents of the directory, but we
# want to backup the directory itself (as an example)
EXCLIST=( "/**.DS_Store" \
          "/**Icon?" \
          "/**.AppleDouble" \
          "/home/vagrant/directory-to-backup/cache/*" \
        )

# Just change to a directory where you want to keep your logs
LOGDIR="/home/vagrant/logs/duplicity/"

# You could leave it as a default, but I personally add additional
# placeholder to help me differentiate between config files
# (in this case 'main-' was added)
LOG_FILE="duplicity-main-`date +%Y-%m-%d_%H-%M`.txt"

# Change to who will own the log files
LOG_FILE_OWNER="vagrant:vagrant"

# 30 days is long enough to keep the logs, it allows to check
# if everything is running fine, but doesn't spam you with
# lots of files (depending on how often you will run your backup)
REMOVE_LOGS_OLDER_THAN='30'
```

## Backup

Now that everything is ready you can just run your backup using the following command:

```bash Run backup
/home/vagrant/duplicity-backup/duplicity-backup.sh --config /home/vagrant/duplicity-conf/duplicity-backup.conf --backup
```

If you didn't run into any errors you should have the backup of the your whole directory. The directory containing the backup should look something like:

```bash Initial directory structure which contains backup files
directory-holding-backup/
|-- duplicity-full.20140610T045757Z.manifest.gpg
|-- duplicity-full.20140610T045757Z.vol1.difftar.gpg
`-- duplicity-full-signatures.20140610T045757Z.sigtar.gpg
```

### List files in backup

To list the files in your current backup you can run the following command:

```bash List files in backup
/home/vagrant/duplicity-backup/duplicity-backup.sh --config /home/vagrant/duplicity-conf/duplicity-backup.conf --list-current-files
```

Which at the moment (if you're following the tutorial) should give the following output:

```bash List of files in backup (if following example)
Last full backup date: Tue Jun 10 04:57:57 2014
Tue Jun 10 04:53:56 2014 .
Tue Jun 10 04:56:38 2014 directory-to-backup
Tue Jun 10 04:49:32 2014 directory-to-backup/20140601
Tue Jun 10 04:49:32 2014 directory-to-backup/20140602
Tue Jun 10 04:49:32 2014 directory-to-backup/20140603
Tue Jun 10 04:49:32 2014 directory-to-backup/20140604
Tue Jun 10 04:49:32 2014 directory-to-backup/20140605
Tue Jun 10 04:48:46 2014 directory-to-backup/cache
```

### Restore from backup

You can run different commands to restore from your backup.

To restore the entire backup run the following command:

```bash Restore the entire backup
/home/vagrant/duplicity-backup/duplicity-backup.sh --config /home/vagrant/duplicity-conf/duplicity-backup.conf --restore

# /home/vagrant/duplicity-backup/duplicity-backup.sh --config /home/vagrant/duplicity-conf/duplicity-backup.conf --restore /home/vagrant/restoredir
```

This will ask you for a directory where you want to restore your backup (or add it at the end of the command). The script will ask you if you really want to restore (if restore path wasn't provided with command, answer with *yes*) and your encryption key passphrase for decryption.

If everything went successfully your restore directory should look like:

```bash Directory structure of restored backup
restoredir/
`-- directory-to-backup
    |-- 20140601
    |-- 20140602
    |-- 20140603
    |-- 20140604
    |-- 20140605
    `-- cache
```

You can also restore only a file or a directory. To restore a file in the current directory (provide a path at the end of command if you want to restore to a different directory) run the following command:

```bash Restore a file
/home/vagrant/duplicity-backup/duplicity-backup.sh --config /home/vagrant/duplicity-conf/duplicity-backup.conf --restore-file directory-to-backup/20140603 restored-file
```

Which will ask you if you really want to restore and for your encryption key passphrase.

## Backup to Amazon S3

Amazon S3 allows you to store and retrieve any amount of data, at any time, from anywhere on the web. Duplicity allows you to backup to S3. This section will take you through steps how to safely do it.

Because you don't want to have the credentials to your whole AWS account kept in plain text (at least I don't), you need to create an IAM user. If you never did it before here is the [tutorial on how to create an IAM user][iam-create-user-tutorial]. Just name it any way you want (e.g., duplicity-backup) and make note of the generated Access & Secret keys as you will need them soon.

For security reasons you probably don't want this user to have the full control of your AWS account (IAM best practices suggests to give lowest permissions and add only the required permissions) you will want to attach the following policy to the user ([tutorial on how to attach IAM policy][iam-attach-policy-tutorial]).

This policy will only allow a user to work with a bucket used for backups and all the files in it. Also the user requires to have a permission to list all the buckets as otherwise you won't be able to do anything with your backup bucket (don't worry, he won't have any permissions on any other buckets). Just replace `duplicity-backup-article` with the name of the bucket you will be using for backups. Name the policy any way you want (e.g., `fullOnDuplicityBackupBucket`).

```json IAM policy to only allow actions on backup bucket
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "arn:aws:s3:::duplicity-backup-article",
        "arn:aws:s3:::duplicity-backup-article/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListAllMyBuckets",
      "Resource": "arn:aws:s3:::*"
    }
  ]
}
```

Now copy the default configuration file we use for backup:

```bash Create duplicity config file for S3 backup
cp duplicity-conf/duplicity-backup.conf duplicity-conf/duplicity-backup-s3.conf
```

And make the following changes to the newly created config file:

```bash duplicity-backup-s3.conf should have the following changes
# Just enter the values you received then you created duplicity IAM user
AWS_ACCESS_KEY_ID="Enter Access key provided after creating IAM user"
AWS_SECRET_ACCESS_KEY="Enter Secret key provided after creating IAM user"

# Replace the file destination with the following destination
# providing the bucket used for backup
# The folder 's3' in this example can be anything, but I use it
# to tell me which configuration is used
DEST="s3+http://duplicity-backup-article/s3"

# If you live in Europe you might want to add '--s3-european-buckets' option
#STATIC_OPTIONS="--full-if-older-than 14D --s3-use-new-style --s3-european-buckets"

# To help distinguish it between other backup logs
LOG_FILE="duplicity-s3-`date +%Y-%m-%d_%H-%M`.txt"
```

You also need to install [boto][boto-install-page] for this to work. Just use the installation method you're most comfortable with:

```bash Multiple methods for installing boto
sudo apt-get install python-boto

# or

pip install boto

# or

git clone git://github.com/boto/boto.git
cd boto
python setup.py install
```

Run the following command to back up to S3:

```bash Run backup
/home/vagrant/duplicity-backup/duplicity-backup.sh --config /home/vagrant/duplicity-conf/duplicity-backup-s3.conf --backup
```

If you did everything correctly your backup bucket on S3 should contain the encrypted backup.

## Backup to Google Drive

If you have a Google account then you might have some free space in your Google Drive which could be used for keeping your backups.

Start by copying the default configuration file we use for backup:

```bash Create duplicity config file for Google Drive backup
cp duplicity-conf/duplicity-backup.conf duplicity-conf/duplicity-backup-google.conf
```

And make the following changes to the newly created config file:

```bash duplicity-backup-google.conf should have the following changes
# Just replace 'GOOGLEACCOUNT' with your Google email (doesn't matter if
# it's @gmail or Google Apps based)
# You can use any folder(s) you like for keeping your backup
DEST="gdocs://GOOGLEACCOUNT/duplicity-backup/google"

# Enter your Google account password
# If you use 2-step authentication you will need to generate
# an application specific password
FTP_PASSWORD="Enter your Google password"

# To help distinguish it between other backup logs
LOG_FILE="duplicity-google-`date +%Y-%m-%d_%H-%M`.txt"
```

You also need to install [Google Data Python Library][gdata-page] for this to work. Just use the installation method you're most comfortable with, for example:

```bash Install Google Data Python Library
sudo pip install gdata
```

Run the following command to back up to Google Drive:

```bash Run backup
/home/vagrant/duplicity-backup/duplicity-backup.sh --config /home/vagrant/duplicity-conf/duplicity-backup-google.conf --backup
```

Due to API changes, running this on Vagrant virtual machine was throwing an error. To fix it you should update duplicity to the latest version.

The only problem I have with using Google Drive for backup is what the password has no fine tunning for permissions (like you have IAM policies in S3) and I just don't like the idea of keeping a password in plain text which allows full access to my Google account. So I chose to use S3 for backup destination.

If I start disliking S3 for backup destination, I will probably try using Google Drive again. But only this time I will set up a simple file destination to the Google Drive folder on my machine and let the Google Drive application do the syncing. However I haven't tried this yet.

## Run backup automatically with Cron

Even though duplicity helps a lot with encryption and backup, you won't get a lot of use from it if you just gonna forget to run a backup (an believe me sooner or later you will forget to run it). This is why you need to automate your backups (or automate everything you can once you start going a bit crazy).

You can choose how often to run the backup, but currently I'm using *every 15 minutes*. This looks like a great balance between having your files backed up, but not constantly using resources for it.

First you should check if your `crontab` contains any existing values as you wouldn't want to remove them:

```bash Check your crontab list
crontab -l
```

If you will get something like "*no crontab for [username]*" you're good to go. Otherwise just add existing values to your crontab file. First create a file (name doesn't matter but we will name it `crontab.sh`) which will have the following contents:

```bash Contents of crontab.sh file
*/15 * * * * /home/vagrant/duplicity-backup/duplicity-backup.sh --config /home/vagrant/duplicity-conf/duplicity-backup.conf --backup > /dev/null 2>&1

```

Just make sure you have an empty line at the end, as you will get errors otherwise. After you done it just update your crontab by running:

```bash Update crontab jobs
crontab crontab.sh
```

If everything was done correctly you should be getting backups every 15 minutes. You can check logs from time to time to make sure everything is running correctly (I'm just paranoid).

If you're having problems with cron backup, but it's working when you run command manually, you might have the problem with your `PATH` variable. I had this problem when I was setting it up on OS X (it would depend on where you install programs), but on the Vagrant virtual machine it was working fine. The fix to it is to update your `PATH` variable with additional required directories, so for example if you need to add `/home/vagrant/custom/bin` to your `PATH` add the following line (after a first line) to your duplicity configuration file:

```bash Add as a second line to a config file if needed
export PATH="/home/vagrant/custom/bin:$PATH"
```

**Update on 2014-12-21:** After getting paranoid during my trip I did some checking of the logs and learned that duplicity wasn't backing up as supposed due to an existing lock file. I would guess this might happen if you put your laptop to sleep during the back up (or something along those lines).

To fix that, I just added additional command to crontab to remove old files from logs directory (this is where lock file is saved). Modify it to your needs.

```bash Remove old log and lock files
23 15 * * * find /home/vagrant/logs/duplicity -mtime +2 -type f -delete
```

## Extras & Troubleshooting

### Backup duplicity configuration file and GPG keys

You might want to export your duplicity configuration file with GPG keys for safekeeping. duplicity wrapper script allows you to easily do it. Just run the command bellow to export it as an encrypted tarfile in the current directory:

```bash Run to backup GPG keys & configuration file
/home/vagrant/duplicity-backup/duplicity-backup.sh --config /home/vagrant/duplicity-conf/duplicity-backup.conf --backup-script
```

It will show you the information of what will be backed up and ask you if you want to continue. If you answer with *yes* it will ask for a password which will protect the archive (it's not asking for GPG passphrase, just for a different password used to encrypt the archive). If everything went fine it should output something like:

```bash Output of running --backup-script
gpg -d duplicity-backup-2014-06-10.tar.gpg | tar x
```

This is the command you will have to run if you want to decrypt your configuration and GPG keys. You should also probably keep this archive and a password someplace safe, but it's completely up to you.

### OS X open files error

On OS X you might get the error "`Too many open files in system`" after which the backup stops. To take care of it just create an `/etc/launchd.conf` file with contents provided below. You might need to restart your OS. If you want to find more about it read the following [superuser answer][superuser-answer].

```bash Contents of launchd.conf file
limit maxfiles 1000000 1000000
```

### Usage examples

If you want more duplicity wrapper usage examples read the [wrapper project documentation][duplicity-wrapper-usage-examples-link].

## Conclusion

By now you should have automatic encrypted backups running on your OS. You can finally enjoy the cup of tea, and if you will accidentally spill it on your machine, it is no big deal as you have all your data safely tucked away.

Do you have any suggestions on how to automate your machine?

[ifdattic-dotfiles]: https://github.com/ifdattic/dotfiles
[mathiasbynens-dotfiles]: https://github.com/mathiasbynens/dotfiles
[duplicity-home]: http://duplicity.nongnu.org
[gist-of-expect-script]: https://gist.github.com/ifdattic/4200774f6c6531d7aefb
[zertrin-duplicity-backup]: https://github.com/zertrin/duplicity-backup
[vagrant-homepage]: https://www.vagrantup.com
[iam-create-user-tutorial]: http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_SettingUpUser.html
[iam-attach-policy-tutorial]: http://docs.aws.amazon.com/IAM/latest/UserGuide/ManagingPolicies.html
[boto-install-page]: https://github.com/boto/boto#installation
[gdata-page]: https://developers.google.com/gdata/articles/python_client_lib
[superuser-answer]: http://superuser.com/a/443168/298391
[duplicity-wrapper-usage-examples-link]: https://github.com/zertrin/duplicity-backup#usage-examples
