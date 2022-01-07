import React, {useEffect, useRef, useState} from 'react';
import Header from "../components/Header";
import styles from '../styles/Feed.module.css';
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {CameraIcon} from "@heroicons/react/solid";
import Sunglas from '/public/Stickers/Sunglass.png'
import Image from "next/image";
import {constant} from "../common/Stickers";
import Sunglass from "../public/Stickers/Sunglass.png";

function Snapshot () {

	const {data: session} = useSession()
	const router = useRouter()
	const videoRef = useRef(null)
	const photoRef = useRef(null)
	const stickerRef = useRef(null)
	const testRef = useRef(null)
	const [recentSnap, setRecentSnap] = useState([])
	const [draggedItem, setDraggedItem] = useState(null)
	const [inSceneElement, setInSceneElement] = useState([])

	useEffect( () => {
		if (!session)
			router.push('/auth/signin')
	}, [session]
	)

	useEffect(() => {
		getVideo();
	}, [videoRef]
	);

	useEffect( () => {
		setRecentSnap(session?.recentSnap)
	}, [])


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
		const video = videoRef.current;
		const photo = photoRef.current;
		const stick = stickerRef.current
		const ctx = photo?.getContext("2d");
		const _ctx = stick?.getContext('2d');

		photo?.width = stick?.width = 300;
		photo?.height = stick?.height = 300;

		return setInterval((scene) => {
			ctx.drawImage(video, 0, 0, photo?.width, photo?.height);
					_ctx.rect(100, 100, 100, 100);
					_ctx.lineWidth = "6";
					_ctx.strokeStyle = "red";
					_ctx.stroke();
				//	_ctx.drawImage(scene.src, 0, 0, stick.width, stick.height)

		},30, inSceneElement);
	};

	function takeSnap () {
		const video = videoRef.current
		const canvas = testRef.current

		canvas.width = 150;
		canvas.height = 150;

		if (video && canvas) {
			const ctx = canvas.getContext('2d')
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
			const dataUrl = canvas.toDataURL('image/jpeg')
			setRecentSnap([...recentSnap, {key: Date.now(), data: dataUrl}])
			session.recentSnap.push( {key: Date.now(), data: dataUrl})
		}
	}

	function chooseAndUpload (e) {
		console.log('poi lo faro', e.target.src)
	}

	function startDragging (e) {
		const imagePos = e.target.getBoundingClientRect()
		const x = e.clientX - imagePos.left
		const y = e.clientY - imagePos.top

		setDraggedItem({
			src: document.getElementById(e.target.id),
			x,
			y,
		})
	}


	function endDragging (e) {
		e.preventDefault()

		if (draggedItem) {
			const canvas = stickerRef.current
			const canvasPos = canvas.getBoundingClientRect()

			setInSceneElement([...inSceneElement, {
				img: draggedItem.src.src,
				x: e.clientX - canvasPos.left - draggedItem.x,
				y: e.clientY - canvasPos.top - draggedItem.y,
			}])
			console.log('Sticker -> ', inSceneElement)
		}
	}

	return (
		<div className='bg-gray-50 h-screen overflow-y-scroll'>
			<Header/>

			<main className={`${styles.feed} ${!session && "!grid-cols-1 !max-w-3xl"}`}>
			{/* Main section with camera preview */}
			{/*  <Camera />  */}
				<section className='col-span-2 mt-8 flex flex-col'>
			{
				<>
					<video ref={videoRef}
					       className='hidden'
					       onPlay={paintToCanvas}/>
					<div className='relative h-[300px] items-center '>
						<canvas ref={photoRef}
						        className='absolute hidden left-2 iP7x:left-9 ip7p:left-14 top-0' />
						<canvas ref={stickerRef}
						        onDrop={endDragging}
						        onDragOver={e => e.preventDefault()}
						        className='absolute left-2 iP7x:left-9 ip7p:left-14 top-0 z-10' />
					</div>
					<div
						onClick={takeSnap}
						className='mx-auto flex mt-5 items-center justify-center h-12 w-12 rounded-full
																		bg-blue-100 cursor-pointer'  >
						<CameraIcon
							className='h-6 w-6 text-blue-600'
							aria-hidden='true'  />
					</div>

					{/* Filter Selector */}
					<div className='flex bg-white mt-8 border-y border-gray-500 overflow-x-scroll'>
						{
							Object.keys(constant.STICKERS).map( (sticker) =>
								<Image id={sticker}
								     src={constant.STICKERS[sticker]}
								     alt={'x'}
								     draggable={true}
								     onDragStart={startDragging} />)
						}
					</div>
				</>
			}
				</section>
				<section className='lg:inline-grid md:col-span-1 border-l'>
					{/* APP bar laterale con gli snap scattati e non inviati in questa session(?) */}

					<div className='bg-gray-100 items-center flex-col flex py-2
						h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-black'>
						<p className='font-bold text-lg text-center text-blue-400' >{'Recent Snap'}</p>
						{ recentSnap?.length > 0 &&
							recentSnap.map( snap =>
								<img className='object-contain mt-2'
								     onClick={chooseAndUpload}
								     key={snap.key} src={snap.data} alt={'recent'}/>
							)
						}
						<canvas ref={testRef} className='hidden'/>
					</div>

				</section>
			</main>
			{/* Footer (ma che davero? subject dice si) */}
		</div>
	);
}

export default Snapshot;