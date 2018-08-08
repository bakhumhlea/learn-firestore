import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyCOKIAZC7hte-DBJa9CQ7pnFtVfitnJB3g",
    authDomain: "learning-cloud-firestore.firebaseapp.com",
    databaseURL: "https://learning-cloud-firestore.firebaseio.com",
    projectId: "learning-cloud-firestore",
    storageBucket: "learning-cloud-firestore.appspot.com",
    messagingSenderId: "2796088347"
};

firebase.initializeApp(config);

const db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};

db.settings(settings);

export {
    db,
};