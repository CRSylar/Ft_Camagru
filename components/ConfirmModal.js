import React, {useRef, useState} from 'react';
import { Dialog } from "@headlessui/react";
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "../firebase";
import {useRouter} from "next/router";

function ConfirmModal ({isOpen, setIsOpen, id}) {

	const completeButtonRef = useRef(null)
	const router = useRouter()


	const deletePost = async () => {
		await deleteDoc(doc(db, 'posts', id))
		setIsOpen(false)
		router.reload()
	};

	return (
		<Dialog
			initialFocus={completeButtonRef}
			open={isOpen}
			onClose={() => setIsOpen(false)}
			className='fixed z-10 inset-0 overflow-y-auto'  >
			<div className="flex items-center justify-center min-h-screen">
				<Dialog.Overlay className="fixed inset-0 bg-black opacity-30"/>

				<div className="relative bg-white border border-black rounded max-w-sm mx-auto text-center">
					<Dialog.Title className='text-blue-400' >Delete Request</Dialog.Title>
					<Dialog.Description className='border-b pb-3' >
						Are you sure you want to Delete this Post ? the action is
						not reversible
					</Dialog.Description>
					<div className='text-center justify-between mb-5 mt-2'>
						<button className='text-red-500 mx-auto text-sm' ref={completeButtonRef}
						        onClick={deletePost}>
							{'Delete'}
						</button>
						<button className='mx-6 text-blue-400 text-lg'
						        onClick={() => setIsOpen(false)}>
							{'Exit'}
						</button>
					</div>
				</div>
			</div>
		</Dialog>
	)
}

export default ConfirmModal;