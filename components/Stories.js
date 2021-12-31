import React, {useEffect, useState} from 'react';
import faker from 'faker';
import Story from "./Story";
import styles from '../styles/Story.module.css';
import {useSession} from "next-auth/react";

function Stories() {

	const [suggestions, setSuggestions] = useState([])
	const {data: session } = useSession();


	useEffect( () => {
		const suggestions = [...Array(20)].map( (_, i) =>(
			{
				...faker.helpers.contextualCard(),
				id: i,
			}
		))

		setSuggestions(suggestions)
	}, [])

	return (
		<div className={styles.stories}>
			{ session && (
				 <Story
					 username={session?.user?.username}
					 img={session?.user?.image} />
			)}

			{suggestions.map( (profile) => (
				<Story key={profile.id} img={profile.avatar} username={profile.username}/>
			))}
		</div>
	);
}

export default Stories;