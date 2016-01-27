---
layout: post
title: "Top 11 AWS IAM Best Practices"
date: 2016-01-27 15:37:51 +0200
comments: true
categories: [Technical, AWS]
permalink: /top-11-aws-iam-best-practices
path: /source/_posts/2016-01-27-top-11-aws-iam-best-practices.markdown
---

AWS Identity and Access Management (IAM) enables you to control access to AWS services and resources. Following few best practices makes sure that your account is secure and easy to manage.

## 1. Users - Create individual users

Benefits of the practice are:

* Unique credentials
* Individual credential rotation
* Individual permissions

## 2. Groups - Manage permissions with groups

Benefits of the practice are:

* Easier to assign the same permissions to multiple users
* Simpler to re-assign permissions based on change in responsibilities
* Only one change to update permissions for multiple users

## 3. Permissions - Grant least privilege

Benefits of the practice are:

* More granular control
* Less chance of people making mistakes
* Easier to relax than to tighten up

## 4. Auditing - Enable AWS CloudTrail to get logs of API calls

Benefits of the practice are:

* Visibility into your user activity by recording AWS API calls to an Amazon S3 bucket

## 5. Passwords - Configure a strong password policy

Benefits of the practice are:

* Ensures your users and your data are protected

## 6. MFA - Enable MFA for privileged users

Benefits of the practice are:

* Supplements username and password to require a one-time code during authentication

## 7. Roles - Use IAM roles for EC2 instances

Benefits of the practice are:

* Easy to manage access keys on EC2 instances
* Automatic key rotation
* Assign least privilege to the application
* AWS SDKs fully integrated

## 8. Sharing - Use IAM roles to share access

Benefits of the practice are:

* No need for security credentials
* Easy to break sharing relationship
* Use cases (cross-account access, intra-account delegation, federation)

## 9. Rotation - Rotate security credentials regularly

Benefits of the practice are:

* Normal best practice

## 10. Conditions - Restrict privileged access further with conditions

Benefits of the practice are:

* Additional granularity when defining permissions
* Can be enabled for any AWS service API
* Minimizes accidentally performing privileged actions

## 11. Root - Reduce/remove use of root

Benefits of the practice are:

* Reduce potential for misuse of credentials

You can get all of them as a check list at this [public Trello card](https://trello.com/c/9cW2qarm/2-top-11-aws-iam-best-practices).

This is the reference post from the [https://www.youtube.com/watch?v=tTJrbsu_Wzc](https://www.youtube.com/watch?v=tTJrbsu_Wzc) and [https://www.youtube.com/watch?v=ZhvXW-ILyPs](https://www.youtube.com/watch?v=ZhvXW-ILyPs) videos.
