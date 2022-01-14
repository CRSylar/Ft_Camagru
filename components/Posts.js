import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, orderBy, query, where} from 'firebase/firestore';
import Post from "./Post";
import {db} from "../firebase";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

function Posts ({filter}) {

	const router = useRouter()
	const [posts, setPosts] = useState([])
	const {data: session} = useSession()

	useEffect( () => {
			if (filter) {
			return onSnapshot(
				query(collection(db, 'posts'),
					where('username', '==', filter),
					orderBy('timestamp', 'desc')),
				snapshot => {
					if (snapshot.docs.length === 0)
						router.push('/404')
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
		[db, filter]
	)

	return (
		<div>
			{
				posts.map( post => (
					<Post key={post.id}
					id={post.id}
					username={post.data().username}
					userImg={post.data().profileImg}
					userMail={post.data().email}
					img={post.data().image}
					caption={post.data().caption}
					mine={session? filter === session.user.username: false}/>
				))
			}
		</div>
	);
}

export default Posts;