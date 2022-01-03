import React, {useEffect, useRef, useState} from 'react';
import {useSession} from "next-auth/react";
import Header from "../components/Header";
import {CameraIcon, CheckCircleIcon} from "@heroicons/react/solid";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {storage} from "../firebase";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import Modal from "../components/Modal";

function Settings () {

	const {data: session} = useSession()
	const router = useRouter()
	const filePickerRef = useRef(null)
	const [localImg, setLocalImg] = useState(null)
	const [loading, setLoading] = useState(null)
	const { register, handleSubmit, reset } = useForm();
	const { register: rRegister, handleSubmit: hHandleSubmit, reset: rReset } = useForm();


	const addImageToPost = (e) => {

		const reader = new FileReader()
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0])
		}

		reader.onload = async (readerEvent) => {
			setLocalImg(readerEvent.target.result)
		}
	}

	const postProPic = async () => {
		if (loading) return

		setLoading(true)
		const imageRef = ref(storage, `profilePic/${session.user.username}/image`)

		await uploadString(imageRef, localImg, "data_url")
			.then( async snapshot => {
				session.user.image = await getDownloadURL(imageRef)

				setLocalImg(null)
			})
	}

	useEffect( () => {
		if (!session)
			router.push('/')
	}, [session])

	function onSubmitMail (data) {
		console.log(data)
	}

	function onSubmitName (data) {
		console.log(data)
	}

	return (
		<div>
			<Header/>
			<div>
				<div className='my-7'>
					{localImg ?
						(<img className='h-40 w-40 rounded-full mx-auto'
						      src={localImg} alt={'x'}/>)
							:
						(<img className='h-40 w-40 rounded-full mx-auto'
						      src={session?.user?.image} alt={'x'}/>
					)}
				</div>
				{ localImg?
					( <div
						onClick={postProPic}
						className='mx-auto flex items-center justify-center h-12 w-12 rounded-full
																		bg-green-100 cursor-pointer'>
						<CheckCircleIcon className='h-6 w-6 text-green-600'
						                 aria-hidden='true'/>
					</div>)
						:
					(<div
					onClick={() => filePickerRef.current.click()}
					className='mx-auto flex items-center justify-center h-12 w-12 rounded-full
																		bg-red-100 cursor-pointer'>
					<CameraIcon
						className='h-6 w-6 text-red-600'
						aria-hidden='true'/>
					<div>
						<input
							ref={filePickerRef}
							type={'file'}
							hidden
							onChange={addImageToPost}
						/>
					</div>
				</div>)}
			</div>
				<div className='mt-10'>
					<form className='mt-1 flex flex-col max-w-xs mx-auto'
					      onSubmit={handleSubmit(onSubmitMail)}>
						<div>
							<input className='mt-2 rounded-lg' type="email" placeholder="Email" {...register("email", {required: true})} />
							<button className='h-[42px] mx-1 border bg-blue-400 text-white px-1 rounded-lg'
							type={'submit'}> Change </button>
						</div>
					</form>
					<form className='mt-1 flex flex-col max-w-xs mx-auto'
					      onSubmit={hHandleSubmit(onSubmitName)}>
						<div>
							<input className='mt-2 rounded-lg' type="text" placeholder="Username" {...rRegister("username", {required: true})} />
							<button className='h-[42px] mx-1 border bg-blue-400 text-white px-1 rounded-lg'
							        type={'submit'}> Change </button>
						</div>
					</form>

				</div>

			<Modal/>
		</div>
	);
}

export default Settings;