import React, {useState} from 'react';
import {CogIcon, LogoutIcon, MenuIcon, PlusCircleIcon} from "@heroicons/react/outline";
import {signOut} from "next-auth/react";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {modalState} from "../atoms/modalAtom";

function MenuItem () {

	const [openMenu, setOpenMenu] = useState(true)
	const [open, setOpen] = useRecoilState(modalState)
	const router = useRouter()

	const menuHandler = () => {
		setOpenMenu((openMenu) => !openMenu)
	}

	return (
		<div>
			<MenuIcon className='h-6 md:hidden cursor-pointer '
			          onClick={menuHandler}/>
			<ul className={`${openMenu? 'hidden': 'block' } border border-gray-300 rounded-lg`}>
				<li className='my-2'>
					<PlusCircleIcon onClick={() => setOpen(true)}/>
				</li>
				<li className='my-2'>
					<CogIcon onClick={ () => router.push('/settings')}/>
				</li>
				<li className='my-2'>
					<LogoutIcon onClick={() => signOut({redirect:false})} />
				</li>
			</ul>
		</div>
	);
}
/* className='navBtn'*/
export default MenuItem;