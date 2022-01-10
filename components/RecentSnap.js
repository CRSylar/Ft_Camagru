import React from 'react';

function RecentSnap ({recentSnap}) {

	function chooseAndUpload (e) {
		console.log('poi lo faro', e.target.src)
	}

	return (
		<div className='bg-gray-100 items-center flex-col flex py-2
						h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-black'>
			<p className='font-bold text-lg text-center text-blue-400' >{'Recent Snap'}</p>
			{ recentSnap?.length > 0 &&
			recentSnap.map( snap =>
				<img className='object-contain mt-2'
				     onClick={chooseAndUpload}
				     key={snap.key} src={snap.data} alt={'recent'}/>
			)}

		</div>
	);
}

export default RecentSnap;