import PageTitle from 'components/PageTitle'
import { PageBody, Wrapper } from 'components/styles'
import { graphql } from 'gatsby'
import React, { useState } from 'react'

export default function GuidePage() {

  return (
    <>
      <Wrapper>
      <PageTitle>
        <h1>Guide</h1>
      </PageTitle>
      <PageBody >
        <p>Guide data</p>
      </PageBody>
      </Wrapper>
    </>
  )
}
