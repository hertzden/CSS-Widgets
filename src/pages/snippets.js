import PageTitle from 'components/PageTitle'
import { PageBody, Wrapper } from 'components/styles'
import { graphql } from 'gatsby'
import React, { useState } from 'react'

export default function SnippetPage() {

  return (
    <>
      <Wrapper>
      <PageTitle>
        <h1>Snippets</h1>
      </PageTitle>
      <PageBody >
        <p>Snippet data</p>
      </PageBody>
      </Wrapper>
    </>
  )
}
