import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { PrismicDefaultPropType, PrismicPropType } from '@/proptypes/prismic';
import { Text5 } from '@/layouts/GeneralStyle.sc';
import theme from '@/layouts/themeSettings';
import Eyebrow from '@/common/Eyebrow';
import getWindowSize from '@/utils/getWindowSize';
import {
  Background,
  SectionWrapper,
  Cards,
  Card,
  Details,
  Percentage,
  Title,
  Column,
  ColumnOdd,
  Description,
  ColumnSmallerWindowsize,
} from './Numbers.sc';

/**
 *
 * exit - current
 * 0 - 4
 * 1 - 0
 * 2 - 1
 * 3 - 2
 * 4 - 3
 * 0 - 1
 */

const ITERATIONS = [
  [9, 8, 7, 6],
  [8, 7, 6, 5],
  [7, 6, 5, 4],
  [6, 5, 4, 3],
  [5, 4, 3, 2],
];

const Numbers = ({
  id,
  content: {
    primary: { background_color, subtitle, dark_mode, numbers_title, description },
    items,
  },
}) => {
  // 4, 9
  const [inViewArray, setInViewArray] = useState(0);
  const [inViewArrayOdd, setInViewArrayOdd] = useState(0);
  const [initialLoopDone, setInitialLoopDone] = useState(0);
  const [isDocumentInView, setIsDocumentInView] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const cardsRef = useRef();
  const columnRef = useRef();
  const columnOddRef = useRef();

  cardsRef.current = [];

  const { width } = getWindowSize();
  const isLargeScreen = width > 1024;

  const timer1 = () => {
    const inViewIndex = inViewArray + 1 === 5 ? 0 : inViewArray + 1;
    setInViewArray(inViewIndex);
    setInitialLoopDone(true);
  };

  const timer2 = () => {
    if (initialLoopDone) {
      const inViewIndex = inViewArray;
      setInViewArrayOdd(inViewIndex);
    }
  };

  const runAnimation = () => {
    if (columnRef.current && columnRef.current.classList.contains('pause')) {
      columnRef.current.classList.remove('pause');
      columnOddRef?.current?.classList?.remove('pause');
    }
  };

  useEffect(() => {
    let t1;
    let t2;
    if (isLargeScreen && isDocumentInView) {
      runAnimation();
      t1 = setTimeout(timer1, 3000);
      t2 = setTimeout(timer2, 1500);
    }
    return () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewArray, isDocumentInView]);

  const onBlur = () => {
    columnRef?.current?.classList?.add('pause');
    columnOddRef?.current?.classList?.add('pause');
    setIsDocumentInView(false);
    setInViewArray(0);
    setInViewArrayOdd(0);
    setInitialLoopDone(false);
  };

  const onFocus = () => {
    timer1();
    setIsDocumentInView(true);
  };

  useEffect(() => {
    if (isLargeScreen) {
      window.addEventListener('blur', onBlur);
      window.addEventListener('focus', onFocus);
      timer1();
    }
    return () => {
      if (isLargeScreen) {
        window.removeEventListener('blur', onBlur);
        window.removeEventListener('focus', onFocus);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <Background backgroundColor={background_color} id={id} data-testid="diversity-numbers-container">
      <SectionWrapper paddingMobile="64px 20px 48px">
        {/* Left-side Text */}
        {/* {(numbers_title?.length > 0 || description?.length > 0) && (
          <Details colLg={6} colMd={12} colSm={12} colXs={12}>
            {subtitle?.[0]?.text && (
              <Eyebrow darkMode={dark_mode} backgroundColor={theme.websiteColors.shadesTurquoiseT10} title={subtitle[0].text} />
            )}
            {numbers_title?.[0]?.text && (
              <Title $darkMode={dark_mode} $marginBottom="24px" data-testid="diversity-numbers-title">
                {numbers_title[0].text}
              </Title>
            )}

            {description?.length > 0 &&
              description.map(
                (paragraph) =>
                  paragraph?.text && (
                    <Description
                      data-testid="diversity-numbers-description"
                      $darkMode={dark_mode}
                      $marginBottom="24px"
                      key={paragraph?.text}
                    >
                      {paragraph.text}
                    </Description>
                  ),
              )}
          </Details>
        )} */}

        {/* Scrolling Text */}
        {items?.length >= 10 && (
          <Cards colLg={6} colMd={12} colSm={12} colXs={12}>
            {isLargeScreen && (
              <Column ref={columnRef}>
                {items.slice(0, 5).map(
                  (card, index) =>
                    card?.percentage_or_numbers?.[0]?.text && (
                      <Card
                        data-testid="diversity-numbers-card"
                        key={card?.description?.[0]?.text + card?.percentage_or_numbers?.[0]?.text}
                        className={`${
                          ITERATIONS[inViewArray].includes(index) || ITERATIONS[inViewArray].includes(index + 5)
                            ? 'inview'
                            : ''
                        }`}
                        backgroundColor={card?.background_color}
                        ref={(el) => (cardsRef.current[index] = el)}
                      >
                        {card?.percentage_or_numbers?.[0]?.text && (
                          <Percentage
                            data-testid="diversity-numbers-card-percentage"
                            $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                            $marginBottom="8px"
                          >
                            {card.percentage_or_numbers[0].text}
                          </Percentage>
                        )}
                        {card?.description?.[0]?.text && (
                          <Text5
                            data-testid="diversity-numbers-card-description"
                            $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                            $marginBottom="0"
                          >
                            {card.description[0].text}
                          </Text5>
                        )}
                      </Card>
                    ),
                )}
                {items.slice(0, 5).map(
                  (card, index) =>
                    card?.percentage_or_numbers?.[0]?.text && (
                      <Card
                        data-testid="diversity-numbers-card"
                        key={card?.description?.[0]?.text + card?.percentage_or_numbers?.[0]?.text}
                        className={`${
                          ITERATIONS[inViewArray].includes(index) || ITERATIONS[inViewArray].includes(index + 5)
                            ? 'inview'
                            : ''
                        }`}
                        backgroundColor={card?.background_color}
                        ref={(el) => (cardsRef.current[index] = el)}
                      >
                        {card?.percentage_or_numbers?.[0]?.text && (
                          <Percentage
                            data-testid="diversity-numbers-card-percentage"
                            $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                            $marginBottom="8px"
                          >
                            {card.percentage_or_numbers[0].text}
                          </Percentage>
                        )}
                        {card?.description?.[0]?.text && (
                          <Text5
                            data-testid="diversity-numbers-card-description"
                            $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                            $marginBottom="0"
                          >
                            {card.description[0].text}
                          </Text5>
                        )}
                      </Card>
                    ),
                )}
              </Column>
            )}
            {isLargeScreen && (
              <ColumnOdd ref={columnOddRef}>
                {items.slice(5, 10).map(
                  (card, index) =>
                    card?.percentage_or_numbers?.[0]?.text && (
                      <Card
                        data-testid="diversity-numbers-card"
                        key={card?.description?.[0]?.text + card?.percentage_or_numbers?.[0]?.text}
                        className={`${
                          ITERATIONS[inViewArrayOdd].includes(index) || ITERATIONS[inViewArrayOdd].includes(index + 5)
                            ? 'inview'
                            : ''
                        }`}
                        backgroundColor={card?.background_color}
                        ref={(el) => (cardsRef.current[index] = el)}
                      >
                        {card?.percentage_or_numbers?.[0]?.text && (
                          <Percentage
                            data-testid="diversity-numbers-card-percentage"
                            $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                            $marginBottom="8px"
                          >
                            {card.percentage_or_numbers[0].text}
                          </Percentage>
                        )}
                        {card?.description?.[0]?.text && (
                          <Text5
                            data-testid="diversity-numbers-card-description"
                            $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                            $marginBottom="0"
                          >
                            {card.description[0].text}
                          </Text5>
                        )}
                      </Card>
                    ),
                )}
                {items.slice(5, 10).map(
                  (card, index) =>
                    card?.percentage_or_numbers?.[0]?.text && (
                      <Card
                        data-testid="diversity-numbers-card"
                        key={card?.description?.[0]?.text + card?.percentage_or_numbers?.[0]?.text}
                        className={`${
                          ITERATIONS[inViewArrayOdd].includes(index) || ITERATIONS[inViewArrayOdd].includes(index + 5)
                            ? 'inview'
                            : ''
                        }`}
                        backgroundColor={card?.background_color}
                        ref={(el) => (cardsRef.current[index] = el)}
                      >
                        {card?.percentage_or_numbers?.[0]?.text && (
                          <Percentage
                            data-testid="diversity-numbers-card-percentage"
                            $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                            $marginBottom="8px"
                          >
                            {card.percentage_or_numbers[0].text}
                          </Percentage>
                        )}
                        {card?.description?.[0]?.text && (
                          <Text5
                            data-testid="diversity-numbers-card-description"
                            $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                            $marginBottom="0"
                          >
                            {card.description[0].text}
                          </Text5>
                        )}
                      </Card>
                    ),
                )}
              </ColumnOdd>
            )}

            {!isLargeScreen && (
              <>
                <ColumnSmallerWindowsize ref={columnRef}>
                  {items.slice(0, 4).map(
                    (card) =>
                      card?.percentage_or_numbers?.[0]?.text && (
                        <Card
                          data-testid="diversity-numbers-card"
                          key={card?.description?.[0]?.text + card?.percentage_or_numbers?.[0]?.text}
                          backgroundColor={card?.background_color}
                        >
                          {card?.percentage_or_numbers?.[0]?.text && (
                            <Percentage
                              data-testid="diversity-numbers-card-percentage"
                              $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                              $marginBottom="8px"
                            >
                              {card.percentage_or_numbers[0].text}
                            </Percentage>
                          )}
                          {card?.description?.[0]?.text && (
                            <Text5
                              data-testid="diversity-numbers-card-description"
                              $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                              $marginBottom="0"
                            >
                              {card.description[0].text}
                            </Text5>
                          )}
                        </Card>
                      ),
                  )}
                </ColumnSmallerWindowsize>
                <ColumnSmallerWindowsize ref={columnRef}>
                  {items.slice(4, 8).map(
                    (card) =>
                      card?.percentage_or_numbers?.[0]?.text && (
                        <Card
                          data-testid="diversity-numbers-card"
                          key={card?.description?.[0]?.text + card?.percentage_or_numbers?.[0]?.text}
                          className="card"
                          backgroundColor={card?.background_color}
                        >
                          {card?.percentage_or_numbers?.[0]?.text && (
                            <Percentage
                              data-testid="diversity-numbers-card-percentage"
                              $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                              $marginBottom="8px"
                            >
                              {card.percentage_or_numbers[0].text}
                            </Percentage>
                          )}
                          {card?.description?.[0]?.text && (
                            <Text5
                              data-testid="diversity-numbers-card-description"
                              $darkMode={card?.background_color === 'primaryDark' ? 'light' : dark_mode}
                              $marginBottom="0"
                            >
                              {card.description[0].text}
                            </Text5>
                          )}
                        </Card>
                      ),
                  )}
                </ColumnSmallerWindowsize>
              </>
            )}
          </Cards>
        )}
      </SectionWrapper>
    </Background>
  );
};
export default Numbers;
