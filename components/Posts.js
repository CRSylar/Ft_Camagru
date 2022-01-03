import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, orderBy, query, where} from 'firebase/firestore';
import Post from "./Post";
import {db} from "../firebase";

function Posts ({filter}) {

	const [posts, setPosts] = useState([])

	useEffect( () => {
		if (filter) {
			return onSnapshot(
				query(collection(db, 'posts'),
					where('username', '==', filter),
					orderBy('timestamp', 'desc')),
				snapshot => {
					setPosts(snapshot.docs)
				}
			)
		}
		else
			return onSnapshot(
				query(collection(db, 'posts'),
					orderBy('timestamp', 'desc')),
				snapshot => {
					setPosts(snapshot.docs)
				}
			)
		},
		[db]
	)

	return (
		<div>
			{
				posts.map( post => (
					<Post key={post.id}
					id={post.id}
					username={post.data().username}
					userImg={post.data().profileImg}
					img={post.data().image}
					caption={post.data().caption}
					mine={filter}/>
				))
			}
		</div>
	);
}

export default Posts;