import React, {useState} from 'react';
import {CogIcon, LogoutIcon, MenuIcon, PlusCircleIcon} from "@heroicons/react/outline";
import {signOut} from "next-auth/react";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {modalState} from "../atoms/modalAtom";
import styles from '../styles/Menu.module.css';

function MenuItem () {

	const [openMenu, setOpenMenu] = useState(true)
	const [open, setOpen] = useRecoilState(modalState)
	const router = useRouter()

	const menuHandler = () => {
		setOpenMenu((openMenu) => !openMenu)
	}

	return (
		<div className='relative'>
			<MenuIcon className='h-6 md:hidden cursor-pointer '
			          onClick={menuHandler}/>
			<ul className={`${openMenu? 'hidden': 'block' } ${styles.menu__list}`}>
				<li>
					<PlusCircleIcon className='w-5 -mt-3 mb-2'
						onClick={() => {
							setOpenMenu((openMenu) => !openMenu)
							setOpen(true)
						}}/>
				</li>
				<li>
					<CogIcon className='w-5 mb-2'
					         onClick={ () => router.push('/settings')}/>
				</li>
				<li>
					<LogoutIcon className='w-5 -mb-3 ml-0.5'
					            onClick={() => signOut({redirect:false})} />
				</li>
			</ul>
		</div>
	);
}
/* className='navBtn'*/
export default MenuItem;