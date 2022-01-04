import {Fragment, useRef, useState} from 'react';
import {useRecoilState} from "recoil";
import {modalState} from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import styles from '../styles/Modal.module.css'
import {CameraIcon} from "@heroicons/react/solid";
import {db, storage} from "../firebase";
import {addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import {useSession} from "next-auth/react";
import { ref, getDownloadURL, uploadString} from 'firebase/storage';

function Modal () {

	const {data: session} = useSession()
	const [selectedFile, setSelectedFile] = useState(null)
	const [open, setOpen] = useRecoilState(modalState)
	const [loading, setLoading] = useState(null)
	const filePickerRef = useRef(null)
	const captionRef = useRef(null)

	const uploadPost = async () => {
		if (loading) return

		setLoading(true)

		const docRef = await addDoc(collection(db, 'posts'), {
			username: session.user.username,
			email: session.user.email,
			caption: captionRef.current.value,
			profileImg: session.user.proPic,
			timestamp: serverTimestamp()
		})

		const imageRef = ref(storage, `posts/${docRef.id}/image`)

		await uploadString(imageRef, selectedFile, "data_url")
			.then( async snapshot => {
				const downloadUrl =  await getDownloadURL(imageRef)
				await updateDoc( doc(db, 'posts', docRef.id), {
					image: downloadUrl
				})
			})

		setOpen(false)
		setLoading(false)
		setSelectedFile(null)
	}

	const addImageToPost = (e) => {
		const reader = new FileReader()
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0])
		}

		reader.onload = (readerEvent) => {
			setSelectedFile(readerEvent.target.result)
		}
	}

	return (
		<Transition.Root show={open} >
			<Dialog as={'div'}
			        className='fixed z-10 inset-0 overflow-y-auto'
			        onClose={setOpen}  >
				<div className={styles.modal__root}>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'>
						<Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
					</Transition.Child>

					<span className='hidden sm:inline-block sm:align-middle sm:h-screen'
					      aria-hidden='true'>
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						enterTo='opacity-100 translate-y-0 sm:scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 translate-y-0 sm:scale-100'
						leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'  >
						<div className={styles.modal__child}>
							<div>
								{
									selectedFile ?
										(
											<img
												src={selectedFile}
												alt={''}
												onClick={ () => setSelectedFile(null)}
												className='w-full object-contain cursor-pointer'
											/>
										)
										:
										(
											<div
												onClick={() => filePickerRef.current.click()}
												className='mx-auto flex items-center justify-center h-12 w-12 rounded-full
																		bg-red-100 cursor-pointer'  >
												<CameraIcon
													className='h-6 w-6 text-red-600'
													aria-hidden='true'  />
											</div>
										)
								}
								<div>
									<div className='mt-3 text-center sm:mt-5'>
										<Dialog.Title
											as={'h3'}
											className='text-lg leading-6 font-medium text-gray-900'>
											{'Upload a Photo'}
										</Dialog.Title>
										<div>
											<input
												ref={filePickerRef}
												type={'file'}
												hidden
												onChange={addImageToPost}
											/>
										</div>
										<div className='mt-2'>
											<input
												className='border-none focus:ring-0 w-full text-center'
												type={"text"}
												ref={captionRef}
												placeholder={'Enter a Caption...'}
											/>
										</div>
									</div>
								</div>

								<div className='mt-5 sm:mt-6'>
									<button
										type={'button'}
										disabled={!selectedFile}
										className={styles.modal__button}
										onClick={uploadPost}
									>
										{loading? 'Uploading...' : 'Upload Post'}
									</button>
								</div>
							</div>
						</div>

					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

export default Modal;