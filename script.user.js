// ==UserScript==
// @name         Pobieracz danych z e-dziennika
// @version      1.6
// @description  Pobiera dane z e-dziennika.
// @author       Karol
// @match        https://nasze.miasto.gdynia.pl/ed_miej/*
// @match        http://localhost:*/*
// @match        https://edziennik.netlify.com/*
// @exclude      https://nasze.miasto.gdynia.pl/ed_miej/login.pl*
// @downloadURL  https://raw.githubusercontent.com/KarolBarzowski/Dziennik/master/script.user.js
// @updateURL    https://raw.githubusercontent.com/KarolBarzowski/Dziennik/master/script.user.js
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

function init() {
  'use strict';

  const URLS = {
    grades: 'https://nasze.miasto.gdynia.pl/ed_miej/display.pl?form=ed_oceny_ucznia',
    plan: `https://nasze.miasto.gdynia.pl/ed_miej/display.pl?form=ed_plan_zajec&user=`,
    settings: 'https://nasze.miasto.gdynia.pl/ed_miej/display.pl?form=zmiana_danych',
    start: 'https://nasze.miasto.gdynia.pl/ed_miej/zest_start.pl',
    behaviour: 'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_zachowanie_ucznia.pl',
    absences:
      'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_nieobecnosci_ucznia.pl?back_url=display.pl%3Fform%3Ded_nieobecnosci_ucznia&f_g_start=0&iframe_name=zest&print_version=1&simple_mode=1&uczen_login=',
    exams:
      'https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_planowane_zadania.pl?back_url=display.pl%3Fform%3Ded_planowane_zadania&f_g_start=0&iframe_name=zest&print_version=1&simple_mode=1&uczen_login=',
  };

  const actualAction = localStorage.getItem('actualAction');
  const shouldStart = localStorage.getItem('shouldStart');

  const getGradesLinks = () => {
    let rows = Array.from(document.querySelectorAll('.dataRow'));
    let links = [];

    rows.forEach(row => {
      let href = row.children[0].children[0].href;
      links.push(href);
    });

    localStorage.setItem('gradesLinks', JSON.stringify(links));
    localStorage.setItem('actualGradesLink', 0);
    localStorage.setItem('actualAction', 'gradesData');
    GM_openInTab(links[0], { active: true });
  };

  const getGradesData = () => {
    let rows = Array.from(document.querySelectorAll('.dataRow'));
    let name = document
      .querySelector('#headerContent')
      .textContent.trim()
      .split(': ')[1];
    let data = {
      name,
      grades: [],
    };

    rows.forEach(row => {
      let grade = {};

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
        let isCounted = row.children[9].textContent.trim();
        grade.isCounted = isCounted === 'Tak' ? true : false;
      } else {
        // Desktop
        grade.categoryDesc = row.children[1].textContent.trim();
        grade.grade = row.children[2].textContent.trim();
        grade.gradeDesc = row.children[8].textContent.trim();
        grade.value = row.children[3].textContent.trim();
        grade.weight = row.children[4].textContent.trim();
        grade.semester = row.children[5].textContent.trim();
        let isCounted = row.children[6].textContent.trim();
        grade.isCounted = isCounted === 'Tak' ? true : false;
        grade.date = row.children[9].textContent.trim();
        grade.teacher = row.children[10].textContent.trim();
      }

      data.grades.push(grade);
    });

    if (data.grades.length !== 0) {
      let storageData = JSON.parse(localStorage.getItem('data'));
      storageData.grades.push(data);
      localStorage.setItem('data', JSON.stringify(storageData));

      let actualGradesLink = parseFloat(localStorage.getItem('actualGradesLink'));

      let links = JSON.parse(localStorage.getItem('gradesLinks'));

      if (links.length > actualGradesLink + 1) {
        // continue
        localStorage.setItem('actualGradesLink', actualGradesLink + 1);

        window.location.href = links[actualGradesLink + 1];
      } else {
        // no more links
        localStorage.removeItem('actualGradesLink');
        localStorage.removeItem('gradesLinks');
        localStorage.setItem('actualAction', 'userLogin');

        window.location.href = URLS.settings;
      }
    }
  };

  const getUserLogin = () => {
    let login = document
      .querySelector('#ctrl_container_login > td > div > div > span')
      .textContent.trim();
    localStorage.setItem('LOGIN', login);

    let timestamp = new Date().getTime();
    let userInfo = document.querySelector('#userInfo').textContent.trim();
    let basicData = userInfo.split(' ');
    let user = {
      timestamp,
      name: `${basicData[7]} ${basicData[8]}`,
      lastSync: `${basicData[3]} ${basicData[4]}`,
    };

    let storageData = JSON.parse(localStorage.getItem('data'));
    storageData.user = user;
    localStorage.setItem('data', JSON.stringify(storageData));
    setTimeout(() => {
      localStorage.setItem('actualAction', 'plan');
      GM_openInTab(URLS.plan + login, { active: true });
    }, 2000);
  };

  const getAbsencesData = () => {
    let absencesList = [];
    let rows = Array.from(document.querySelectorAll('.dataRowExport'));

    rows.forEach(row => {
      let name = row.children[3].textContent.trim();
      let date = row.children[4].textContent.trim();
      let absence = {
        name,
        date,
      };

      let status = row.children[7].textContent.trim();
      absence.isCounted = status === 'Nieusprawiedliwione' ? true : false;
      absencesList.push(absence);
    });
    let storageData = JSON.parse(localStorage.getItem('data'));
    storageData.absences = absencesList;
    localStorage.setItem('data', JSON.stringify(storageData));
    setTimeout(() => {
      localStorage.setItem('actualAction', 'examsData');
      GM_openInTab(URLS.exams, { active: true });
    }, 3000);
  };

  const getExamsData = () => {
    let examsList = [];
    let rows = Array.from(document.querySelectorAll('.dataRowExport'));

    rows.forEach(row => {
      let category = row.children[2].textContent.trim();
      let date = row.children[9].textContent.trim().split(' ')[0];
      let name = row.children[5].textContent.trim();
      let description = row.children[6].textContent.trim();

      let exam = {
        category,
        date,
        name,
        description,
      };
      examsList.push(exam);
    });
    let storageData = JSON.parse(localStorage.getItem('data'));
    storageData.exams = examsList;
    localStorage.setItem('data', JSON.stringify(storageData));
    setTimeout(() => {
      localStorage.setItem('actualAction', 'finish');
      GM_openInTab(URLS.start, { active: true });
    }, 3000);
  };

  const getBehaviourData = () => {
    let row = document.querySelector('#gridRow_0');
    let behaviour = {
      estSemI: row.children[0].textContent.trim(),
      semI: row.children[1].textContent.trim(),
      estSemII: row.children[2].textContent.trim(),
      semII: row.children[3].textContent.trim(),
    };
    let storageData = JSON.parse(localStorage.getItem('data'));
    storageData.behaviour = behaviour;
    localStorage.setItem('data', JSON.stringify(storageData));
    setTimeout(() => {
      localStorage.setItem('actualAction', 'absencesData');
      GM_openInTab(URLS.absences, { active: true });
    }, 3000);
  };

  const getPlan = () => {
    let plan = [[], [], [], [], []];

    let rows = Array.from(document.querySelectorAll('#section > table > tbody > tr')).slice(2);

    rows.forEach((row, lessonIndex) => {
      if (lessonIndex % 2 === 0) {
        let childrens = Array.from(row.children);

        childrens.slice(1).forEach((child, dayIndex) => {
          let lesson = {
            name: '',
            hours: '',
            teacher: '',
            room: '',
          };

          if (child.innerHTML != '') {
            let info = child.innerText.split('\n');
            lesson.name = info[0];
            lesson.hours = info[1];
            let moreInfo = info[2].split(', ');
            lesson.teacher = moreInfo[1];
            lesson.room = moreInfo[2].slice(0, -1);
          }

          plan[dayIndex].push(lesson);
        });
      }
    });

    let storageData = JSON.parse(localStorage.getItem('data'));
    storageData.plan = plan;
    localStorage.setItem('data', JSON.stringify(storageData));
    localStorage.setItem('actualAction', 'behaviourData');
    GM_openInTab(URLS.behaviour, { active: true });
  };

  if (document.title === 'Ogłoszenia') {
    const body = document.querySelector('body');

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
    body.appendChild(box);

    const readyBtn = document.querySelector('#readyBtn');
    const resetBtn = document.querySelector('#resetBtn');

    readyBtn.addEventListener('click', e => {
      localStorage.setItem('actualAction', 'gradesLinks');
      localStorage.setItem('shouldStart', 'true');
      let data = {
        grades: [],
      };
      localStorage.setItem('data', JSON.stringify(data));
      e.target.disabled = true;
      e.target.textContent = 'Pobieranie';
      window.location.href = URLS.grades;
    });

    resetBtn.addEventListener('click', e => {
      localStorage.removeItem('shouldStart');
      localStorage.removeItem('actualAction');
      localStorage.removeItem('data');
      localStorage.removeItem('gradesLinks');
      localStorage.removeItem('actualGradesLink');
      localStorage.removeItem('LOGIN');
      resetBtn.textContent = 'Zresetowano';
    });
  }

  if (document.title === 'E-dziennik') {
    const dataToExport = GM_getValue('data', null);
    const storageData = localStorage.getItem('data');
    const parsedStorageData = JSON.parse(storageData);
    if (dataToExport !== null && storageData === null) {
      // after 1st sync
      localStorage.setItem('data', JSON.stringify(dataToExport));
      const content = document.querySelector('#tutorial');
      content.innerHTML = `
<h1>Udało Ci się zsynchronizować dane!</h1>
<br />
<h3>Odśwież tę stronę, otworzy się aplikacja.</h3>
`;
    } else {
      if (parsedStorageData.user.timestamp < dataToExport.user.timestamp) {
        // sync
        localStorage.setItem('data', JSON.stringify(dataToExport));
        GM_addStyle(`
.scrim {
position: fixed;
top: 0;
left: 0;
display: flex;
justify-content: center;
align-items: center;
min-height: 100vh;
max-height: 100vh;
width: 100%;
background-color: rgba(0, 0, 0, 0.32);
z-index: 99;
}

.dialog {
padding: 25px;
background-color: white;
border-radius: 10px;
box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
}

.dialog__text {
font-size: 16px;
}

.dialog__button {
padding: 4px 8px;
margin-top: 15px;
border: 1px solid silver;
border-radius: 5px;
background: white;
font-size: 16px;
cursor: pointer;
}

.dialog__button:hover {
background: rgba(0, 0, 0, .04);
}

`);
        const dialog = document.createElement('div');
        dialog.innerHTML = `
<div class="scrim">
  <div class="dialog">
    <p class="dialog__text">Aby ukończyć synchronizację, odśwież tę stronę.</p>
    <button type="button" class="dialog__button" onClick="window.location.reload()">Odśwież</button>
  </div>
</div>
`;
        document.body.appendChild(dialog);
      }
    }
  }

  if (shouldStart === 'true') {
    switch (actualAction) {
      case 'gradesLinks':
        if (window.frameElement) {
          getGradesLinks();
        }
        break;

      case 'gradesData':
        getGradesData();
        break;

      case 'userLogin':
        getUserLogin();
        break;
      case 'plan':
        if (window.frameElement) {
          getPlan();
        }
        break;
      case 'absencesData':
        getAbsencesData();
        break;
      case 'examsData':
        getExamsData();
        break;
      case 'behaviourData':
        getBehaviourData();
        break;
      case 'finish': {
        localStorage.removeItem('shouldStart');
        localStorage.removeItem('actualAction');
        localStorage.removeItem('LOGIN');
        let data = localStorage.getItem('data');
        GM_setValue('data', JSON.parse(data));
        localStorage.removeItem('data');
        document.body.innerHTML =
          '<h1>Sukces!</h1><h2>Możesz zamknąć wszystkie karty e-dziennika.</h2>';
        break;
      }
      default:
        break;
    }
  }
}

window.addEventListener('load', init);
