import React, {useEffect} from 'react';
import {useSession} from "next-auth/react";
import Header from "../components/Header";
import {useRouter} from "next/router";
import Modal from "../components/Modal";
import ProfilePic from "../components/ProfilePic";
import SettingsManager from "../components/SettingsManager";

function Settings () {

	const {data: session, status} = useSession()
	const router = useRouter()

	useEffect( () => {
		if (!session && status !== 'loading')
			router.push('/auth/singin')
	}, [session, status])

	return (
		<div className='bg-gray-50 h-screen overflow-y-scroll'>
			{/* Header */}
			<Header/>

			{/* Profile Pic Editing */}
			<ProfilePic/>

			{/* Settings Management */}
			<SettingsManager/>

			<Modal/>
		</div>
	);
}

export default Settings;