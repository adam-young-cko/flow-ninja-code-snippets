import styled, { keyframes } from "styled-components";
import { Col, Heading1, Heading2, Section, Text1 } from "@/layouts/GeneralStyle.sc";
import { device } from "@/layouts/mq";
import theme from "@/layouts/themeSettings";

const moveDown = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, calc(((208px + 24px) * 5)), 0);
  }
`;

const moveDownOdd = keyframes`
  0% {
    transform: translate3d(0, -116px, 0);
  }
  100% {
    transform: translate3d(0, calc(((208px + 24px) * 5) - 116px ), 0);
  }
`;

export const Background = styled("div")`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  /*! @noflip */
  background-color: ${(props) =>
    props.backgroundColor ? theme.getGradient(props.backgroundColor, props.theme.rtl) : theme.websiteColors.transparent};
`;

export const SectionWrapper = styled(Section)`
  display: flex;
  overflow: hidden;

  ${device.toLaptop} {
    flex-direction: column;
  }
`;

export const Details = styled(Col)`
  margin: auto;

  ${device.toLaptop} {
    margin-bottom: 56px;
  }

  ${device.toMobileXL} {
    margin-right: 0;
    margin-bottom: 40px;
  }
`;

export const Title = styled(Heading1)`
  font-size: 56px;
  line-height: 64px;

  ${device.toLaptop} {
    font-size: 32px;
    line-height: 40px;
    margin-bottom: 16px;
  }
`;

export const Description = styled(Text1)`
  &:last-child {
    margin-bottom: 0;
  }

  ${device.toLaptop} {
    font-size: 18px;
    line-height: 32px;
    margin-bottom: 24px;
  }
`;

export const Cards = styled(Col)`
  display: flex;
  flex-direction: row;
  margin-left: 28px;
  padding-left: 88px;
  align-items: flex-end;
  height: calc(((208px + 24px) * 4) + 200px);
  overflow: hidden;
  padding-top: 100px;

  ${device.toLaptop} {
    align-items: flex-start;
    margin-left: 0;
    padding-left: 0;
    min-height: auto;
    max-height: fit-content;
    padding-top: 0;
    height: 100%;
  }

  ${device.toMobileXL} {
    flex-direction: column;
    max-height: fit-content;
    margin-left: 0;
    padding-left: 0;
    padding-top: 0;
    height: 100%;
  }
`;

export const Column = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(208px * 10 + 24px * 10);
  overflow: hidden;
  justify-content: flex-end;
  animation: 15s linear ${moveDown} infinite;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;

  &.pause {
    animation: none;
  }

  &:first-child {
    padding-right: 12px;
  }

  &:last-child {
    padding-left: 12px;
  }

  ${device.toLaptop} {
    justify-content: center;
    animation: none;
    height: auto;
    width: 100%;
    &:first-child {
      margin-bottom: 0;
    }

    &:last-child {
      margin-top: 0;
    }
  }

  ${device.toMobileXL} {
    &:first-child {
      padding-right: 0;
    }

    &:last-child {
      padding-left: 0;
    }
  }
`;

export const ColumnOdd = styled(Column)`
  transform: translate3d(0, -116px, 0);
  animation: 15s linear ${moveDownOdd} infinite;

  ${device.toLaptop} {
    animation: none;
  }
`;

export const ColumnSmallerWindowsize = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;

  &:first-child {
    padding-right: 12px;
  }

  &:last-child {
    padding-left: 12px;
  }

  ${device.toLaptop} {
    justify-content: center;
    height: auto;
    width: 100%;
  }

  ${device.toMobileXL} {
    &:first-child {
      padding-right: 0;
    }

    &:last-child {
      padding-left: 0;
      .card {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;

export const Card = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 240px;
  height: 208px;
  overflow: hidden;
  /*! @noflip */
  background: ${(props) => (props.backgroundColor ? theme.websiteColors[props.backgroundColor] : theme.websiteColors.primaryDark)};
  padding: 32px 24px;
  margin-bottom: 24px;
  border-radius: 6px;
  flex-shrink: 0;
  transform: scale(0);
  transition: transform cubic-bezier(0.26, 0.21, 0.32, 1) 0.4s;
  will-change: transform;
  transform: translate3d(0, 0, 0) scale(0);
  transform-style: preserve-3d;

  &.inview {
    transform: translate3d(0, 0, 0) scale(1);
    transition: transform cubic-bezier(0.26, 0.21, 0.32, 1) 0.4s;
  }

  ${device.toLaptop} {
    transition: none;
    transform: none;
    width: 100%;
    height: 180px;
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ${device.toMobileXL} {
    width: 100%;
    max-width: 300px;
    height: 100%;
    max-height: 184px;
    margin-bottom: 16px;

    &:nth-child(${(props) => (props.reverse ? "odd" : "even")}) {
      margin-left: 35px;
    }

    &:nth-child(${(props) => (props.reverse ? "even" : "odd")}) {
      margin-right: 35px;
    }

    &:last-child {
      margin-bottom: 16px;
    }
  }
`;

export const Percentage = styled(Heading2)`
  font-size: 48px;
  font-weight: normal;

  ${device.toMobileXL} {
    font-size: 48px;
    line-height: 48px;
    font-weight: 400;
    margin-bottom: 24px;
  }
`;
