import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from 'components/atoms/Card/Card';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import PlanContent from 'components/molecules/PlanContent/PlanContent';
import { useData } from 'hooks/useData';

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

const StyledHeading = styled(Heading)`
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Info = styled(Paragraph)`
  font-size: 1.6rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const StyledParagraph = styled(Paragraph)`
  position: relative;
  font-size: 1.6rem;
  z-index: 1;
`;

const SwitchActive = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  background-color: ${({ theme }) => theme.border};
  height: 100%;
  width: 50%;
  transform: ${({ active }) => (active ? 'translateX(100%)' : 'transalteX(0)')};
  transition: transform 0.3s ease-in-out;
`;

const SwitchWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 3.4rem;
  border-radius: 10rem;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.border};
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const SwitchItem = styled.button`
  border: none;
  background-color: transparent;
  height: 100%;
  padding: 0.5rem 1rem;
  cursor: pointer;
  outline: none;
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: space-between;
`;

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: ${({ center }) => (center ? 'center' : 'flex-start')};
`;

const Error = styled(Paragraph)`
  color: ${({ theme }) => theme.error};
  font-size: 1.6rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
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

const daysInWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

function PlanCard() {
  const [isSyncNeeded, setIsSyncNeeded] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(1);
  const [plan, setPlan] = useState([]);
  const [todayDateSyntax, setTodayDateSyntax] = useState('');
  const [tomorrowDateSyntax, setTomorrowDateSyntax] = useState('');

  const { planData } = useData();

  useEffect(() => {
    if (planData.length) {
      let isSyncNeeded = false;
      let isToday = false;
      let isTomorrow = false;
      let today = null;
      let tomorrow = null;

      const now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      now.setMilliseconds(0);
      const currentTs = now.getTime();
      const currentDayNumber = now.getDay();

      let todayTs;
      let tomorrowTs;
      const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

      if (currentDayNumber === 0) {
        // sunday
        todayTs = currentTs - ONE_DAY_IN_MILLISECONDS * 2;
        tomorrowTs = currentTs + ONE_DAY_IN_MILLISECONDS;
      } else if (currentDayNumber === 6) {
        // saturday
        todayTs = currentTs - ONE_DAY_IN_MILLISECONDS;
        tomorrowTs = currentTs + ONE_DAY_IN_MILLISECONDS * 2;
      } else if (currentDayNumber === 5) {
        // friday
        todayTs = currentTs;
        tomorrowTs = currentTs + ONE_DAY_IN_MILLISECONDS * 3;
      } else {
        // rest
        todayTs = currentTs;
        tomorrowTs = currentTs + ONE_DAY_IN_MILLISECONDS;
      }

      const todayDate = new Date(todayTs);
      const tomorrowDate = new Date(tomorrowTs);

      const todayDayNumber = todayDate.getDay() - 1;
      let tomorrowDayNumber = tomorrowDate.getDay() - 1;
      if (tomorrowDayNumber < 0) tomorrowDayNumber = 0;

      let todayDateSyntax;
      let tomorrowDateSyntax;

      planData.forEach(week => {
        week.forEach(({ title, plan }) => {
          const [, titleDate] = title.split(' ');
          let [dd, mm, yy] = titleDate.split('/');
          dd = parseFloat(dd);
          mm = parseFloat(mm) - 1;
          yy = `20${yy}`;

          const currentDate = new Date(yy, mm, dd, 0, 0, 0, 0);
          const currentDayTs = currentDate.getTime();

          if (!isToday && currentDayTs === todayTs) {
            isToday = true;
            today = plan;
            todayDateSyntax = `${daysInWeek[currentDate.getDay()]}, ${currentDate.getDate()} ${
              monthsInYearInGenitive[currentDate.getMonth()]
            }`;
          }

          if (!isTomorrow && currentDayTs === tomorrowTs) {
            isTomorrow = true;
            tomorrow = plan;
            tomorrowDateSyntax = `${daysInWeek[currentDate.getDay()]}, ${currentDate.getDate()} ${
              monthsInYearInGenitive[currentDate.getMonth()]
            }`;
          }
        });
      });

      if (!isToday) {
        today = planData[1][todayDayNumber].plan;
        isSyncNeeded = true;
        const [, titleDate] = planData[1][todayDayNumber].title.split(' ');
        let [dd, mm, yy] = titleDate.split('/');
        dd = parseFloat(dd);
        mm = parseFloat(mm) - 1;
        yy = `20${yy}`;
        const currentDate = new Date(yy, mm, dd, 0, 0, 0, 0);

        todayDateSyntax = `${daysInWeek[currentDate.getDay()]}, ${currentDate.getDate()} ${
          monthsInYearInGenitive[currentDate.getMonth()]
        }`;
      }

      if (!isTomorrow) {
        tomorrow = planData[1][tomorrowDayNumber].plan;
        isSyncNeeded = true;
        const [, titleDate] = planData[1][tomorrowDayNumber].title.split(' ');
        let [dd, mm, yy] = titleDate.split('/');
        dd = parseFloat(dd);
        mm = parseFloat(mm) - 1;
        yy = `20${yy}`;
        const currentDate = new Date(yy, mm, dd, 0, 0, 0, 0);

        tomorrowDateSyntax = `${daysInWeek[currentDate.getDay()]}, ${currentDate.getDate()} ${
          monthsInYearInGenitive[currentDate.getMonth()]
        }`;
      }

      setPlan([today, tomorrow]);
      setTodayDateSyntax(todayDateSyntax);
      setTomorrowDateSyntax(tomorrowDateSyntax);
      setIsSyncNeeded(isSyncNeeded);
    }
  }, [planData]);

  return (
    <Card>
      <Row>
        <Column>
          <StyledHeading delay={0.05}>Plan lekcji</StyledHeading>
          <Info secondary delay={0.1}>
            {currentPlan ? tomorrowDateSyntax : todayDateSyntax}
          </Info>
          {isSyncNeeded ? (
            <Error delay={0.15}>
              Zalecana synchronizacja,
              <br />
              plan jest przedawniony.
            </Error>
          ) : null}
        </Column>
        <SwitchWrapper delay={0.05}>
          <SwitchActive active={currentPlan} />
          <SwitchItem type="button" onClick={() => setCurrentPlan(0)}>
            <StyledParagraph>Dzisiaj</StyledParagraph>
          </SwitchItem>
          <SwitchItem type="button" onClick={() => setCurrentPlan(1)}>
            <StyledParagraph>Jutro</StyledParagraph>
          </SwitchItem>
        </SwitchWrapper>
      </Row>
      <PlanContent plan={plan[currentPlan]} />
    </Card>
  );
}

export default PlanCard;
