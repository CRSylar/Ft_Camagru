import React, {useEffect, useState} from 'react';
import faker from 'faker';

function Suggestions () {

	const [suggestions, setSuggestions] = useState([])

	useEffect( () => {
		const suggestions = [...Array(5)].map( (_, i) => (
			{
				...faker.helpers.contextualCard(),
				id: i,
			}
		))

		setSuggestions(suggestions)
	}, [])

	function handleFollow (id) {
		console.log(id)
	}

	return (
		<div className='mt-4 ml-10'>
			<div className='flex justify-between text-sm mb-5'>
				<h3 className='text-sm font-bold text-gray-400'>{'Suggestions for you'}</h3>
				<button className='text-gray-600 font-semibold'>{'See All'}</button>
			</div>

			{
				suggestions.map( profile => (
					<div key={profile.id} className='flex items-center justify-between mt-3'>
						 <img className='w-10 h-10 p-[2px] border rounded-full'
						      src={`https://i.pravatar.cc/150?img=${profile.id}`}
						      alt={'profile avatar'}  />
						<div className='flex-1 ml-4'>
							<h2 className='font-semibold text-sm' >{profile.username}</h2>
							<h3 className='text-xs text-gray-400' >{`Work at ${profile.company.name}`}</h3>
						</div>
						<button className='text-blue-400 text-bold text-xs'
						        onClick={() => handleFollow(profile.username)}>
							{'Follow'}
						</button>
					</div>
				))
			}

		</div>
	);
}

export default Suggestions;