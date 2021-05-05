---
title: CSS Grid and Accessibility
slug: /css-grid-accessibility
date: 2019-11-04
cover:
  img: css-grid.svg
  source: Vecteezy
  url: https://vecteezy.com/vector-art/277024-abstract-wave-background
tags:
  - CSS Grid
  - Accessibility
showToc: true
---

Introduction of CSS Grid Layout is the best addition in modern css, it help us build more complex layout designs using a two-dimensional way, using both rows and columns.

While it solves complex layout design and opens new path for implementing any sort of design layouts across devices (laptop, large desktop, tablet, phone, phablet etc...). But at the same time incorrect implementation leads to accessibility issues for keyboard users and screen readers. Let's dive straight into it.

## Visual vs. Logical Reordering

While CSS Grid enables reordering of content in various ways, but it should only be used for visual, not logical reordering of content. Here is an example of simple grid consist of 2 rows and 3 columns, both have common markup but different output based on styling:

* First one is correct order of grid
* While second is tweaked with grid-row property

> These columns have link, so visually user will see **4th link in 1st row**, but screen readers and keyboard user will encounter problem, as tabbing will jump to **3rd link in 2nd row** then back to **4th link on 1st row**.

### Solution

Well solution is simple and elegant, just move 4th link in markup after 2nd and it will not be an issue any more. Below you can see code in action as well:

https://codesandbox.io/s/css-grid-ck85m?view=split?codemirror=1

## Flat markup vs. Semantic markup

Well CSS Grid solves lot of problems, but one should be extra careful while writing markup. To create a grid all items should be direct child of container, any items which are not direct child will not inherit `display: grid` property.

So what happens next is, when some developer wants to create grid structure there may need arise to flatten out markup for whatever reason but it will break semantic meaning of layout and leads to accessibility issues. Let's take a classic example of **header** layout consist of **logo and navigation** links.

Below are the sample code of flatten markup and semantic markup

``` HTML:title=Flatten-Markup
  <header class="grid-container">
    <a href="#" class="logo">
      <img src="https://logoipsum.com/logo/logo-10.svg">
    </a>
    <a href="#" class="nav-link">Home</a>
    <a href="#" class="nav-link">About</a>
    <a href="#" class="nav-link">Services</a>
    <a href="#" class="nav-link">Contact</a>
  </header>
```

``` HTML:title=Semantic-Markup
  <header class="grid-container grid-container-semantic
  grid-container--three">
    <a href="#" class="logo">
      <img src="https://logoipsum.com/logo/logo-10.svg">
    </a>
    <nav class="top-nav top-nav--semantic">
      <ul>
        <li><a href="#" class="nav-link">Home</a></li>
        <li><a href="#" class="nav-link">About</a></li>
        <li><a href="#" class="nav-link">Services</a></li>
        <li><a href="#" class="nav-link">Contact</a></li>
      </ul>
    </nav>
  </header>
```

From both markup same output can be achieved, but it will cause huge inconvenience to screen reader users, as there is no way they come to know about navigation, while they will be able to traverse all links but with incomplete information.

To showcase same, you can look it into action in below codesandbox:

https://codesandbox.io/s/css-grid-faltten-19s7d

> So, note to self always use semantic markup over flatten markup, though later one saves your time or say it will double your work, once you think of accessibility and decides to re-write it.
