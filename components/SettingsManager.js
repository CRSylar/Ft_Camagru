import React, {useEffect, useState} from 'react';
import {ExclamationCircleIcon} from "@heroicons/react/solid";
import {auth, db} from "../firebase";
import {sendEmailVerification, sendPasswordResetEmail, updateEmail, updateProfile} from "firebase/auth";
import {useAlert} from "react-alert";
import {useSession} from "next-auth/react";
import {useForm} from "react-hook-form";
import { Switch } from '@headlessui/react'
import {collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";

function SettingsManager () {

	const alert = useAlert()
	const {data: session} = useSession()
	const { register, handleSubmit, reset } = useForm();
	const { register: rRegister, handleSubmit: hHandleSubmit, reset: rReset } = useForm();
	const [ enabled, setEnabled ] = useState(false)

	useEffect( () =>
		setEnabled(session.user.notification)
	, [])

	async function onSubmitMail ({email}) {
		if (auth.currentUser) {
			await updateEmail(auth.currentUser, email)
				.then ( () => sendEmailVerification(auth.currentUser))
		}
		reset()
	}

	async function onSubmitName ({username}) {
		if (auth.currentUser) {
			session.user.username = username
			await updateProfile(auth.currentUser, {
				displayName: username,
			})
		}
		rReset()
	}

	async function resetPassword () {
		if (auth.currentUser) {
			sendPasswordResetEmail(auth, session.user.email )
				.then( () => alert.show('Email Sent!',{ type:'success'}))
		}
	}

	async function toggleNotification () {
		let q = query(collection(db, 'users'),
			where('email', '==', session.user.email))
		const querySnap = await getDocs(q)
		querySnap.forEach( doc => q = doc.id)
		await updateDoc(doc(db, 'users', q), {
			notification: !enabled
		})
		setEnabled( (e) => !e )
	}

	return (
		<div>
			<div className='mt-10'>
				<form className='mt-1 flex flex-col max-w-xs mx-auto'
				      onSubmit={handleSubmit(onSubmitMail)}>
					<div className='mx-auto'>
						<input className='mt-2 rounded-lg' type="email" placeholder="Email" {...register("email", {required: true})} />
						<button className='h-[42px] mx-1 border bg-blue-400 text-white px-1 rounded-lg'
						        type={'submit'}> Change </button>
						<div className='flex flex-row items-center'>
							<ExclamationCircleIcon className='h-6 w-6 text-orange-600 mr-2'/>
							<span className='text-sm text-orange-600'>{'Remember to verify the new Email !'}</span>
						</div>
					</div>
				</form>
				<form className='mt-1 flex flex-col max-w-xs mx-auto'
				      onSubmit={hHandleSubmit(onSubmitName)}>
					<div className='mx-auto'>
						<input className='mt-2 rounded-lg' type="text" placeholder="Username" {...rRegister("username", {required: true})} />
						<button className='h-[42px] mx-1 border bg-blue-400 text-white px-1 rounded-lg'
						        type={'submit'}> Change </button>
					</div>
				</form>
			</div>

			<div className='mt-14 mx-auto max-w-xs flex flex-col px-6'>
				<button className='border h-[42px] bg-blue-400 text-white rounded-lg'
				        onClick={resetPassword}>
					{'Send Reset Password Mail'}
				</button>
			</div>
			<div className='mt-10 items-center flex flex-col mx-auto max-w-xs'>
				<div className='border rounded-lg bg-blue-400 mb-3 text-white px-4'>{'Email Notifications ?'}</div>
				<Switch checked={enabled}
				        onChange={toggleNotification}
				        className={`${enabled? 'bg-blue-400' : 'bg-gray-200'} 
			          relative inline-flex items-center h-6 rounded-full w-11`}
				>
					<span className='sr-only'>{'Email Notification ?'}</span>
					<span className={`${enabled? 'translate-x-6' : 'translate-x-1'}
								inline-block w-4 h-4 transform bg-white rounded-full`}/>
				</Switch>
			</div>
		</div>
	);
}

export default SettingsManager;