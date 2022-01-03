import React, {useEffect, useRef, useState} from 'react';
import {useSession} from "next-auth/react";
import Header from "../components/Header";
import {CameraIcon} from "@heroicons/react/solid";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {auth, db, storage} from "../firebase";
import {doc, updateDoc} from "firebase/firestore";
import {updateProfile} from "firebase/auth";
import {useRouter} from "next/router";

function Settings () {

	const {data: session} = useSession()
	const router = useRouter()
	const filePickerRef = useRef(null)
	const [localImg, setLocalImg] = useState(null)

	const addImageToPost = async (e) => {
		const reader = new FileReader()
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0])
		}

		reader.onload = (readerEvent) => {
			setLocalImg(readerEvent.target.result)
		}

		const imageRef = ref(storage, `profilePic/${session.user.username}/image`)

		await uploadString(imageRef, localImg, "data_url")
			.then( async snapshot => {
				const downloadUrl =  await getDownloadURL(imageRef)
				if (auth.currentUser) {
					updateProfile(auth.currentUser, {
						photoURL: downloadUrl
					})
				}
			})
	}

	useEffect( () => {
		if (!session)
			router.push('/')
	}, [session])

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
						      src={session?.user?.image} alt={localImg}/>
					)}
				</div>
				<div
					onClick={() => filePickerRef.current.click()}
					className='mx-auto flex items-center justify-center h-12 w-12 rounded-full
																		bg-red-100 cursor-pointer'  >
					<CameraIcon
						className='h-6 w-6 text-red-600'
						aria-hidden='true'  />
					<div>
						<input
							ref={filePickerRef}
							type={'file'}
							hidden
							onChange={addImageToPost}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Settings;