import React, {useState} from 'react';
import {ShareIcon} from "@heroicons/react/outline";
import styles from "../styles/Menu.module.css";
import {FacebookIcon, TwitterIcon} from "react-share";
import {facebookShareLink, twitterShareLink} from "../common/Utils";

function Share ({url}) {

	const [openMenu, setOpenMenu] = useState(true)

	const uri = encodeURIComponent(url)
	const menuHandler = () => {
		setOpenMenu((openMenu) => !openMenu)
	}

	return (
		<div className='relative'>
			<ShareIcon className='h-5 cursor-pointer hover:scale-125 transition-all
        duration-150 ease-out'
			           onClick={menuHandler}/>
			<ul className={`${openMenu? 'hidden': 'block' } ${styles.menu__list}`}>
				<li className='-mt-4 mb-2'>
					<a style={{display: 'table-cell'}}
					   target={"_blank"}
					   href={`${facebookShareLink}${uri}&hashtag=%23Camagru`}>
						<FacebookIcon size={32} round />
					</a>
				</li>
				<li className='mb-1'>
				</li>
				<li className='-mb-3'>
					<a style={{display: 'table-cell'}}
					   target={"_blank"}
					   href={`${twitterShareLink}${uri}&hashtags=%23Camagru`}>
						<TwitterIcon size={32} round/>
					</a>
				</li>
			</ul>
		</div>
	);
}

export default Share;