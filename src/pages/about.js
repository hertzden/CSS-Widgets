import PageTitle from 'components/PageTitle'
import { PageBody, Wrapper, SinglePageWrapper } from 'components/styles'
import { graphql } from 'gatsby'
import React, { useState } from 'react'

export default function AboutPage() {

  return (
    <>
      <Wrapper>
      <PageTitle>
        <h1>About - CSS Widgets</h1>
      </PageTitle>
      <SinglePageWrapper>
        <p>Hello <span className="">👋</span> reader, welcome to CSS Widgets - A platform focused on basics of <strong>CSS, HTML, Accessibility and JavaScript.</strong> Here you will learn, and grow as a developer/designer irrespective of your experience.</p>
        <p>Here is what you will find on CSS Widgets:</p>

        <ul className="about-list">
        <li>Practical tips to write accessible UI components.</li>
        <li>Basics of html semantics, css methodology, css grid/flex, color contrast, focus management and aria.</li>
        <li>A community of like-minded developers/designers.</li>
        <li>Easy to customize and accessible code snippets.</li>
        <li>Complete “How-To-Guide” of Layouts, CSS Modules, CSS in JS, SASS, Accessibility.</li>
        <li>A bit advance guide and snippets on styling in Gatsby.js and Next.js.</li>
        </ul>
        <h2>Meet the Author</h2>
        <p>Hey, I'm  <strong>Harshit Purwar.</strong> User Experience Engineer working on design systems, jamstack, accessibility, user/dev experience.</p>
      </SinglePageWrapper>
      </Wrapper>
    </>
  )
}
