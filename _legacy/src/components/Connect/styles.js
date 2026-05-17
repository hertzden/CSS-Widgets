import React from 'react'
import styled from 'styled-components'

export const ConnectBox = styled.div`
  h2 {
    margin: 0 0 3rem 0;
    font-size: 2.4rem;
    font-weight: 600;
    text-transform: uppercase;
    padding-left: 3rem;
    position: relative;
    &::before {
        display: block;
        background-color:#08a4b6;
        content: "";
        border-radius: 9999px;
        position: absolute;
        height: 100%;
        width: 5px;
        top: 0px;
        left: 0px;
    }
  }
`

export const Box = styled.div`
  background: var(--color-boxBackground);
  border-radius: 1rem;
  transition: transform 250ms ease, box-shadow 250ms ease, color 250ms ease;
  box-shadow: 1px 1px 5px 0 rgb(1 1 1 / 5%);
  padding: 2rem;
  display: flex;
  flex-flow: row wrap;
  .about-container {
    margin-bottom: 20px;
    p {
      margin: 0;
      font-size: 1.6rem;
    }
  }
  .social {
    display:flex;
  }
  .icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 50%;
    &:not(:first-child) {
      margin-left: 10px;
    }
    &:before {
      transition: none;
      background: transparent;
    }
    &:hover {
      background: #f86377;
      svg {
        fill: #ffffff;
      }
    }
  }
`
