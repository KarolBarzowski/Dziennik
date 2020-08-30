// ==UserScript==
// @name         Pobieracz danych z e-dziennika
// @version      2.3.2
// @description  Skrypt synchronizuje e-dziennik szkolny z aplikacją.
// @author       Karol
// @match        https://nasze.miasto.gdynia.pl/ed_miej/*
// @match        https://edziennik.netlify.com/*
// @match        https://edziennik.netlify.app/*
// @exclude      https://nasze.miasto.gdynia.pl/ed_miej/login.pl*
// @downloadURL  https://raw.githubusercontent.com/KarolBarzowski/Dziennik/master/script.user.js
// @updateURL    https://raw.githubusercontent.com/KarolBarzowski/Dziennik/master/script.user.js
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

const SCRIPT_VERSION = '2.3.2';
const ACTUAL_ACTION = localStorage.getItem('actualAction');
const SHOULD_START = localStorage.getItem('shouldStart');
const ACTUAL_URL = window.location.href;
const LOGIN = localStorage.getItem('LOGIN');
const USER = localStorage.getItem('user');

const URLS = {
  start: 'https://nasze.miasto.gdynia.pl/ed_miej/zest_start.pl',
  settings: 'https://nasze.miasto.gdynia.pl/ed_miej/display.pl?form=zmiana_danych',
  plan: `https://nasze.miasto.gdynia.pl/ed_miej/display.pl?form=ed_plan_zajec&user=`,
  gradesLinks:
    'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_oceny_ucznia.pl?&f_g_start=0&iframe_name=zest&print_version=1&simple_mode=1&uczen_login=',
  grades:
    'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_oceny_ucznia_szczegoly.pl?&f_g_start=0&print_version=1&login_ucznia=',
  absences:
    'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_nieobecnosci_ucznia.pl?f_g_start=0&iframe_name=zest&print_version=1&simple_mode=1&uczen_login=',
  exams:
    'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_planowane_zadania.pl?f_g_start=0&iframe_name=zest&print_version=1&simple_mode=1&uczen_login=',
  behaviour:
    'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_zachowanie_ucznia.pl?f_g_start=0&print_version=1',
  points:
    'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_uwagi_ucznia.pl?&f_g_start=0&iframe_name=zest&print_version=1&punkty_semestr=',
};

if (
  window.location.href.includes('https://edziennik.netlify.com/') ||
  window.location.href.includes('https://edziennik.netlify.app/')
) {
  const dataToExport = GM_getValue('data', null);
  const storageData = localStorage.getItem('data');
  const parsedStorageData = JSON.parse(storageData);
  localStorage.setItem('script_version', SCRIPT_VERSION);
  if (dataToExport !== null && storageData === null) {
    // after 1st sync
    localStorage.setItem('data', JSON.stringify(dataToExport));
    localStorage.setItem('isUpdate', true);
    window.location.reload();
  } else if (parsedStorageData.user.timestamp < dataToExport.user.timestamp) {
    // sync
    localStorage.setItem('data', JSON.stringify(dataToExport));
    localStorage.setItem('isUpdate', true);
    window.location.reload();
  }
}

const finish = () => {
  const data = localStorage.getItem('data');
  GM_setValue('data', JSON.parse(data));

  localStorage.removeItem('shouldStart');
  localStorage.removeItem('actualAction');
  localStorage.removeItem('user');
  localStorage.removeItem('data');
  localStorage.removeItem('LOGIN');

  window.location.href = 'https://edziennik.netlify.app';
};

const displayButtons = () => {
  const { href } = window.location;

  const isAutoSync = new URL(href).searchParams.get('autoSync') === 'true';

  if (isAutoSync) {
    localStorage.removeItem('shouldStart');
    localStorage.removeItem('actualAction');
    localStorage.removeItem('user');
    localStorage.removeItem('data');
    localStorage.removeItem('names');
    localStorage.removeItem('actualName');
    localStorage.removeItem('LOGIN');

    localStorage.setItem('actualAction', 'settings');
    localStorage.setItem('shouldStart', 'true');

    const menu = document.getElementById('menu');
    let user;

    if (menu.children.length > 1) user = 'parent';
    else user = 'student';
    localStorage.setItem('user', user);

    window.location.href = URLS.settings;
  }

  GM_addStyle(`
  .box {
  position: absolute;
  top: 5px;
  right: 25px;
  background: white;
  }

  .box > button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-family: sans-serif;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, .16) 0px 1px 3px;
  }

  #readyBtn {
  background-color: rgb(36, 138, 61);
  }

  #resetBtn {
  background-color: rgb(215, 0, 21);
  }
  `);

  const box = document.createElement('div');
  box.innerHTML = `
  <button type="button" id="resetBtn">Resetuj</button>
  <button type="button" id="readyBtn">Synchronizuj</button>
  `;
  box.classList.add('box');
  document.body.appendChild(box);

  const readyBtn = document.querySelector('#readyBtn');
  const resetBtn = document.querySelector('#resetBtn');

  readyBtn.addEventListener('click', e => {
    localStorage.setItem('actualAction', 'settings');
    localStorage.setItem('shouldStart', 'true');

    const menu = document.getElementById('menu');
    let user;

    if (menu.children.length > 1) user = 'parent';
    else user = 'student';
    localStorage.setItem('user', user);

    e.target.disabled = true;
    e.target.textContent = 'Pobieranie';

    window.location.href = URLS.settings;
  });

  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('shouldStart');
    localStorage.removeItem('actualAction');
    localStorage.removeItem('user');
    localStorage.removeItem('data');
    localStorage.removeItem('names');
    localStorage.removeItem('actualName');
    localStorage.removeItem('LOGIN');

    resetBtn.textContent = 'Zresetowano';

    setTimeout(() => {
      resetBtn.textContent = 'Resetuj';
    }, 2000);
  });
};

const getLogin = () => {
  const login = document
    .querySelector('#ctrl_container_login > td > div > div > span')
    .textContent.trim();

  localStorage.setItem('LOGIN', login);

  const ts = new Date().getTime();

  const userInfo = document.querySelector('#userInfo').textContent.trim();
  const basicData = userInfo.split(' ');

  const obj = {
    timestamp: ts,
    lastSync: `${basicData[3]} ${basicData[4]}`,
  };

  if (USER === 'student') {
    const name = basicData[7];
    obj.name = name;
  }

  const storageData = {};
  storageData.user = obj;
  localStorage.setItem('data', JSON.stringify(storageData));

  localStorage.setItem('actualAction', 'plan');
  window.location.href = URLS.plan + login;
};

const getPlan = () => {
  const storageData = JSON.parse(localStorage.getItem('data'));

  if (USER === 'parent' && !storageData.user.name) {
    const btn = document.querySelector('#f_uczen_lagel_img');
    btn.click();

    const checkExist = setInterval(() => {
      const listItems = document.querySelectorAll('.link_list_element');
      if (listItems.length) {
        clearInterval(checkExist);
        listItems.forEach(({ attributes: { key, val } }) => {
          if (key.value.length) {
            const login = key.value;
            const name = val.value.split(' ')[0];
            localStorage.setItem('LOGIN', login);

            storageData.user.name = name;
            localStorage.setItem('data', JSON.stringify(storageData));
            window.location.href = `${window.location.href}&uczen=${login}`;
          }
        });
      }
    }, 100);
  } else {
    const iframe = document.querySelector('#f_plan');

    const plan = [[], [], [], [], []];

    const rows = Array.from(
      iframe.contentWindow.document.querySelectorAll('#section > table > tbody > tr'),
    ).slice(2);

    rows.forEach((row, lessonIndex) => {
      if (lessonIndex % 2 === 0) {
        const childrens = Array.from(row.children);

        childrens.slice(1).forEach((child, dayIndex) => {
          const lesson = {
            name: '',
            hours: '',
            teacher: '',
            room: '',
          };

          if (child.innerHTML !== '') {
            const [name, hours, moreInfo] = child.innerText.split('\n');
            lesson.name = name;
            lesson.hours = hours;
            const [, teacher, room] = moreInfo.split(', ');
            lesson.teacher = teacher;
            lesson.room = room.slice(0, -1);
          }

          plan[dayIndex].push(lesson);
        });
      }
    });

    storageData.plan = plan;
    localStorage.setItem('data', JSON.stringify(storageData));
    localStorage.setItem('actualAction', 'gradesLinks');
    window.location.href = `${URLS.gradesLinks}${LOGIN}`;
  }
};

const getGradesLinks = () => {
  const rows = Array.from(document.querySelectorAll('.dataRowExport'));
  const names = [];

  rows.forEach(({ children }) => {
    const name = children[0].textContent.trim().replace(/ /g, '%20');
    names.push(name);
  });

  const storageData = JSON.parse(localStorage.getItem('data'));
  storageData.grades = [];
  localStorage.setItem('data', JSON.stringify(storageData));

  localStorage.setItem('names', JSON.stringify(names));
  localStorage.setItem('actualName', 0);
  localStorage.setItem('actualAction', 'grades');
  window.location.href = `${URLS.grades}${LOGIN}&zajecia=${names[0]}`;
};

const getGrades = () => {
  const names = JSON.parse(localStorage.getItem('names'));
  const actualName = parseFloat(localStorage.getItem('actualName'));

  const rows = Array.from(document.querySelectorAll('.dataRowExport'));
  const name = document
    .querySelector('#printHeader')
    .textContent.trim()
    .split(': ')[1];
  const data = {
    name,
    grades: [],
  };

  rows.forEach(row => {
    const grade = {};

    grade.category = row.children[0].textContent.trim();

    if (row.children[3].textContent.trim().split(' ').length > 1) {
      // Mobile
      grade.grade = row.children[1].textContent.trim();
      grade.gradeDesc = row.children[2].textContent.trim();
      grade.date = row.children[3].textContent.trim();
      grade.teacher = row.children[4].textContent.trim();
      grade.categoryDesc = row.children[5].textContent.trim();
      grade.value = row.children[6].textContent.trim();
      grade.weight = row.children[7].textContent.trim();
      grade.semester = row.children[8].textContent.trim();
      const isCounted = row.children[9].textContent.trim();
      grade.isCounted = isCounted === 'Tak';
    } else {
      // Desktop
      grade.categoryDesc = row.children[1].textContent.trim();
      grade.grade = row.children[2].textContent.trim();
      grade.gradeDesc = row.children[8].textContent.trim();
      grade.value = row.children[3].textContent.trim();
      grade.weight = row.children[4].textContent.trim();
      grade.semester = row.children[5].textContent.trim();
      const isCounted = row.children[6].textContent.trim();
      grade.isCounted = isCounted === 'Tak';
      grade.date = row.children[9].textContent.trim();
      grade.teacher = row.children[10].textContent.trim();
    }

    data.grades.push(grade);
  });

  const storageData = JSON.parse(localStorage.getItem('data'));
  storageData.grades.push(data);
  localStorage.setItem('data', JSON.stringify(storageData));

  if (names.length > actualName + 1) {
    localStorage.setItem('actualName', actualName + 1);
    window.location.href = `${URLS.grades}${LOGIN}&zajecia=${names[actualName + 1]}`;
  } else {
    localStorage.removeItem('names');
    localStorage.removeItem('actualName');
    localStorage.setItem('actualAction', 'absences');

    window.location.href = URLS.absences + LOGIN;
  }
};

const getAbsences = () => {
  const absencesList = [];
  const rows = Array.from(document.querySelectorAll('.dataRowExport'));

  rows.forEach(row => {
    const name = row.children[3].textContent.trim();
    const date = row.children[4].textContent.trim();
    const hours = row.children[5].textContent.trim();
    const absence = {
      name,
      date,
      hours,
    };

    const status = row.children[7].textContent.trim();
    if (status === 'Nieusprawiedliwione') {
      absence.isCounted = true;
      absence.status = 'unexcused';
    } else if (status === 'Wnioskowanie usprawiedliwienia przez opiekuna') {
      absence.isCounted = true;
      absence.status = 'pending';
    } else if (status === 'Zwolnienie nieliczone do frekwencji') {
      absence.isCounted = false;
      absence.status = 'notCounted';
    } else {
      absence.isCounted = false;
      absence.status = 'excused';
    }
    absencesList.push(absence);
  });
  const storageData = JSON.parse(localStorage.getItem('data'));
  storageData.absences = absencesList;
  localStorage.setItem('data', JSON.stringify(storageData));
  localStorage.setItem('actualAction', 'exams');
  window.location.href = URLS.exams + LOGIN;
};

const getExams = () => {
  const examsList = [];
  const rows = Array.from(document.querySelectorAll('.dataRowExport'));

  rows.forEach(row => {
    const category = row.children[2].textContent.trim();
    const date = row.children[9].textContent.trim().split(' ')[0];
    const name = row.children[5].textContent.trim();
    const description = row.children[6].textContent.trim();

    const exam = {
      category,
      date,
      name,
      description,
    };
    examsList.push(exam);
  });
  const storageData = JSON.parse(localStorage.getItem('data'));
  storageData.exams = examsList;
  localStorage.setItem('data', JSON.stringify(storageData));
  localStorage.setItem('actualAction', 'behaviour');
  window.location.href = URLS.behaviour;
};

const getBehaviour = () => {
  const row = document.querySelector('#gridRow_0');

  let estSemI;
  let semI;
  let estSemII;
  let semII;

  if (USER === 'parent') {
    estSemI = row.children[2].textContent.trim();
    semI = row.children[3].textContent.trim();
    estSemII = row.children[4].textContent.trim();
    semII = row.children[5].textContent.trim();
  } else {
    estSemI = row.children[0].textContent.trim();
    semI = row.children[1].textContent.trim();
    estSemII = row.children[2].textContent.trim();
    semII = row.children[3].textContent.trim();
  }

  const behaviour = {
    estSemI,
    semI,
    estSemII,
    semII,
  };
  const storageData = JSON.parse(localStorage.getItem('data'));
  storageData.behaviour = behaviour;
  localStorage.setItem('actualAction', 'firstSemPoints');
  localStorage.setItem('data', JSON.stringify(storageData));
  window.location.href = URLS.points + 1;
};

const getPoints = semester => {
  const pointsList = [];
  const rows = Array.from(document.querySelectorAll('.dataRowExport'));

  rows.forEach(row => {
    const desc = row.children[2].textContent.trim();
    const type = row.children[3].textContent.trim();
    const points = row.children[4].textContent.trim();
    const date = row.children[5].textContent.trim();
    const teacher = row.children[6].textContent.trim();
    const lesson = row.children[7].textContent.trim();
    const isCounted = row.children[8].textContent.trim() === 'Tak';

    const point = {
      desc,
      type,
      points,
      date,
      teacher,
      lesson,
      isCounted,
      semester,
    };
    pointsList.push(point);
  });

  const storageData = JSON.parse(localStorage.getItem('data'));
  if (!storageData.points) storageData.points = [];
  storageData.points.push(...pointsList);
  localStorage.setItem('data', JSON.stringify(storageData));
  if (semester === 1) {
    localStorage.setItem('actualAction', 'secondSemPoints');
    window.location.href = URLS.points + 2;
  } else finish();
};

function init() {
  if (SHOULD_START === 'true') {
    switch (ACTUAL_ACTION) {
      case 'settings':
        if (ACTUAL_URL === URLS.settings) {
          getLogin();
        }
        break;
      case 'plan':
        if (ACTUAL_URL.includes(URLS.plan)) {
          getPlan();
        }
        break;
      case 'gradesLinks':
        if (ACTUAL_URL.includes(URLS.gradesLinks)) {
          getGradesLinks();
        }
        break;
      case 'grades':
        if (ACTUAL_URL.includes(URLS.grades)) {
          getGrades();
        }
        break;
      case 'absences':
        if (ACTUAL_URL.includes(URLS.absences)) {
          getAbsences();
        }
        break;
      case 'exams':
        if (ACTUAL_URL.includes(URLS.exams)) {
          getExams();
        }
        break;
      case 'behaviour':
        if (ACTUAL_URL.includes(URLS.behaviour)) {
          getBehaviour();
        }
        break;
      case 'firstSemPoints':
        if (ACTUAL_URL.includes(URLS.points + 1)) {
          getPoints(1);
        }
        break;
      case 'secondSemPoints':
        if (ACTUAL_URL.includes(URLS.points + 2)) {
          getPoints(2);
        }
        break;
      default:
        break;
    }
  }

  if (ACTUAL_URL.includes(URLS.start)) displayButtons();
}

window.addEventListener('load', init);
