import { useState, useEffect } from 'react';

export const useData = () => {
  const [data, setData] = useState(null);
  const [gradesData, setGrades] = useState([]);
  const [userData, setUser] = useState(null);
  const [planData, setPlan] = useState([]);
  const [behaviourData, setBehaviour] = useState(null);
  const [absencesData, setAbsences] = useState(null);
  const [examsData, setExams] = useState(null);
  const [pointsData, setPoints] = useState(null);

  useEffect(() => {
    const ACTUAL_SCRIPT_VERSION = "3.0.0";
    const scriptVersion = window.localStorage.getItem('script_version');
    if (scriptVersion !== ACTUAL_SCRIPT_VERSION) {
      window.localStorage.clear();
    }
    const actualData = JSON.parse(window.localStorage.getItem('data'));
    if (actualData !== null) {
      setData(actualData);
      const { grades, user, plan, behaviour, absences, exams, points } = actualData;
      setGrades(grades);
      setUser(user);
      setPlan(plan);
      setBehaviour(behaviour);
      setAbsences(absences);
      setExams(exams);
      if (Array.isArray(points[0])) {
        // script compatibility
        setPoints([...points[0], ...points[1]]);
      } else setPoints(points);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      let actualTs = window.localStorage.getItem('actualTs');
      if (actualTs === 'undefined') actualTs = null;
      else actualTs = JSON.parse(actualTs);

      const { timestamp } = userData;
      if (actualTs) {
        if (actualTs !== timestamp) {
          window.localStorage.setItem('lastTs', actualTs);
          window.localStorage.setItem('actualTs', timestamp);
        }
      } else {
        window.localStorage.setItem('actualTs', timestamp);
        window.localStorage.setItem('lastTs', timestamp);
      }
    }
  }, [userData]);
  
  return {
    data,
    gradesData,
    userData,
    planData,
    behaviourData,
    absencesData,
    examsData,
    pointsData,
  };
};
