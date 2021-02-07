import React from "react"
import { Link } from "gatsby"
import ThemeToggleComponent from '../components/theme'
import Bio from '../components/bio'
import '../scss/app.scss';
import styles from './Aside.module.scss';
import logo from '../images/logo.svg';



const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header
  if (location.pathname === rootPath) {
    header = (
      <h1> {title} </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div className="w-full" style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--textNormal)',
          transition: 'color 0.2s ease-out, background 0.2s ease-out',
        }}>
    <a href="#main" className="skip-main">Skip to main content</a>

    <div className={`md:flex-col flex flex-1  flex-row flex-shrink-0 flex-grow flex-basis w-full items-stretch relative ${styles.wrapper}`}>
    <aside className={`items-end flex flex-col flex-grow flex-shrink-0  z-3 ${styles.header}`}>
    <div className={`flex flex-col flex-shrink-0 items-stretch flex-basis z-0 min-w-0 min-h-0 relative sm:width-100   ${styles.header_block}`}>
        <div className={`flex flex-col flex-shrink-0 aside_block`}>
        <div className={`grid flex-col flex-shrink-0 items-center flex-basis z-0 min-w-0 min-h-0 relative h-full side-border overflow-y-auto ${styles.header_block}`}>
          <div className="px-4 py-4 md:p-2">
          <h1 className="logo"> <a href="/" className="flex items-center mb-4 md:mb-0"><img src={logo} alt="CSS Widgets Logo" width="80" height="80" /> <span className="logo-text">CSS WIDGETS</span></a></h1>
          <div className={`md:hide-mobile`}>
            <Bio />
          </div>
          <ThemeToggleComponent />

          <section id="social" className={`md:hide-mobile`}>
          <h2 className="font-family-2">Get in touch:</h2>
          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/harshitpurwar">
          <svg width="32" height="32" viewBox="0 0 800 800"><path fill="var(--textButton)" d="M679 239s-21 34-55 57c7 156-107 329-314 329-103 0-169-50-169-50s81 17 163-45c-83-5-103-77-103-77s23 6 50-2c-93-23-89-110-89-110s23 14 50 14c-84-65-34-148-34-148s76 107 228 116c-22-121 117-177 188-101 37-6 71-27 71-27s-12 41-49 61c30-2 63-17 63-17z"></path></svg>
          <span className="sr-only">Opens Twitter profile of Harshit Purwar</span>
          </a>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/hertzden"><svg width="32" height="32" viewBox="0 0 800 800"><path fill="var(--textButton)" d="M400 139c144 0 260 116 260 260 0 115-75 213-178 247-9 3-17-2-17-13v-71c0-35-18-48-18-48 57-6 119-28 119-128 0-44-27-70-27-70s14-29-2-69c0 0-22-7-72 27-42-12-88-12-130 0-50-34-72-27-72-27-16 40-2 69-2 69s-27 26-27 70c0 100 62 122 119 128 0 0-14 10-17 35-15 7-53 18-76-22 0 0-13-25-39-27 0 0-26 0-2 16 0 0 17 8 29 38 0 0 16 51 88 35v44c0 11-9 16-18 13-103-34-178-132-178-247 0-144 116-260 260-260z"></path></svg>
          <span className="sr-only">Opens Github profile of Harshit Purwar</span>
          </a>
          </section>
          </div>
        </div>

        </div>

      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 552 471" className={`${styles.dice_one}`}>
      <rect fill="#e0deff" width="316" height="265"></rect><rect fill="#fa9eac" x="236" y="206" width="316" height="265"></rect>
      </svg>



    </aside>
      <main role="main" className="flex flex-col flex-grow flex-shrink relative min-w-0 items-start min-h-0 m-0 p-0 items-start" id="main">
        <div className={`flex flex-col flex-grow flex-shrink relative m-0 p-0 items-stretch  ${styles.main_block}`}>
        <div className={`py-5 md:p-4 ${styles.card_grid}`}>
          {children}
        </div>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1264 795" className={`${styles.dice_two}`}>
        <rect fill="#f86278" x="632" width="316" height="265"></rect>
        <rect fill="#e0deff" x="948" y="264" width="316" height="265"></rect>
        <rect fill="#ffe69b" y="530" width="316" height="265"></rect>
        </svg>
      </main>
      <div className={`lg:hide-desktop p-4 text-center`}>

        <Bio />
        <section id="social">
        <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/harshitpurwar">
        <svg width="32" height="32" viewBox="0 0 800 800"><path fill="#ddd" d="M679 239s-21 34-55 57c7 156-107 329-314 329-103 0-169-50-169-50s81 17 163-45c-83-5-103-77-103-77s23 6 50-2c-93-23-89-110-89-110s23 14 50 14c-84-65-34-148-34-148s76 107 228 116c-22-121 117-177 188-101 37-6 71-27 71-27s-12 41-49 61c30-2 63-17 63-17z"></path></svg>
        <span className="sr-only">Opens Twitter profile of Harshit Purwar</span>
        </a>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/hertzden"><svg width="32" height="32" viewBox="0 0 800 800"><path fill="#ddd" d="M400 139c144 0 260 116 260 260 0 115-75 213-178 247-9 3-17-2-17-13v-71c0-35-18-48-18-48 57-6 119-28 119-128 0-44-27-70-27-70s14-29-2-69c0 0-22-7-72 27-42-12-88-12-130 0-50-34-72-27-72-27-16 40-2 69-2 69s-27 26-27 70c0 100 62 122 119 128 0 0-14 10-17 35-15 7-53 18-76-22 0 0-13-25-39-27 0 0-26 0-2 16 0 0 17 8 29 38 0 0 16 51 88 35v44c0 11-9 16-18 13-103-34-178-132-178-247 0-144 116-260 260-260z"></path></svg>
        <span className="sr-only">Opens Github profile of Harshit Purwar</span>
        </a>
        </section>
      </div>
      </div>

    </div>
  )
}

export default Layout
