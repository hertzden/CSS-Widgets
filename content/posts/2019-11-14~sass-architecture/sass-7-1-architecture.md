---
title: SASS 7-1 Architecture
slug: /sass-7-1-architecture
date: 2019-11-14
cover:
  img: sass.svg
tags:
  - SASS
  - CSS Architecture
showToc: true
---

When it comes to maintaining CSS at large scale project it quickly get messy when modular approach is not followed. As project grows it becomes quite important to keep files and folders organized.

Well to make things easy for us, **<a href="https://sass-guidelin.es/#the-7-1-pattern">Kitty Giraudel's</a> '7-1 pattern'** guidelines comes to rescue. That comprehensive guide covers each and every aspect, but here i will share some very useful and hands-on tips.

Though it is popularly known as 7-1, based on your project structure it could be 5-1/6-1 or even 8-1.

## Default File Structure

* abstracts/
* base/
* components/
* layouts/
* pages/
* themes/
* vendors/

## 5-1/6-1 Pattern

So this is how sass/scss files are organized, but based on your project requirement you may not need themes and vendors folders all the time. When both of these are not required it will be referred as 5-1, and if either of one is not required it will be referred as 6-1.

### Usage of Vendors

Say you don't want to use any third party library and focused on writing each and every components and utility at your own or may be there is no need, then you can escape vendors folder.


### Usage of Themes

Similarly themes can be escaped if your project is not multi tenant or your project don't have role based interface like customer help portal/admin portal. Generally it is more useful in case SAAS based products where brands have option to select or create their own theme or you want to give end user an option to choose your own theme then you want to overwrite few styles and images/icons and place it in themes folder.


## 8-1 Pattern

This is an extension pattern, where you want to modify any third party library as per you application design, you want to keep core features of it and looking to extend it or modify few keys properties. Then the best way is to create **vendors-extensions** folder where you will override third party components and utility.

> **Note:** It is very important to ``@import vendors-extensions`` folder exactly after vendors folder, in this way custom styles which you want to overwrite will work, placing it above will not work.

## Conclusion

And that's it! You got to know how you can organize your SASS/SCSS files in a modular way based on your project requirement. This way it will improve code readability and enhance overall developer experience.
