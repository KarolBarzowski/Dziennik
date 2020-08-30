import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Button from 'components/atoms/Button/Button';
import Card from 'components/organisms/Card/Card';
import EventCard from 'components/organisms/EventCard/EventCard';
import { getColor, getCleanName } from 'functions/functions';

const StyledWrapper = styled.div`
  position: relative;
  min-height: calc(100vh - 7.9rem);
  width: 100%;
  column-count: 1;

  @media screen and (min-width: 770px) {
    column-count: 2;
  }

  @media screen and (min-width: 1220px) {
    column-count: 3;
  }

  @media screen and (min-width: 1800px) {
    column-count: 4;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const StyledColor = styled.span`
  color: ${({ theme, color }) => theme[color]};
`;

const daysInWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

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

const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.getMonth();

let yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayMonth = yesterday.getMonth();
yesterday = yesterday.getDate();

function Dashboard() {
  const { planData, userData, examsData, absencesData, gradesData, pointsData } = useData(null);
  const [dateSyntax, setDateSyntax] = useState('');
  const [plan, setPlan] = useState(null);
  const [nextDayExams, setNextDayExams] = useState([]);
  const [sync, setSync] = useState({ isSync: false });
  const [absences, setAbsences] = useState(0);
  const [exams, setExams] = useState(null);
  const [grades, setGrades] = useState(null);
  const [points, setPoints] = useState(null);
  const [isScriptUpdate, setScriptUpdate] = useState(false);

  useEffect(() => {
    const tomorrow = new Date(today);
    let planDay = today.getDay();
    if (today.getDay() > 4) planDay = 0;
    if (today < 5) tomorrow.setDate(tomorrow.getDate() + 1);
    else if (today === 5) tomorrow.setDate(tomorrow.getDate() + 3);
    else tomorrow.setDate(tomorrow.getDate() + 2);
    const d = `0${tomorrow.getDate()}`.slice(-2);
    const m = `0${tomorrow.getMonth() + 1}`.slice(-2);
    const result = `${daysInWeek[tomorrow.getDay()]}, ${d}.${m}`;
    if (planData !== null) setPlan(planData[planDay]);
    setDateSyntax(result);
    // eslint-disable-next-line
  }, [planData]);

  useEffect(() => {
    if (userData) {
      const lastTs = userData.timestamp;
      const actualTs = today.getTime();
      const difference = actualTs - lastTs;
      const dayInSeconds = 1000 * 60 * 60 * 24;
      const daysDifference = Math.floor(difference / dayInSeconds);
      if (daysDifference >= 2) {
        setSync({ isSync: true, days: daysDifference });
      }
    }
    // eslint-disable-next-line
  }, [userData]);

  useEffect(() => {
    if (examsData && examsData.length) {
      const upcomingExams = [];
      examsData.forEach(({ category, date: examDate, name, description }) => {
        const dateArray = examDate.split('/');
        const day = parseFloat(dateArray[0]);
        const month = parseFloat(dateArray[1]) - 1;
        const year = `20${dateArray[2]}`;
        const dateResult = new Date(year, month, day);
        const dayName = daysInWeek[dateResult.getDay()];
        const dd = dateResult.getDate();
        const mm = monthsInYear[dateResult.getMonth()];

        if (today < dateResult) {
          const difference = dateResult.getTime() - today.getTime();
          const dayInSeconds = 1000 * 60 * 60 * 24;
          const daysDifference = Math.floor(difference / dayInSeconds);
          const isNextWeek = daysDifference < 6;
          upcomingExams.push({
            category,
            date: dateResult,
            dateSyntax: `${dd} ${mm}`,
            dayName,
            name,
            desc: description,
            color: getColor(category),
            nameColor: getCleanName(name),
            isNextWeek,
          });
        }
      });

      const sortedUpcoming = upcomingExams.sort((a, b) => b.date - a.date);
      sortedUpcoming.reverse();

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const nextExams = [];

      sortedUpcoming.forEach(exam => {
        if (exam.date.getTime() === tomorrow.getTime()) nextExams.push(exam);
      });

      setNextDayExams(nextExams);
      setExams(sortedUpcoming);
    }
    // eslint-disable-next-line
  }, [examsData]);

  useEffect(() => {
    if (absencesData) {
      const unexcused = [];
      absencesData.forEach(({ status }) => {
        if (status === 'unexcused') {
          unexcused.push(status);
        }
      });
      setAbsences(unexcused.length);
    }
  }, [absencesData]);

  useEffect(() => {
    const lastTs = JSON.parse(window.localStorage.getItem('lastTs'));
    if (gradesData && lastTs) {
      const results = [];
      gradesData.forEach(({ name, grades: gradesList }) => {
        const actualGrades = [];
        gradesList.forEach(grade => {
          const dateArray = grade.date.split(' ');
          let [day, month, year] = dateArray[0].split('/');
          day = parseFloat(day);
          month = parseFloat(month);
          year = parseFloat(year);
          const [hour, minute, second] = dateArray[1].split(':');
          const actualDate = new Date(
            `20${year}`,
            month - 1,
            day,
            parseFloat(hour),
            parseFloat(minute),
            parseFloat(second),
          ).getTime();

          let fullDate;

          if (currentDay === day && currentMonth === month - 1) {
            fullDate = `Dzisiaj o ${hour}:${minute}`;
          } else if (yesterday === day && yesterdayMonth === month - 1) {
            fullDate = `Wczoraj o ${hour}:${minute}`;
          } else {
            fullDate = `${day} ${monthsInYear[month - 1]} | ${hour}:${minute}`;
          }

          if (actualDate > lastTs) {
            // eslint-disable-next-line
            grade.color = getColor(grade.category);
            // eslint-disable-next-line
            grade.dateSyntax = fullDate;
            actualGrades.push(grade);
          }
        });
        if (actualGrades.length) {
          results.push({ name, color: getCleanName(name), grades: actualGrades });
        }
      });
      setGrades(results);
    }
  }, [gradesData]);

  useEffect(() => {
    const lastTs = JSON.parse(window.localStorage.getItem('lastTs'));
    if (pointsData && lastTs) {
      const results = [];
      pointsData.forEach(point => {
        const dateArray = point.date.split('/');
        const day = parseFloat(dateArray[0]);
        const month = parseFloat(dateArray[1]) - 1;
        const year = `20${dateArray[2]}`;
        const dateResult = new Date(year, month, day);
        const dd = dateResult.getDate();
        const mm = monthsInYear[dateResult.getMonth()];

        const capitalizedType = point.type.length
          ? point.type[0].toUpperCase() + point.type.slice(1)
          : 'Inne';

        if (dateResult.getTime() > lastTs) {
          // eslint-disable-next-line
          point.color = getColor(point.type);
          // eslint-disable-next-line
          point.type = capitalizedType;
          // eslint-disable-next-line
          point.dateSyntax = `${dd} ${mm}`;
          results.push(point);
        }
      });
      setPoints(results);
    }
    // eslint-disable-next-line
  }, [pointsData]);

  useEffect(() => {
    const ACTUAL_SCRIPT_VERSION = process.env.REACT_APP_SCRIPT_VERSION;
    const scriptVersion = window.localStorage.getItem('script_version');
    setScriptUpdate(scriptVersion !== ACTUAL_SCRIPT_VERSION);
  }, []);

  return (
    <Section>
      <StyledWrapper>
        <Card cardType="grades" grades={grades}>
          <StyledHeader>
            <div>
              <Heading>Oceny</Heading>
              <Paragraph secondary>Nowe oceny od ostatniej synchronizacji</Paragraph>
            </div>
            <Button as={Link} to="/oceny">
              Wszystkie
            </Button>
          </StyledHeader>
        </Card>
        {sync.isSync && (
          <Card
            cardType="mini"
            link="https://nasze.miasto.gdynia.pl/ed_miej/zest_start.pl?autoSync=true"
            ctaText="Synchronizuj"
          >
            <>
              <Heading>Synchronizacja</Heading>
              <Paragraph secondary>Ostatnia synchronizacja była {sync.days} dni temu.</Paragraph>
              <br />
              <Paragraph>
                Kliknij Synchronizuj i się zaloguj, cały proces przebiegnie automatycznie.
              </Paragraph>
            </>
          </Card>
        )}
        {isScriptUpdate && (
          <Card
            cardType="mini"
            link="https://github.com/KarolBarzowski/Dziennik/raw/master/script.user.js"
            ctaText="Aktualizuj"
          >
            <>
              <Heading>Aktualizacja</Heading>
              <Paragraph secondary>Dostępna jest aktualizacja skryptu</Paragraph>
            </>
          </Card>
        )}
        {absences !== 0 && (
          <Card
            cardType="mini"
            link="https://nasze.miasto.gdynia.pl/ed_miej/login.pl"
            ctaText="Usprawiedliwienie"
          >
            <>
              <Heading>Nieobecności</Heading>
              <Paragraph>
                Masz <StyledColor color="red">{absences}</StyledColor> nieusprawiedliwionych godzin!
              </Paragraph>
            </>
          </Card>
        )}
        <Card cardType="exams" exams={exams}>
          <StyledHeader>
            <div>
              <Heading>Sprawdziany</Heading>
              <Paragraph secondary>Nadchodzące sprawdziany i inne zadania</Paragraph>
            </div>
            <Button as={Link} to="/sprawdziany">
              Wszystkie
            </Button>
          </StyledHeader>
        </Card>
        <Card cardType="points" points={points}>
          <StyledHeader>
            <div>
              <Heading>Uwagi</Heading>
              <Paragraph secondary>Nowe uwagi od ostatniej synchronizacji</Paragraph>
            </div>
            <Button as={Link} to="/uwagi">
              Wszystkie
            </Button>
          </StyledHeader>
        </Card>
        <Card cardType="plan" lessons={plan} nextDayExams={nextDayExams}>
          <StyledHeader>
            <div>
              <Heading>Plan lekcji</Heading>
              <Paragraph secondary>{dateSyntax}</Paragraph>
            </div>
            <Button as={Link} to="/plan">
              Wszystkie
            </Button>
          </StyledHeader>
        </Card>
        <EventCard />
      </StyledWrapper>
    </Section>
  );
}

export default Dashboard;
