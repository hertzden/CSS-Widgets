---
title: SASS Architecture
slug: /sass-architecture
date: 2019-11-14
cover:
  img: sass.svg
  source: Vecteezy
  url: https://www.vecteezy.com/vector-art/273771-flat-orange-abstract-vector-background
tags:
  - SASS
  - CSS Architecture
showToc: true
---

When it comes to maintaining CSS at large scale project it quickly get messy when modular approach is not followed. As project grows it becomes quite important to keep files and folders organized.

Even with the help of preprocessor over vanilla CSS, we still need to have a file structure. Thus based on your project size choose a pattern and extend it based on requirements.

## Small Projects

Let's take example of small projects like microsite, campaign site etc... it is easier to divide files in three categories: `_base.scss`, `_components.scss` and `_layouts.scss` and one `main.scss` file where all these files are imported for compilation.

> **Note:** Don't choose flat file structure, even if project is small, always choose modular approach which is easy to extend. So your file structure should be like this:

* base/
* components/
* layouts/


## Large Projects

SASS files structure becomes bloated if modular approach is not followed, so need to organize it in right ways is important. So how will you make it readable and extendable, what pattern to follow these questions arises.

Well to make things easy for us, **<a href="https://sass-guidelin.es/#the-7-1-pattern">Kitty Giraudel's</a> '7-1 pattern'** boilerplate comes to rescue. It is a widely adopted structure and it covers each and every aspect, but here i will share some very useful and hands-on tips.

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

> **Note:** There is no explicit rule that you have to create all 7 folders, based on project requirement and to keep things better organized for your team you can opt this pattern.

### Usage of Vendors

Say you don't want to use any third party library and focused on writing each and every components and utility at your own or may be there is no need, then you can escape vendors folder.


### Usage of Themes

Similarly themes can be escaped if your project is not multi tenant or your project don't have role based interface like customer help portal/admin portal. Generally it is more useful in case SAAS based products where brands have option to select or create their own theme or you want to give end user an option to choose your own theme then you want to overwrite few styles and images/icons and place it in themes folder.


## 8-1 Pattern

This is an extension pattern, where you want to modify any third party library as per you application design, you want to keep core features of it and looking to extend it or modify few keys properties. Then the best way is to create **vendors-extensions** folder where you will override third party components and utility.

> **Note:** It is very important to ``@import vendors-extensions`` folder exactly after vendors folder, in this way custom styles which you want to overwrite will work, placing it above will not work.

## Conclusion

And that's it! You got to know how you can organize your SASS/SCSS files in a modular way based on your project requirement. This way it will improve code readability and enhance overall developer experience.
