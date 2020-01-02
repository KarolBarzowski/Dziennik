export const getColor = name => {
  switch (name) {
    case 'Sprawdzian':
    case 'Test':
    case 'Praca klasowa':
    case 'unexcused':
      return 'red';
    case 'Kartkówka':
      return 'orange';
    case 'Odpowiedź ustna':
    case 'Ćwiczenie':
    case 'pending':
      return 'blue';
    case 'Aktywność':
    case 'Praca domowa':
    case 'excused':
      return 'green';
    case 'Praca pisemna/referat':
    case 'Projekt/zadanie':
    case 'Prezentacja':
      return 'purple';
    case 'notCounted':
      return 'teal';
    default:
      return 'text';
  }
};

export const getCleanName = name =>
  name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z');

export const getStatus = status => {
  switch (status) {
    case 'excused':
      return 'Usprawiedliwione';
    case 'unexcused':
      return 'Nieusprawiedliwione';
    case 'pending':
      return 'Wnioskowane';
    case 'notCounted':
      return 'Nieliczone do frekwencji';
    default:
      return '';
  }
};
