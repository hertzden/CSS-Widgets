import PageTitle from 'components/PageTitle'
import { PageBody, Wrapper } from 'components/styles'
import { graphql } from 'gatsby'
import React, { useState } from 'react'

export default function AboutPage() {

  return (
    <>
      <Wrapper>
      <PageTitle>
        <h1>About</h1>
      </PageTitle>
      <PageBody >
        <p>About data</p>
      </PageBody>
      </Wrapper>
    </>
  )
}
