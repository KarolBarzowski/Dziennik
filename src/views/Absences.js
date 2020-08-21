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
import { getColor, getStatus, getCleanName } from 'functions/functions';
import { slideInDown } from 'functions/animations';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledBox = styled.div`
  background-color: ${({ theme }) => theme.card};
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 0 0 1.5rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.15s;
  :first-of-type {
    margin-right: 1.5rem;
    width: 100%;
  }
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledHeader = styled(StyledRow)`
  padding-bottom: 0.5rem;
  border-bottom: 0.1rem solid ${({ theme }) => theme.border};
`;

const StyledParagraph = styled(Paragraph)`
  font-size: ${({ theme }) => theme.m};
`;

const StyledItemRow = styled(StyledRow)`
  padding: 0.5rem 0;

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
  width: 50%;
  color: ${({ theme, color }) => (color ? theme[color] : theme.text)};
`;

const StyledItemsWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 50%;
`;

const StyledWarnIcon = styled(FontAwesomeIcon)`
  color: rgb(211, 47, 47);
  margin-right: 0.5rem;
`;

const StyledColor = styled.span`
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
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

const StyledList = styled.ul`
  margin-top: 1.5rem;
  list-style-type: none;
`;

const StyledSection = styled.div`
  margin: 1.5rem 0 0;
`;

const StyledSectionTitle = styled(Paragraph)`
  font-size: 1.6rem;
`;

const daysInWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
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
const monthsInYear = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

function Absences() {
  const { absencesData } = useData(null);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [frequency, setFrequency] = useState(null);
  const [absences, setAbsences] = useState(null);
  const [lessonAbsences, setLessonAbsences] = useState(null);

  useEffect(() => {
    if (absencesData) {
      const absencesSorted = {
        excused: [],
        unexcused: [],
        notCounted: [],
        pending: [],
      };

      const absencesObj = {};
      const lessonsAbsences = {};

      absencesData.forEach(({ name, date, hours, status }) => {
        const item = {
          name,
          hours,
          status: getStatus(status),
          statusColor: getColor(status),
        };

        const [day, month, year] = date.split('/');
        const dateSyntax = `${parseFloat(day)} ${monthsInYearInGenitive[month - 1]} 20${year}`;
        const actualDate = new Date(`20${year}`, month - 1, parseFloat(day));
        const dayName = daysInWeek[actualDate.getDay()];
        const monthName = monthsInYear[parseFloat(month - 1)];

        absencesSorted[status].push({ status });

        if (absencesObj[monthName]) {
          if (absencesObj[monthName][date]) {
            // add items to date object
            absencesObj[monthName][date].lessons.push(item);
            absencesObj[monthName][date].types.push(status);
          } else {
            // create date object
            absencesObj[monthName][date] = {
              date: `${dateSyntax} (${dayName})`,
              types: [status],
              lessons: [item],
            };
          }
        } else {
          // create monthName object
          absencesObj[monthName] = {
            [date]: {
              date: `${dateSyntax} (${dayName})`,
              types: [status],
              lessons: [item],
            },
          };
        }

        if (lessonsAbsences[name]) {
          lessonsAbsences[name].push({ ...item, date: `${dateSyntax} (${dayName})` });
        } else {
          lessonsAbsences[name] = [{ ...item, date: `${dateSyntax} (${dayName})` }];
        }
      });

      console.log(absencesObj);

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

      setLessonAbsences(lessonsAbsences);
      setAbsences(absencesObj);
      setFrequency(absencesSorted);
      setData(dataObj);
    }
    // eslint-disable-next-line
  }, [absencesData]);

  return (
    <Section>
      <StyledWrapper>
        <StyledRow>
          <StyledBox>
            <Heading>Podsumowanie</Heading>
            {frequency && (
              <>
                {frequency.unexcused.length !== 0 ? (
                  <StyledParagraph>
                    <StyledWarnIcon icon={faExclamation} />
                    Masz nieusprawiedliwione nieobecności:{' '}
                    <StyledColor color="red">{frequency.unexcused.length}</StyledColor>{' '}
                    <StyledLink
                      href="https://nasze.miasto.gdynia.pl/ed_miej/display.pl?form=ed_nieobecnosci_ucznia"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Usprawiedliwienie <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </StyledLink>
                  </StyledParagraph>
                ) : null}
                {/* <StyledParagraph>Łącznie:</StyledParagraph> */}
                <StyledList>
                  <li>
                    <StyledParagraph>
                      &bull; Nieobecności: {absencesData ? absencesData.length : 'Brak danych'}
                    </StyledParagraph>
                  </li>
                  <li>
                    <StyledParagraph>
                      &bull; Godziny <StyledColor color="green">usprawiedliwione</StyledColor>:{' '}
                      {frequency ? frequency.excused.length : 'Brak danych'}
                    </StyledParagraph>
                  </li>
                  <li>
                    <StyledParagraph>
                      &bull; Godziny <StyledColor color="red">nieusprawiedliwione</StyledColor>:{' '}
                      {frequency ? frequency.unexcused.length : 'Brak danych'}
                    </StyledParagraph>
                  </li>
                  <li>
                    <StyledParagraph>
                      &bull; Godziny{' '}
                      <StyledColor color="blue">wnioskowane do usprawiedliwienia</StyledColor>:{' '}
                      {frequency ? frequency.pending.length : 'Brak danych'}
                    </StyledParagraph>
                  </li>
                  <li>
                    <StyledParagraph>
                      &bull; Godziny{' '}
                      <StyledColor color="teal">nieliczone do frekwencji</StyledColor> :{' '}
                      {frequency ? frequency.notCounted.length : 'Brak danych'}
                    </StyledParagraph>
                  </li>
                </StyledList>
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
          <>
            <StyledBox>
              <StyledHeader>
                <Heading>Nieobecności z poszczególnych przedmiotów</Heading>
              </StyledHeader>
              <StyledContent>
                {lessonAbsences &&
                  Object.keys(lessonAbsences).map(key => (
                    <Collapsible key={key} title={key} count={lessonAbsences[key].length}>
                      <>
                        {lessonAbsences[key].map(({ date, hours, status, statusColor }, i) => (
                          <StyledItemRow key={i.toString()}>
                            <StyledItemsWrapper>
                              <StyledItem>{date}</StyledItem>
                              <StyledItem>{hours}</StyledItem>
                            </StyledItemsWrapper>
                            <StyledItem color={statusColor}>{status}</StyledItem>
                          </StyledItemRow>
                        ))}
                      </>
                    </Collapsible>
                  ))}
              </StyledContent>
            </StyledBox>
            <StyledBox>
              <StyledHeader>
                <Heading>Wszystkie nieobecności</Heading>
                <Heading>{absencesData.length}</Heading>
              </StyledHeader>
              <StyledContent>
                {absences
                  ? Object.keys(absences).map(monthName => (
                      <StyledSection key={monthName}>
                        <StyledSectionTitle secondary>{monthName}</StyledSectionTitle>
                        {Object.keys(absences[monthName]).map(key => (
                          <Collapsible
                            key={key}
                            title={absences[monthName][key].date}
                            info={absences[monthName][key].types}
                            count={absences[monthName][key].lessons.length}
                          >
                            <>
                              {absences[monthName][key].lessons.map(
                                ({ name, hours, status, statusColor }) => (
                                  <StyledItemRow key={hours}>
                                    <StyledItemsWrapper>
                                      <StyledItem>{hours}</StyledItem>
                                      <StyledItem color={getCleanName(name)}>{name}</StyledItem>
                                    </StyledItemsWrapper>
                                    <StyledItem color={statusColor}>{status}</StyledItem>
                                  </StyledItemRow>
                                ),
                              )}
                            </>
                          </Collapsible>
                        ))}
                      </StyledSection>
                    ))
                  : null}
              </StyledContent>
            </StyledBox>
          </>
        )}
      </StyledWrapper>
    </Section>
  );
}

export default Absences;
