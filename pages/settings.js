import React, {useEffect} from 'react';
import {useSession} from "next-auth/react";
import Header from "../components/Header";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import Modal from "../components/Modal";
import ProfilePic from "../components/ProfilePic";
import {auth} from "../firebase";
import {updateEmail, sendEmailVerification, updateProfile, sendPasswordResetEmail} from "firebase/auth";
import {ExclamationCircleIcon} from "@heroicons/react/solid";
import {useAlert} from "react-alert";

function Settings () {

	const alert = useAlert()
	const {data: session} = useSession()
	const router = useRouter()
	const { register, handleSubmit, reset } = useForm();
	const { register: rRegister, handleSubmit: hHandleSubmit, reset: rReset } = useForm();

	useEffect( () => {
		if (!session)
			router.push('/')
	}, [session])

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

	return (
		<div>
			{/* Header */}
			<Header/>

			{/* Profile Pic Editing */}
			<ProfilePic/>

			{/* Settings Management */}
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
			<Modal/>
		</div>
	);
}

export default Settings;