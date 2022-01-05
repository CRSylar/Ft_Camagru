import React, {useEffect, useRef} from 'react';
import Header from "../components/Header";
import styles from '../styles/Feed.module.css';
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

function Snapshot () {

	const {data: session} = useSession()
	const router = useRouter()
	const videoRef = useRef(null)
	const photoRef = useRef(null)


	useEffect( () => {
		if (!session)
			router.push('/auth/signin')
	}, [session])

	useEffect(() => {
		getVideo();
	}, [videoRef]);

	const getVideo = () => {
		navigator.mediaDevices
			.getUserMedia({video: {width: 300, height:300}})
			.then( stream => {
				let video = videoRef.current
				video.srcObject = stream
				video.play()
			})
			.catch( e => console.log('Error : ', e))
	}


	const paintToCanvas = () => {
		let video = videoRef.current;
		let photo = photoRef.current;
		let ctx = photo.getContext("2d");

		const width = 300;
		const height = 300;
		photo.width = width;
		photo.height = height;

		return setInterval(() => {
			ctx.drawImage(video, 0, 0, width, height);
		}, 50);
	};

	return (
		<div>
			<Header/>

			<div className={`${styles.feed} ${!session && "!grid-cols-1 !max-w-3xl"}`}>
			{/* Main section with camera preview */}
			{/*  <Camera />  */}
			{
				<section className='col-span-2 mt-8 flex items-center space-x-2 flex-col'>
					<video ref={videoRef}
					       className='hidden'
					       onCanPlay={paintToCanvas}/>
					<canvas ref={photoRef}/>
				</section>
			}
				<section className='hidden md:hidden lg:inline-grid md:col-span-1 border-l'>
					{/* APP bar laterale con gli snap scattati e non inviati in questa session(?) */}
					<div>
						Ciaone
					</div>
				</section>
			</div>
			{/* Footer (ma che davero? subject dice si) */}
		</div>
	);
}

export default Snapshot;