import React, {useEffect, useRef, useState} from 'react';
import Header from "../components/Header";
import styles from '../styles/Feed.module.css';
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {CameraIcon} from "@heroicons/react/solid";
import Image from "next/image";
import {constant} from "../common/Stickers";
import SnapSticker from "../components/SnapSticker";
import RecentSnap from "../components/RecentSnap";

function Snapshot () {

	const {data: session} = useSession()
	const router = useRouter()
	const testRef = useRef(null)
	const [recentSnap, setRecentSnap] = useState([])

	useEffect( () => {
		if (!session)
			router.push('/auth/signin')
	}, [session]
	)

	useEffect( () => {
		setRecentSnap(session?.recentSnap)
	}, [])

	return (
		<div className='bg-gray-50 h-screen overflow-y-scroll'>
			<Header/>

			<main className={`${styles.feed} ${!session && "!grid-cols-1 !max-w-3xl"}`}>
				<section className='col-span-2 mt-8 flex flex-col'>
					{/* Main section with camera preview */}
					<SnapSticker recent={recentSnap} setRecent={setRecentSnap}/>
				</section>
				<section className='lg:inline-grid md:col-span-1 border-l ml-10'>
					{/* APP bar laterale con gli snap scattati e non inviati in questa session(?) */}
					<RecentSnap recentSnap={recentSnap} />
				</section>
			</main>
			{/* Footer (ma che davero? subject dice si) */}
		</div>
	);
}

export default Snapshot;