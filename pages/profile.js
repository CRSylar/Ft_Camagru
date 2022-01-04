import React, {useEffect} from 'react';
import Header from "../components/Header";
import Posts from "../components/Posts";
import {useSession} from "next-auth/react";
import styles from "../styles/Feed.module.css";
import {useRouter} from "next/router";
import Modal from "../components/Modal";

function Profile () {

	const {data: session} = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!session)
			router.push('/')}
		,
		[session]
	)

	return (
		<div className='bg-gray-50 h-screen overflow-y-scroll'>
			<Header/>

			<main className={`${styles.feed} ${!session && "!grid-cols-1 !max-w-3xl"}`}>
				<section className='col-span-2'>
					<Posts filter={session?.user.username}/>
				</section>
			</main>

			<Modal/>
		</div>
	);
}

export default Profile;