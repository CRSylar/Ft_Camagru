import React, {useRef, useState} from 'react';
import {CameraIcon, CheckCircleIcon} from "@heroicons/react/solid";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {storage} from "../firebase";
import {useSession} from "next-auth/react";

function ProfilePic () {

	const {data: session} = useSession()
	const filePickerRef = useRef(null)
	const [localImg, setLocalImg] = useState(null)
	const [loading, setLoading] = useState(null)

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

	return (
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
	);
}

export default ProfilePic;