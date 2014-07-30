---
layout: post
title: "Review of SQL Performance Explained book"
date: 2014-07-30 09:36:33 +0300
comments: true
categories: [SQL, Review, Books]
permalink: /review-of-sql-performance-explained-book
path: /source/_posts/2014-07-30-review-of-sql-performance-explained-book.markdown
---

This is the review of **SQL Performance Explained** book by **[Markus Winand][markus-winand-homepage]**. The book explains everything developers need to know about the SQL performance. And the only thing that developers need to learn is how to index [(comic strip explaining it)][commit-strip-link].

<!-- more -->

Below is the list of the chapters in a book:

1. **Anatomy of an Index** doesn't cover SQL specifically, but it explains the fundamental structure of an index.
2. **The Where Clause** explains all aspects of the `where` clause. This is the biggest chapter in the book and after learning the techniques provided, you will be able to write much faster SQL.
3. **Performance and Scalability** is about performance measurements and database scalability. It will explain why adding hardware is not the best solution to slow queries.
4. **The Join Operation** gives explanation about how to use indexes to perform a fast table join.
5. **Clustering Data** explains how to get best performance when selecting only part of columns.
6. **Sorting and Grouping** is about how to use indexes with `order by` and `group by`.
7. **Partial Results** explains how to benefit from a "pipelined" execution if you don't need the full result set.
8. **Insert, Delete and Update** deals with performance when executing write queries.

The book is very well written so once you start reading it it's not so easy to put it down. The examples are for Oracle database, but it also covers all other databases (MySQL, MSSQL, PostgreSQL) so any differences or things to know won't be left out for database you're using.

I had this book for a while, but constantly prioritized something else. I was really glad I finally read it and wish I did it earlier. I don't think I'm a novice when it comes to SQL (at least I knew about SQL injections, indexes, etc.), but reading this book really expanded my knowledge about improving my SQL. If you're working with relational databases I would suggest to read this book sooner than later. Other examples are provided in different languages (PHP, Java, etc.), so you won't be left in the dark thinking where to start.

You can buy this book from [SQL Performance Explained website][buy-sql-performance] or paperback from [Amazon][buy-sql-performance-amazon].

[buy-sql-performance]: http://sql-performance-explained.com/
[buy-sql-performance-amazon]: http://www.amazon.com/Performance-Explained-Everything-Developers-about/dp/3950307826
[markus-winand-homepage]: http://use-the-index-luke.com/about
[commit-strip-link]: http://www.commitstrip.com/en/2014/06/03/the-problem-is-not-the-tool-itself/
