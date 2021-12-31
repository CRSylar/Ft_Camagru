// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: "AIzaSyA37WwsX3h8jwjRUZV1b0ZkN_yZhU3SAiA",
	authDomain: "camagru-66982.firebaseapp.com",
	projectId: "camagru-66982",
	storageBucket: "camagru-66982.appspot.com",
	messagingSenderId: "927890026877",
	appId: "1:927890026877:web:fc69192bc7f27515571c14",
	measurementId: "G-G4NLN6F012"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const db = getFirestore()
const storage = getStorage()
const auth = getAuth()

export { app, db, storage, auth }
