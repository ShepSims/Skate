import * as React from 'react';
import AppNavigator from './navigation/AppNavigator';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCC0hLyumMHRracJlFjHbdvVJrCAwGefU0',
	authDomain: 'letsskate-69c1f.firebaseapp.com',
	projectId: 'letsskate-69c1f',
	storageBucket: 'letsskate-69c1f.appspot.com',
	messagingSenderId: '399063142714',
	appId: '1:399063142714:web:98b953883ee63782ecc003',
	measurementId: 'G-PL2DKGSQBS',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database };

export default function App() {
	return <AppNavigator />;
}
