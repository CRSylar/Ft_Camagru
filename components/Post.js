import React, {useEffect, useState} from 'react';
import {
	BookmarkIcon,
	EmojiHappyIcon,
	HeartIcon,
	TrashIcon
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import {useSession} from "next-auth/react";
import {
	doc,
	addDoc,
	setDoc,
	deleteDoc,
	collection,
	onSnapshot,
	query,
	orderBy,
	serverTimestamp
} from "firebase/firestore";
import {db} from "../firebase";
import styles from '../styles/Post.module.css';
import Moment from "react-moment";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
import Share from "./Share";

function Post ({id, username, userImg, userMail, img, caption, mine}) {

	const {data: session } = useSession()
	const [comment, setComment] = useState("")
	const [comments, setComments] = useState([])
	const [likes, setLikes] = useState([])
	const [hasLiked, setHasLiked] = useState(false)
	const [openConfirm, setOpenConfirm] = useState(false)

	useEffect(
		() =>
			setHasLiked(
				likes.findIndex( (like) => like.id === session?.user?.uid) !== -1
			),
		[likes]
	)

	useEffect( () =>
			onSnapshot(query(collection(db, 'posts', id, 'comments'),
				orderBy('timestamp', 'desc')),
					snapshot => setComments(snapshot.docs)),
		[db]
	)

	useEffect( () =>
		onSnapshot(collection(db, 'posts', id, 'likes'),
			snapshot => setLikes(snapshot.docs)),
		[db, id]
	)

	const likePost = async () => {
		if (hasLiked) {
			await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
		}
		else {

			await setDoc(doc(db, 'posts', id, 'likes', session.user.uid ), {
				username: session.user.username,
			})
		}
	}

	async function sendComment (e) {
		e.preventDefault()

		const commentToSend = comment;
		setComment('')

		await addDoc(collection(db, 'posts', id, 'comments'), {
			comment: commentToSend,
			username: session.user.username,
			userImg: session.user.proPic,
			timestamp: serverTimestamp()
		})
		if (userMail !== session.user.email) {
			await axios({
				url: '/api/mailer',
				method: 'post',
				headers: {'Content-type': 'application/json'},
				data: JSON.stringify({
					to: userMail,
					creatorName: username,
					username: session.user.username
				})
			})
		}
	}

	return (
		<div className='bg-white my-7 border rounded-sm'>
			 {/* Header */}
			<div className='flex items-center p-5'>
				<img
					className='rounded-full h-10 w-10 object-contain border p-1 mr-3'
					src={userImg} alt={username[0].toUpperCase()}  />
				<p className='flex-1 font-bold'>{username}</p>
				{mine && <TrashIcon className='h-5 mr-3'
				                    onClick={() => setOpenConfirm(true)} />}
				<ConfirmModal isOpen={openConfirm} setIsOpen={setOpenConfirm} id={id}/>
				{session && ( <Share url={img}/> )}
			</div>
			{/* img */}
			<img
				className='object-contain w-full'
				src={img} alt={'postImgNotFound'}  />

			{/* buttons */}
			{ session && (
				<div>
					<div className='flex justify-between px-4 pt-4'>
						<div className='flex space-x-4'>
							{
								hasLiked ?
								(
									<HeartIconFilled className='postBtn text-red-500'
									                 onClick={likePost} />
								)
									:
								(
									<HeartIcon className='postBtn'
									           onClick={likePost}  />
								)
							}
						</div>
						<BookmarkIcon className='postBtn'/>
					</div>
					{ likes.length > 0 && (
						<p className='font-bold px-4'>{likes.length} likes</p>
					)}
				</div>
			)}
			{/* caption */}
			<p className='p-5 truncate'>
				<span className='font-bold mr-1'>{username} </span>
				{caption}
			</p>

			{/* comments */}
			{ comments.length > 0 && (
				<div className={`${styles.post__comment} scrollbar-thumb-gray-200`}>
					{comments.map( comment => (
						<div key={comment.id} className='flex items-center space-x-2 mb-3'>
							<img className='h-7 rounded-full'
								src={comment.data().userImg} alt={''} />
							<p className='text-sm flex-1'>
								<span className='font-bold mr-2'>{comment.data().username}</span>
								{comment.data().comment}
							</p>
							<Moment fromNow className='pr-5 text-xs'>
								{comment.data().timestamp?.toDate()}
							</Moment>
						</div>
					))}
				</div>
			)}

			{/* inputBox */}
			{ session && (
				<form className='flex items-center p-4'>
					<EmojiHappyIcon className='h-7 '/>
					<input className='border-none flex-1 focus:ring-0 outline-none'
					       value={comment}
					       onChange={(e) => setComment(e.target.value)}
					       type={"text"}
					       placeholder={'Add a Comment...'}/>
					<button type={'submit'}
					        disabled={!comment.trim()}
					        onClick={sendComment}
					        className='font-semibold text-blue-400'>{'Post'}</button>
				</form>
			)}
		</div>
	);
}

export default Post;