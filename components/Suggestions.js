import React, {useEffect, useState} from 'react';
import {
	doc,
	collection,
	getDocs,
	query,
	where,
	limit,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore";
import {db} from "../firebase";
import {useSession} from "next-auth/react";
import {mArrayRemove} from "../common/Utils";

function Suggestions () {

	const [suggestions, setSuggestions] = useState([])
	const [following, setFollowing] = useState([])
	const {data: session } = useSession()

	useEffect( () => {
		setFollowing(session?.user.following)
	}, [])

	useEffect( async () => {
		const suggestions = []
		const q = query(collection(db, 'users'),
			where('email', '!=', session.user.email), limit(5))
		const querySnapshot = await getDocs(q)
		querySnapshot.forEach(
			(doc) =>
				suggestions.push(doc.data())
			)
		setSuggestions(suggestions)
	}, [])

	async function handleFollow (id) {
		let q = query(collection(db, 'users'),
			where('email', '==', session.user.email))
		const querySnap = await getDocs(q)
		querySnap.forEach( doc => q = doc.id)

		if (session?.user?.following.includes(id)) {
			await updateDoc(doc(db, 'users', q), {
				following: arrayRemove(id)
			})
			session?.user?.following = mArrayRemove(session?.user?.following, id)
			await setFollowing(session?.user.following)
		}
		else {
			await updateDoc(doc(db, 'users', q), {
				following: arrayUnion(id)
			})
			session?.user?.following = [...session?.user?.following, id]
			await setFollowing(session?.user.following)
		}
	}

	return (
		<div className='mt-4 ml-10'>
			<div className='flex justify-between text-sm mb-5'>
				<h3 className='text-sm font-bold text-gray-400'>{'Suggestions for you'}</h3>
			</div>
			{
				suggestions.map( profile => (
					<div key={profile.username} className='flex items-center justify-between mt-3'>
						 <img className='w-10 h-10 p-[2px] border rounded-full'
						      src={profile.proPic}
						      alt={'profile avatar'}  />
						<div className='flex-1 ml-4'>
							<h2 className='font-semibold text-sm' >{profile.username}</h2>
							<h3 className='text-xs text-gray-400' >{`Work at ${profile.company}`}</h3>
						</div>
						<button className='text-blue-400 text-bold text-xs'
						         onClick={() => handleFollow(profile.email)}>
							{following?.includes( profile.email) ?
								'UnFollow'
							:
								'Follow'
							}
						</button>
					</div>
				))
			}
		</div>
	);
}

export default Suggestions;