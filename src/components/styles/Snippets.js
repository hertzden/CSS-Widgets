import styled from 'styled-components'
import { mediaQueries } from 'utils/mediaQueries'
import { Sass } from 'styled-icons/fa-brands/'

export const Snippets = styled.div`
  display: grid;
  grid-flow: row;
  align-items: center;
    grid-gap: 10px;
  ${mediaQueries.minTablet} {
    grid-template-columns: 120px 1fr 120px;
    grid-gap: 40px;
  }
  &:not(:last-child) {
    margin-bottom: 40px;
    border-bottom: 2px dashed var(--color-blockquoteBG);
    padding-bottom: 40px;
    ${mediaQueries.minTablet} {


    }
  }
  h2 {
    color: var(--color-postHeading);
    margin: 0.5rem 0;
    line-height: 1;
    font-weight: 400;
  }
  p {
    margin-bottom: 1rem;
    font-size: 1.6rem;
  }
  .large-text {
    font-size: 2rem;
  }
  .snippets__icon {
    /* background: var(--color-boxBackground);
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    box-shadow: rgb(1 1 1 / 5%) 1px 1px 5px 0px;
    a:before {
      background: transparent;
    } */
  }
  .snippets__icon-image {
    color: var(--color-postHeading);
    width: 80px;
    height: 80px;
    z-index: 2;
  }
  .snippets__date {
    font-size: 1.4rem;
    color: var(--color-green);
    display: flex;
    align-items: center;
  }
  .fill-box {
    position: relative;
    background: var(--color-boxBackground);
    box-shadow: rgb(1 1 1 / 5%) 1px 1px 5px 0px;
    height: 12rem;
    width: 12rem;
    outline: 0;
    overflow: hidden;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* &:hover .snippets__icon-image {
      color: #6110f1;
    } */
  }

.fill-box::before {
    content: "";
    height: 100%;
    width: 100%;
    color: #fff;
    font-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
}

.fill-box:hover::after {
    content: "";
    position: absolute;
    bottom: -5%;
    left: -50%;
    z-index: 0;
    height: 200%;
    width: 200%;
    background: linear-gradient(to right, #ece9e6, #ffffff);
    /* linear-gradient(to right, #141e30, #0e141b) */
    border-radius: 35%;
    animation: spin 6s ease-in-out infinite
}

@keyframes spin {
    0% {
        transform: translateY(0) rotate(0deg)
    }

    100% {
        transform: translateY(-100%) rotate(400deg)
    }
}
  .read-more {
    display: inline-flex;
    align-items: center;
    justify-self: flex-end;
    /* background: #077b88; */
    margin: 0;
    max-width: fit-content;
    padding: 2px 12px;
    color: var(--color-button);
    font-weight: 400;
    border: 2px solid var(--color-button);
    border-radius: 15px 0 10px 0;
    font-size: 1.4rem;
    &:hover, &:focus {
      background: rgb(7, 123, 136);
      border-color: rgb(7, 123, 136);
      color: #fff;
    }
    &:before {
      background: transparent;
    }
  }
`
export const LargeText = styled.p`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 40px;
`


;
