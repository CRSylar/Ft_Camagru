import React, {useState} from 'react';
import {useRecoilState} from "recoil";
import {modalState} from "../atoms/modalAtom";
import Modal from "./Modal";

function RecentSnap ({recentSnap}) {

	const [open, setOpen] = useRecoilState(modalState)
	const [selection, setSelection] = useState(null)

	function chooseAndUpload (e) {
		setSelection(e.target.src)
		setOpen(true)
		console.log('poi lo faro', e.target.src)
	}

	return (
		<div className='bg-gray-100 items-center lg:flex-col flex lg:h-[85vh] h-[20vh]
						w-[100vw] flex-row md:w-auto
						overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-200'>
			<p className='font-bold text-lg text-center text-blue-400' >{'Recent Snap'}</p>
			{ recentSnap?.length > 0 &&
			recentSnap.map( snap =>
				<img className='object-contain mt-2'
				     onClick={chooseAndUpload}
				     key={snap.key} src={snap.data} alt={'recent'}/>
			)}
			<Modal selection={selection}/>
		</div>
	);
}

export default RecentSnap;