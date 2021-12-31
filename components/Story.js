import React from 'react';
import styles from '../styles/Story.module.css';

function Story ({img, username}) {
	return (
		<div>
			<img className={styles.stories__element}
				src={img} alt={'userPropic'} />
			<p className='text-xs w-14 truncate text-center'>{username}</p>
		</div>
	);
}

export default Story;