import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import { FooterDiv, FooterWrap, Logo, Title, PoweredBy, Icons } from './styles'
import Rss from '../Rss'
import logo from '../../images/logo.svg'

export default function Footer() {
  const { contentYaml } = useStaticQuery(graphql`
    {
      contentYaml {
        copyright
        poweredBy {
          title
          url
        }
      }
    }
  `)
  const { copyright,  poweredBy } = contentYaml
  return (
    <FooterDiv>
      <FooterWrap>
        <div className="copyright">
          <svg viewBox="0 0 24 24" height="14" width="14" focusable="false" role="img" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 cuLlVI"><title>Copyright icon</title><path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10zm0-18c4.337 0 8 3.663 8 8s-3.663 8-8 8-8-3.663-8-8 3.663-8 8-8z"></path><path d="M12 17c.901 0 2.581-.168 3.707-1.292l-1.414-1.416C13.85 14.735 12.992 15 12 15c-1.626 0-3-1.374-3-3s1.374-3 3-3c.993 0 1.851.265 2.293.707l1.414-1.414C14.582 7.168 12.901 7 12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5z"></path></svg>
          &nbsp;{new Date().getFullYear()}, CSS Widgets - {copyright} &ensp;
        </div>
        {/*<span dangerouslySetInnerHTML={{ __html: sourceNote }} />*/}
        <PoweredBy>
          Powered by &nbsp;
          {poweredBy.map(({ url, title }) => {
            const Icon = Icons[title]
            return (
              <a key={title} href={url} aria-label={title}>
                <Icon size="1.6rem" />
              </a>
            )
          })}
        </PoweredBy>
      </FooterWrap>
    </FooterDiv>
  )
}
