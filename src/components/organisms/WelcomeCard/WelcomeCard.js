import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { gsap } from 'gsap';
import { useData } from 'hooks/useData';
import { getWeatherIcon } from 'functions/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Card from 'components/atoms/Card/Card';
import Tooltip from 'components/atoms/Tooltip/Tooltip';

const slideIn = keyframes`
  from {
    transform: translateX(-1.5rem);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Info = styled.a`
  position: relative;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.3rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  width: 5rem;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
  z-index: 9;

  :hover {
    text-decoration: underline;
  }

  :hover ${Tooltip} {
    transform: translate(0, -50%) scale(1);
  }
`;

const Row = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  margin-top: ${({ noMargin }) => (noMargin ? '-1rem' : '1.5rem')};
  justify-content: ${({ spacing }) => (spacing ? 'space-around' : 'flex-start')};
  align-items: center;
`;

const Column = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  width: calc(50% - 1.5rem);

  :first-of-type {
    margin-right: 3rem;
  }
`;

const Line = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 0;
  width: 0.2rem;
  background-color: rgba(255, 255, 255, 0.6);
  transform-origin: top top;
`;

const WeatherIcon = styled.span`
  visibility: hidden;
`;

const Temperature = styled(Paragraph)`
  font-size: ${({ small }) => (small ? '2.1rem' : '5.5rem')};
  margin: 0 ${({ margin }) => (margin ? '0.5rem' : 0)};
  visibility: hidden;
`;

const WeatherDesc = styled(Paragraph)`
  visibility: hidden;
  margin-top: 0.5rem;
  ::first-letter {
    text-transform: uppercase;
  }
`;

const StyledHeading = styled(Heading)`
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
  margin-bottom: 0.5rem;
  color: ${({ secondary, theme }) => (secondary ? theme.textSecondary : theme.text)};
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.red};
`;

const StyledTooltip = styled(Tooltip)`
  text-transform: none;
  letter-spacing: 0rem;
  border-radius: 1rem;
  top: 50%;
  left: 6rem;

  ::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;

    border-bottom: 0.8rem solid transparent;
    border-top: 0.8rem solid transparent;
    border-right: 0.8rem solid rgb(58, 58, 60);
    border-left: 0.8rem solid transparent;

    top: 50%;
    left: -1.5rem;
    transform: translateY(-50%);
  }
`;

const monthsInYearInGenitive = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
];

const daysInWeek = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];

function WelcomeCard() {
  const leftIconRef = useRef(null);
  const rightIconRef = useRef(null);
  const lineRef = useRef(null);
  const temp1Ref = useRef(null);
  const temp2Ref = useRef(null);
  const tempRow1Ref = useRef(null);
  const tempRow2Ref = useRef(null);
  const weatherDesc1Ref = useRef(null);
  const weatherDesc2Ref = useRef(null);

  const [welcome, setWelcome] = useState('Witaj');
  const [todayMessage, setTodayMessage] = useState('');
  const [isTodayVisible, setIsTodayVisible] = useState(false);
  const [isTomorrowVisible, setIsTomorrowVisible] = useState(false);
  const [weather, setWeather] = useState(null);
  const [isWarning, setIsWarning] = useState(false);

  const { userData } = useData();

  useEffect(() => {
    if (userData) {
      const now = new Date();
      const hour = now.getHours();
      const today = now.getDay();
      const day = now.getDate();
      const month = now.getMonth();

      const { name } = userData || '';

      if (hour >= 19) {
        setWelcome(`Dobry wieczór, ${name}!`);
      } else {
        setWelcome(`Dzień dobry, ${name}!`);
      }
      setTodayMessage(`Jest ${daysInWeek[today]}, ${day} ${monthsInYearInGenitive[month]}.`);

      const lat = 54.51889;
      const lon = 18.531879;
      const units = 'metric';
      const lang = 'pl';
      const key = process.env.REACT_APP_WEATHER_API_KEY;

      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${key}&lang=${lang}&units=${units}`,
      )
        .then(response => response.json())
        .then(result => {
          const temp = [result.current.temp, result.daily[1].temp.day];
          const desc = [
            result.current.weather[0].description,
            result.daily[1].weather[0].description,
          ];
          const icon = [result.current.weather[0].icon, result.daily[1].weather[0].icon];
          const min = [result.daily[0].temp.min, result.daily[1].temp.min];
          const max = [result.daily[0].temp.max, result.daily[1].temp.max];
          const code = [result.current.weather[0].id, result.daily[1].weather[0].id];

          const weather = [
            {
              temp: temp[0].toFixed(),
              desc: desc[0],
              icon: icon[0],
              min: min[0].toFixed(),
              max: max[0].toFixed(),
              code: code[0],
            },
            {
              temp: temp[1].toFixed(),
              desc: desc[1],
              icon: icon[1],
              min: min[1].toFixed(),
              max: max[1].toFixed(),
              code: code[1],
            },
          ];

          setWeather(weather);

          setIsWarning(
            weather[1].code >= 200 && weather[1].code < 700 && today !== 5 && today !== 6,
          );

          const tl = gsap.timeline();

          tl.call(() => {
            setIsTodayVisible(true);
            setIsTomorrowVisible(true);
          })
            .fromTo(
              lineRef.current,
              {
                height: 0,
              },
              {
                height: 89,
                duration: 0.75,
                delay: 0.25,
              },
            )
            .fromTo(
              leftIconRef.current,
              { x: 25, autoAlpha: 0 },
              { x: 0, duration: 0.75, autoAlpha: 1 },
              0.25,
            )
            .fromTo(
              rightIconRef.current,
              { x: -25, autoAlpha: 0 },
              { x: 0, duration: 0.75, autoAlpha: 1 },
              0.25,
            )
            .fromTo(
              temp1Ref.current,
              { y: 25, autoAlpha: 0 },
              { y: 0, duration: 0.75, autoAlpha: 1 },
              0.5,
            )
            .fromTo(
              temp2Ref.current,
              { y: 25, autoAlpha: 0 },
              { y: 0, duration: 0.75, autoAlpha: 1 },
              0.5,
            )
            .fromTo(
              [...tempRow2Ref.current.children],
              { y: 15, autoAlpha: 0 },
              { y: 0, duration: 0.5, autoAlpha: 1, stagger: 0.15 },
              0.75,
            )
            .fromTo(
              [...tempRow1Ref.current.children],
              { y: 15, autoAlpha: 0 },
              { y: 0, duration: 0.5, autoAlpha: 1, stagger: 0.15 },
              0.75,
            )
            .fromTo(
              weatherDesc1Ref.current,
              { x: -15, autoAlpha: 0 },
              { x: 0, duration: 0.5, autoAlpha: 1 },
              1,
            )
            .fromTo(
              weatherDesc2Ref.current,
              { x: -15, autoAlpha: 0 },
              { x: 0, duration: 0.5, autoAlpha: 1 },
              1,
            );
        });
    }
  }, [userData]);

  return (
    <Card>
      <StyledHeading big delay={0.05}>
        {welcome}
      </StyledHeading>
      <StyledHeading delay={0.15} secondary>
        {todayMessage}
      </StyledHeading>
      {isWarning ? (
        <StyledHeading delay={0.25}>
          <Icon icon={faExclamation} /> Jutro może padać. Weź parasol!
        </StyledHeading>
      ) : null}
      <Row>
        <Column>
          {isTodayVisible ? (
            <Info
              href="https://www.google.com/search?q=pogoda+gdynia"
              target="_blank"
              rel="noreferrer noopener"
              secondary
              delay={0.5}
            >
              Teraz
              <StyledTooltip>Pokaż w google</StyledTooltip>
            </Info>
          ) : null}
          <Row spacing="true">
            <WeatherIcon ref={leftIconRef}>
              {weather && getWeatherIcon(weather[0].icon)}
            </WeatherIcon>
            <div>
              <Temperature ref={temp1Ref}>{(weather && weather[0].temp) || '?'}&deg;</Temperature>
              <Row noMargin ref={tempRow1Ref}>
                <Temperature secondary small>
                  {weather && weather[0].min}&deg;
                </Temperature>
                <Temperature secondary small margin>
                  |
                </Temperature>
                <Temperature secondary small>
                  {weather && weather[0].max}&deg;
                </Temperature>
              </Row>
            </div>
          </Row>
          <WeatherDesc secondary ref={weatherDesc1Ref}>
            {weather && weather[0].desc}
          </WeatherDesc>
        </Column>
        <Line ref={lineRef} />
        <Column>
          {isTomorrowVisible ? (
            <Info
              href="https://www.google.com/search?q=pogoda+gdynia+jutro"
              target="_blank"
              rel="noreferrer noopener"
              secondary
              delay={0.5}
            >
              Jutro
              <StyledTooltip>Pokaż w google</StyledTooltip>
            </Info>
          ) : null}
          <Row spacing="true">
            <WeatherIcon ref={rightIconRef}>
              {weather && getWeatherIcon(weather[1].icon)}
            </WeatherIcon>
            <div>
              <Temperature ref={temp2Ref}>{(weather && weather[1].temp) || '?'}&deg;</Temperature>
              <Row noMargin ref={tempRow2Ref}>
                <Temperature secondary small>
                  {weather && weather[1].min}&deg;
                </Temperature>
                <Temperature secondary small margin>
                  |
                </Temperature>
                <Temperature secondary small>
                  {weather && weather[1].max}&deg;
                </Temperature>
              </Row>
            </div>
          </Row>
          <WeatherDesc secondary ref={weatherDesc2Ref}>
            {weather && weather[1].desc}
          </WeatherDesc>
        </Column>
      </Row>
    </Card>
  );
}

export default WelcomeCard;
