import React from 'react';
import {
	SearchIcon,
	PlusCircleIcon,
	CogIcon,
	MenuIcon,
	HomeIcon,
	LogoutIcon
} from '@heroicons/react/outline'
import { CameraIcon } from "@heroicons/react/solid";
import logoBig from '../public/Camagru.png'
import logoSm from '../public/Camagru_Small.png'
import styles from '../styles/index.module.css'
import {signIn, signOut, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {modalState} from "../atoms/modalAtom";
import Image from "next/image";

function Header () {

	const {data: session} = useSession()
	const [open, setOpen] = useRecoilState(modalState)
	const router = useRouter()

	return (
		<div className='shadow-sm border-b bg-white sticky top-0 z-50'>
			<div className={styles.header}>
				{/* Left element / LOGO */}
				<div className={styles.header__bigLogo} onClick={ () => router.push('/')}>
					<Image alt={<CameraIcon/>} src={logoBig} priority={true} layout={'fill'} className='object-contain layout-fill'/>
				</div>
				<div className={styles.header__smLogo} onClick={ () => router.push('/')}>
					<Image alt={<CameraIcon/>} src={logoSm} priority={true} layout={'fill'} className='object-contain layout-fill'/>
				</div>

				{/* Middle / SearchBox */}
				<div className='max-w-xs'>
					<div className={styles.header__searchBox}>
						<div className={styles.header_searchIcon}>
							<SearchIcon className='h-5 w-5 text-gray-500 ' />
						</div>
						<input className={styles.header__searchField}
						       type={'text'}
						       placeholder={'Search'}/>
					</div>
				</div>

				{/* Right / UI Buttons */}
				<div className={styles.header__leftElements}>
					<HomeIcon className='navBtn'
					          onClick={ () => router.push('/')} />
					<MenuIcon className='h-6 md:hidden cursor-pointer' />

					{ session? (
						<>
						<PlusCircleIcon className='navBtn'
						                onClick={() => setOpen(true)} />
							<CogIcon className='navBtn'
							         onClick={ () => router.push('/settings')} />
							<LogoutIcon className='navBtn'
							           onClick={() => signOut({redirect:false})}  />
							<img
								onClick={ () => router.push('/profile')}
								src={session?.user?.proPic}
								alt={'profile pic'} className='h-10 w-10 rounded-full cursor-pointer'/>
						</>
						)
					:
						<button onClick={signIn} >{'Sign In'}</button>
					}
				</div>

			</div>
		</div>
	);
}

export default Header;