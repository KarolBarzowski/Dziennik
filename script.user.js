// ==UserScript==
// @name         Pobieracz danych z e-dziennika
// @version      3.0.0
// @description  Synchronizuje e-dziennik szkolny z aplikacją.
// @author       https://edziennik.netlify.app
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

const { localStorage } = window;

const SCRIPT_VERSION = '3.0.0';
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
  planContent:
    'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_plan_zajec.pl?weekend=0&print_version=1&uczen=',
};

if (
  window.location.href.includes('https://edziennik.netlify.com/') ||
  window.location.href.includes('https://edziennik.netlify.app/')
) {
  const dataToExport = GM_getValue('data', null);
  const storageData = localStorage.getItem('data');
  const parsedStorageData = JSON.parse(storageData);
  const isUpdate = GM_getValue('isUpdated', false);

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
  } else if (isUpdate) {
    GM_setValue('isUpdated', false);
    localStorage.setItem('isNotSynced', true);
    window.location.reload();
  }
}

const finish = () => {
  const data = localStorage.getItem('data');
  GM_setValue('data', JSON.parse(data));
  GM_setValue('isUpdated', false);

  localStorage.clear();

  window.location.href = 'https://edziennik.netlify.app';
};

const displayButtons = () => {
  const { href } = window.location;

  const isAutoSync = new URL(href).searchParams.get('autoSync') === 'true';

  if (isAutoSync) {
    localStorage.clear();
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
  `);

  const box = document.createElement('div');
  box.innerHTML = `
  <button type="button" id="readyBtn">Synchronizuj</button>
  `;
  box.classList.add('box');
  document.body.appendChild(box);

  const readyBtn = document.querySelector('#readyBtn');

  readyBtn.addEventListener('click', e => {
    localStorage.clear();
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

  const data = GM_getValue('data', null);

  if (data) {
    const {
      user: { lastSync },
    } = data;

    if (lastSync === obj.lastSync) {
      GM_setValue('isUpdated', true);

      localStorage.clear();

      window.location.href = 'https://edziennik.netlify.app';
      return;
    }
  }

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
    const btn = document.querySelector('#f_daty_lagel_img');
    btn.click();

    const checkExist = setInterval(() => {
      const listItems = document
        .querySelector('#f_daty_list')
        .querySelectorAll('.link_list_element');

      if (listItems.length) {
        clearInterval(checkExist);
        listItems.forEach(({ attributes: { key } }, i) => {
          const { value } = key;

          if (value) {
            localStorage.setItem(`day-${i}`, value);
          }
        });
      }

      const date = localStorage.getItem('day-1');

      localStorage.setItem('actualAction', 'planContent');
      localStorage.setItem('currentDay', 0);
      window.location.href = `${URLS.planContent}${LOGIN}&daty=${date}`;
    }, 100);
  }
};

const getPlanContent = () => {
  const storageData = JSON.parse(localStorage.getItem('data'));
  const currentIndex = JSON.parse(localStorage.getItem('currentDay'));

  let plan;

  if (storageData.plan) {
    plan = storageData.plan;
  } else {
    plan = [[], []];
  }

  const content = Array.from(document.querySelectorAll('#printContent > table > tbody > tr'));

  content.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      // get day names with dates
      const headers = Array.from(row.querySelectorAll('th'));

      headers.forEach(header => {
        plan[currentIndex].push({
          title: header.textContent,
          plan: [],
        });
      });
    } else if (row.children.length) {
      // get rows with content
      const items = Array.from(row.children);

      let lesson;

      items.forEach((item, itemIndex) => {
        if (itemIndex !== 0 && item.children.length) {
          const [name, hours, rest] = item.innerText.split('\n');
          let [class_, teacher, room] = rest.split(', ');

          [, class_] = class_.split('(');
          [room] = room.split(')');

          lesson = {
            name,
            hours,
            class: class_,
            teacher,
            room,
          };

          plan[currentIndex][itemIndex - 1].plan.push(lesson);
        }
      });
    }
  });

  storageData.plan = plan;
  localStorage.setItem('data', JSON.stringify(storageData));

  if (currentIndex === 0) {
    localStorage.setItem('currentDay', 1);
    const date = localStorage.getItem('day-2');
    window.location.href = `${URLS.planContent}${LOGIN}&daty=${date}`;
  } else {
    localStorage.removeItem('day-1');
    localStorage.removeItem('day-2');
    localStorage.removeItem('currentDay');
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

  if (data.name !== 'undefined') {
    storageData.grades.push(data);
  }

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
      case 'planContent':
        if (ACTUAL_URL.includes(URLS.planContent)) {
          getPlanContent();
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
