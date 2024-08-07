'use client';

import React from 'react'
import Link from 'next/link'
import { useStyles } from '../contexts/StyleContext'

function Footer() {
  const { styles, isLoading } = useStyles()

  // Fallback styles
  const fallbackStyles = {
    backgroundColor: 'bg-gray-900',
    textColor: 'text-white',
    logoColor: 'text-white',
    hoverColor: 'text-gray-300'
  }

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  // Use fallback styles if styles is undefined
  const bgColor = styles.backgroundColor || fallbackStyles.backgroundColor
  const textColor = styles.textColor || fallbackStyles.textColor
  const logoColor = styles.logoColor || fallbackStyles.logoColor
  const hoverColor = styles.hoverColor || fallbackStyles.hoverColor

  return (
    <footer style={{ backgroundColor: bgColor, color: textColor }} className="body-font mt-8">
      <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <Link href="/" style={{ color: textColor }} className="flex title-font font-medium items-center md:justify-start justify-center">
            <img src="/photo/door.svg" alt="Door" style={{ color: logoColor }} className="inline-block h-5 w-5 mr-2" />
            <span className="ml-3 text-xl">{styles.logoname || 'DoorDash'}</span>
          </Link>
          <p className="mt-2 text-sm">Air plant banjo lyft occupy retro adaptogen indego</p>
        </div>
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          {['CATEGORIES', 'CATEGORIES', 'CATEGORIES', 'CATEGORIES'].map((category, index) => (
            <div key={index} className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium tracking-widest text-sm mb-3">{category}</h2>
              <nav className="list-none mb-10">
                {['First Link', 'Second Link', 'Third Link', 'Fourth Link'].map((link, linkIndex) => (
                  <li key={linkIndex}>
                  <Link href="#" className={`${textColor} hover:${hoverColor}`}>{link}</Link>
                </li>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
      <div style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-sm text-center sm:text-left">© 2020 Tailblocks —
            <Link href="https://twitter.com/knyttneve" rel="noopener noreferrer" style={{ color: textColor }} className={`hover:${hoverColor}`} target="_blank">@knyttneve</Link>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            {[
              { href: "https://facebook.com", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
              { href: "https://twitter.com", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
              { href: "https://instagram.com", viewBox: "0 0 24 24", fill: "none", d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 19.5h.01" },
              { href: "https://linkedin.com", viewBox: "0 0 24 24", d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" }
            ].map((social, index) => (
              <Link key={index} style={{ color: textColor }} className={index > 0 ? "ml-3" : ""} href={social.href}>
                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox={social.viewBox || "0 0 24 24"}>
                  <path d={social.d}></path>
                  {social.viewBox && <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>}
                  {social.fill === "none" && <path d={social.d}></path>}
                  {social.href === "https://linkedin.com" && <circle cx="4" cy="4" r="2" stroke="none"></circle>}
                </svg>
              </Link>
            ))}
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer