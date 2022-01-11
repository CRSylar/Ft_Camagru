import React, {useEffect, useState} from 'react';
import Header from "../../components/Header";
import Posts from "../../components/Posts";
import {useSession} from "next-auth/react";
import styles from "../../styles/Feed.module.css";
import {useRouter} from "next/router";
import Modal from "../../components/Modal";

function Profile () {

	const {data: session, status} = useSession()
	const router = useRouter()
	const { pid } = router.query

	useEffect( () => {
		if (!session && status !== 'loading')
			router.push('/auth/signin')}
		,
		[session, status]
	)

	return (
		<div className='bg-gray-50 h-screen overflow-y-scroll'>
			<Header/>

			<main className={`${styles.feed} ${!session && "!grid-cols-1 !max-w-3xl"}`}>
				<section className='col-span-2'>
				<div className='font-semibold mt-5 text-center border bg-white'>
					{`${pid}\'s Posts`}
				</div>
					<Posts filter={pid}/>
				</section>
			</main>

			<Modal/>
		</div>
	);
}

export default Profile;