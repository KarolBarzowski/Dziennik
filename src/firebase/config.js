import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAPybQ5Zimf3eBe3mSf5nMYEJzhoTrP9W8',
  authDomain: 'e-dziennik-e881d.firebaseapp.com',
  databaseURL: 'https://e-dziennik-e881d.firebaseio.com',
  projectId: 'e-dziennik-e881d',
  storageBucket: 'e-dziennik-e881d.appspot.com',
  messagingSenderId: '267988607150',
  appId: '1:267988607150:web:2b82e14385397385dccd3f',
  measurementId: 'G-24MV7MT1Q1',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
