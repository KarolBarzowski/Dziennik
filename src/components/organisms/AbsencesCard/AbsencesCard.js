import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useData } from 'hooks/useData';
import { Pie } from 'react-chartjs-2';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Card from 'components/atoms/Card/Card';
import { ReactComponent as PieChart } from 'assets/images/pie_chart.svg';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

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

const StyledImg = styled(PieChart)`
  pointer-events: none;
  height: 14.4rem;
  width: 14.4rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Empty = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin: 2.5rem;
`;

const Info = styled(Paragraph)`
  font-size: ${({ secondary }) => (secondary ? '1.3rem' : '1.6rem')};
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 1.5rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const Baseline = styled(Row)`
  align-items: baseline;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Box = styled.div`
  width: 50%;
  height: 25rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Color = styled.span`
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.red};
  margin-right: 0.5rem;
`;

const BtnIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.text};
  margin-left: 0.5rem;
`;

const Warning = styled(StyledParagraph)`
  font-size: 2.1rem;
  margin: 1.5rem 0 1rem;
`;

const Button = styled.a`
  display: flex;
  padding: 0.6rem 1.4rem;
  border: 0.2rem solid rgb(99, 99, 102);
  border-radius: 5rem;
  max-width: 20.7rem;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out 0s, border 0.3s ease-in-out 0.05s,
    color 0.3s ease-in-out 0.05s;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};

  :hover {
    background-color: rgba(255, 255, 255, 0.07);
  }
`;

const Day = styled(Paragraph)`
  font-size: 5.5rem;

  ${({ border }) =>
    border &&
    css`
      position: relative;
      margin-left: 1.5rem;
      padding-left: 1.5rem;

      ::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        border-left: 1px solid ${({ theme }) => theme.textSecondary};
        height: 5.5rem;
      }
    `}
`;

const Label = styled(Paragraph)`
  font-size: 2.1rem;
  margin-left: 0.5rem;
`;

const today = new Date();

let yesterday = new Date(today);
yesterday.setDate(today.getDate() + 1);
yesterday = yesterday.getDate();

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

const backgroundColors = [
  'rgb(52, 199, 89)',
  'rgb(90, 200, 250)',
  'rgb(0, 122, 255)',
  'rgb(255, 69, 58)',
];

function AbsencesCard() {
  const [absences, setAbsences] = useState([]);
  const [frequency, setFrequency] = useState([]);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [lastAbsence, setLastAbsence] = useState(null);

  const { absencesData } = useData();

  useEffect(() => {
    if (absencesData) {
      const absencesSorted = {
        excused: [],
        unexcused: [],
        notCounted: [],
        pending: [],
      };

      let lastAbsence = null;

      absencesData.forEach(({ date, status }) => {
        const [day, month, year] = date.split('/');
        const actualDate = new Date(`20${year}`, month - 1, parseFloat(day));

        const actualTs = actualDate.getTime();

        if (lastAbsence === null || lastAbsence < actualTs) {
          lastAbsence = actualTs;
        }

        absencesSorted[status].push({ status });
      });

      const dataObj = {
        labels: [
          'Usprawiedliwione',
          'Nieliczone do frekwencji',
          'Wnioskowane',
          'Nieusprawiedliwione',
        ],
        datasets: [
          {
            data: [
              absencesSorted.excused.length,
              absencesSorted.notCounted.length,
              absencesSorted.pending.length,
              absencesSorted.unexcused.length,
            ],
            backgroundColor: backgroundColors,
          },
        ],
      };

      const now = today.getTime();

      const difference = now - lastAbsence;
      const dayInSeconds = 1000 * 60 * 60 * 24;
      const daysDifference = Math.floor(difference / dayInSeconds);

      const lastDate = new Date(lastAbsence);
      const month = lastDate.getMonth();
      const day = lastDate.getDate();

      const monthName = monthsInYearInGenitive[month];

      const dateSyntax = `${day} ${monthName}`;

      setLastAbsence({
        counter: daysDifference,
        dateSyntax,
      });
      setFrequency(absencesSorted);
      setAbsences(absencesData);
      setData(dataObj);
    }
  }, [absencesData]);

  return (
    <Card>
      <StyledHeading delay={0.05}>Frekwencja</StyledHeading>
      {absences.length ? (
        <Wrapper>
          {frequency.unexcused.length ? (
            <>
              <Warning delay={0.1}>
                <Icon icon={faExclamation} />
                <Color color="red">
                  <CountUp start={0} end={frequency.unexcused.length} duration={1.5} delay={0.35} />
                </Color>{' '}
                godzin nieusprawiedliwionych!
              </Warning>
              <Button
                href="https://nasze.miasto.gdynia.pl/ed_miej/display.pl?form=ed_nieobecnosci_ucznia"
                target="_blank"
                delay={0.3}
              >
                <StyledParagraph>Usprawiedliwienie</StyledParagraph>
                <BtnIcon icon={faExternalLinkAlt} fixedWidth />
              </Button>
            </>
          ) : null}
          <Row>
            <Box>
              <Info secondary delay={0.1}>
                Łącznie nieobecności
              </Info>
              <Baseline delay={0.15}>
                <Day>
                  <CountUp start={0} end={absencesData.length} duration={1.5} delay={0.35} />
                </Day>
              </Baseline>
              <Info secondary delay={0.1}>
                Ostatnia nieobecność
              </Info>
              <Baseline delay={0.15}>
                <Day>
                  <CountUp start={0} end={lastAbsence.counter} duration={1.5} delay={0.35} />
                </Day>
                <Label secondary>dni temu</Label>
              </Baseline>
            </Box>
            <Box>
              <Pie
                data={data}
                options={{
                  legend: {
                    display: false,
                  },
                  maintainAspectRatio: false,
                  layout: {
                    padding: 10,
                  },
                  tooltips: {
                    bodyFontFamily: "'Montserrat', sans-serif",
                    bodyFontSize: 13,
                    bodyFontColor: 'rgba(255, 255, 255, .87)',
                    bodyFontStyle: '500',
                    yPadding: 10,
                    xPadding: 10,
                    caretPadding: 15,
                    caretSize: 10,
                    cornerRadius: 10,
                    displayColors: false,
                    backgroundColor: 'rgb(58, 58, 60)',
                    callbacks: {
                      label: (tooltipItem, data) => {
                        return `${data.labels[tooltipItem.index]}: ${
                          data.datasets[0].data[tooltipItem.index]
                        }`;
                      },
                      labelTextColor: tooltipItem => backgroundColors[tooltipItem.index],
                    },
                  },
                }}
              />
            </Box>
          </Row>
        </Wrapper>
      ) : (
        <Empty>
          <StyledImg delay={0.1} />
          <Info delay={0.15}>Żadnych nieobecności</Info>
        </Empty>
      )}
    </Card>
  );
}

export default AbsencesCard;
