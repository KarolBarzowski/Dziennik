import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useData } from 'hooks/useData';
import { Pie } from 'react-chartjs-2';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Collapsible from 'components/molecules/Collapsible/Collapsible';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { getColor, getStatus } from 'functions/functions';
import { slideInDown } from 'functions/animations';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-top: 3.5rem;
`;

const StyledBox = styled.div`
  background-color: ${({ theme }) => theme.card};
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.15s;
  :first-of-type {
    margin-right: 2.5rem;
    width: 100%;
  }
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledHeader = styled(StyledRow)`
  padding-bottom: 0.5rem;
  border-bottom: 0.1rem solid ${({ theme }) => theme.border};
`;

const StyledParagraph = styled(Paragraph)`
  font-size: ${({ theme }) => theme.m};
  margin-top: 0.6rem;
`;

const StyledItemRow = styled(StyledRow)`
  :nth-of-type(even) {
    background-color: ${({ theme }) => theme.modalHover};
  }

  :hover {
    background-color: ${({ theme }) => theme.hover};
  }

  :last-of-type {
    margin-bottom: 1.5rem;
  }
`;

const StyledItem = styled(StyledParagraph)`
  width: 100%;
  color: ${({ theme, color }) => (color ? theme[color] : theme.text)};
  :nth-of-type(1) {
    max-width: 14rem;
  }
`;

const StyledWarnIcon = styled(FontAwesomeIcon)`
  color: rgb(211, 47, 47);
  margin-right: 0.5rem;
`;

const StyledColor = styled.span`
  color: ${({ theme, color }) => theme[color]};
`;

const StyledLink = styled.a`
  padding: 0.4rem 1.2rem;
  margin-left: 2.5rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-size: ${({ theme }) => theme.s};
  font-weight: ${({ theme }) => theme.medium};
  border: 0.2rem solid ${({ theme }) => theme.border};
  border-radius: 5rem;
  transition: background-color 0.1s ease-in-out;
  :hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-flow: column-reverse nowrap;
`;

function Absences() {
  const { absencesData } = useData(null);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [frequency, setFrequency] = useState(null);
  const [absences, setAbsences] = useState(null);

  const daysInWeek = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];
  const monthsInYear = [
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

  useEffect(() => {
    if (absencesData) {
      const absencesSorted = {
        excused: [],
        unexcused: [],
        notCounted: [],
        pending: [],
      };

      const absencesObj = {};

      absencesData.forEach(({ name, date, hours, status }) => {
        const item = {
          name,
          hours,
          status: getStatus(status),
          statusColor: getColor(status),
        };

        const [day, month, year] = date.split('/');
        const dateSyntax = `${parseFloat(day)} ${monthsInYear[month - 1]} 20${year}`;
        const actualDate = new Date(`20${year}`, month - 1, parseFloat(day));
        const dayName = daysInWeek[actualDate.getDay()];

        absencesSorted[status].push({ status });
        if (absencesObj[date]) {
          absencesObj[date].lessons.push(item);
          absencesObj[date].types.push(status);
        } else {
          absencesObj[date] = {
            date: `${dateSyntax} (${dayName})`,
            types: [status],
            lessons: [item],
          };
        }
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
            backgroundColor: [
              'rgb(52, 199, 89)',
              'rgb(90, 200, 250)',
              'rgb(0, 122, 255)',
              'rgb(255, 69, 58)',
            ],
          },
        ],
      };
      setAbsences(absencesObj);
      setFrequency(absencesSorted);
      setData(dataObj);
    }
    // eslint-disable-next-line
  }, [absencesData]);

  return (
    <Section width={840}>
      <Heading big>Frekwencja</Heading>
      <StyledWrapper>
        <StyledRow>
          <StyledBox>
            <Heading>Frekwencja - podsumowanie</Heading>
            {frequency && (
              <>
                {frequency.unexcused.length !== 0 && (
                  <StyledParagraph>
                    <StyledWarnIcon icon={faExclamation} />
                    Masz nieusprawiedliwione nieobecności:{' '}
                    <StyledColor color="red">{frequency.unexcused.length}</StyledColor>{' '}
                    <StyledLink
                      href="https://nasze.miasto.gdynia.pl/ed_miej/login.pl"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Usprawiedliwienie <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </StyledLink>
                  </StyledParagraph>
                )}
                <StyledParagraph>
                  Łączna liczba nieobecności: {absencesData ? absencesData.length : 'Ładowanie...'}
                </StyledParagraph>
                <StyledParagraph>
                  Łączna liczba godzin <StyledColor color="green">usprawiedliwionych</StyledColor>:{' '}
                  {frequency ? frequency.excused.length : 'Ładowanie...'}
                </StyledParagraph>
                <StyledParagraph>
                  Łączna liczba godzin <StyledColor color="red">nieusprawiedliwionych</StyledColor>:{' '}
                  {frequency ? frequency.unexcused.length : 'Ładowanie...'}
                </StyledParagraph>
                <StyledParagraph>
                  Łączna liczba godzin{' '}
                  <StyledColor color="blue">wnioskowanych do usprawiedliwienia</StyledColor>:{' '}
                  {frequency ? frequency.pending.length : 'Ładowanie...'}
                </StyledParagraph>
                <StyledParagraph>
                  Łączna liczba godzin{' '}
                  <StyledColor color="teal">nieliczonych do frekwencji</StyledColor> :{' '}
                  {frequency ? frequency.notCounted.length : 'Ładowanie...'}
                </StyledParagraph>
              </>
            )}
          </StyledBox>
          <StyledBox>
            <Pie
              data={data}
              width={250}
              height={250}
              options={{
                legend: {
                  display: false,
                },
                maintainAspectRatio: false,
              }}
            />
          </StyledBox>
        </StyledRow>
        {absencesData && (
          <StyledBox>
            <StyledHeader>
              <Heading>Nieobecności</Heading>
              <Heading>{absencesData.length}</Heading>
            </StyledHeader>
            <StyledContent>
              {absences &&
                Object.keys(absences).map(key => (
                  <Collapsible key={key} title={absences[key].date} info={absences[key].types}>
                    {absences[key].lessons.map(({ name, hours, status, statusColor }) => (
                      <StyledItemRow key={hours}>
                        <StyledItem>{hours}</StyledItem>
                        <StyledItem>{name}</StyledItem>
                        <StyledItem color={statusColor}>{status}</StyledItem>
                      </StyledItemRow>
                    ))}
                  </Collapsible>
                ))}
            </StyledContent>
          </StyledBox>
        )}
      </StyledWrapper>
    </Section>
  );
}

export default Absences;
