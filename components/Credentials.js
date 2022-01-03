import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { InformationCircleIcon } from "@heroicons/react/outline";
import { Transition } from "@headlessui/react";
import styles from '../styles/index.module.css';
import {
	createUserWithEmailAndPassword,
	signOut,
	sendEmailVerification,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import {auth} from "../firebase";
import {signIn} from "next-auth/react";


/*
* signInWithEmailAndPassword(auth, data.email, data.password)
			.then( userCredential => {
				if (!userCredential.user.emailVerified)
					signOut(auth)
			})
			.catch(e => alert(e.message))
* */

function Credentials ({firstTime, setFirstTime, csrfToken}) {

	const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

	const { register, handleSubmit, reset, formState: { errors } } = useForm();
	const [open, setOpen] = useState(false)

	const onSubmit = data => {
		if (data.username !== undefined)
			onSignUp(data)
		else
			onSignIn(data)
	};

	const onSignIn = async (data) => {

		const res = await signIn('Credentials', {
			redirect: false,
			email: data.email,
			password: data.password,
			callbackUrl: `${window.location.origin}`,
		})
		if (res?.error)
			console.log('Error => ', res.error)
		else
			console.log('ok, full res => ',res)
		reset()
	}

	const onSignUp = (data) => {
		createUserWithEmailAndPassword(auth, data.email, data.password)
			.then( userCredential => {
				if (!userCredential.user.emailVerified) {
					if (data.username)
						updateProfile(userCredential.user, {
							displayName: data.username
						})
					else
						updateProfile(userCredential.user, {
							displayName: data.email.split('@')[0]
						})
					sendEmailVerification(auth.currentUser)
						.then( () => alert('Verification Email Sended!') )
				}
			})
			.catch(e => alert(e.message))

		reset()
	}

	return (
		<div>
				<Transition
					className='border max-w-[100px] mt-15 mr-3 bg-blue-300 text-sm'
					show={open}
					enter="transition-opacity duration-100"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-75"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					{'Strong Password is at Least : 8 characters, 1 Capital, 1 Symbol, 1 Number'}
				</Transition>
			<form
				className='mt-1 flex flex-col max-w-xs'
				onSubmit={handleSubmit(onSubmit)}>
				{
					firstTime &&
					<input className='mt-2 rounded-lg' type="text" placeholder="Username" {...register("username", {})} />
				}
				<input name="csrfToken" type="hidden" defaultValue={csrfToken} {...register('token')} />
				<input className='mt-2 rounded-lg' type="email" placeholder="Email" {...register("email", {required: true})} />
				<div className='max-w-xs flex flex-row'>
					<div className='mt-1 relative'>
						<div className='absolute inset-y-0 pl-3 flex items-center'>
							<InformationCircleIcon
								className='h-5 w-5 mt-2 text-gray-500 hover:text-blue-500'
								onClick={ () => setOpen( (open) => !open)}
							/>
						</div>
						<input className={styles.sing__passField} type="password" placeholder="Password"
						       {...register("password", {required: 'Password is required',
							       pattern: { value: strongRegex,
								       message: 'Something Wrong, please check'
						       }})}/>
					</div>
				</div>
						{errors.password && (<p className={styles.errorMsg}>{errors.password.message}</p>)}
				<button type="submit" className='my-4 text-white h-10 bg-blue-500 rounded-lg'>
					{firstTime ? 'SignUp' : 'Sign In'}
				</button>
			</form>
			<p className='mt-5 text-blue-400'
			   onClick={() => setFirstTime( firstTime => !firstTime)}>
				{firstTime ? 'Already Registered? SignIn' : 'First Time? SignUp'}
			</p>
		</div>
	);
}

export default Credentials;


