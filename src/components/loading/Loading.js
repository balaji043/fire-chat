import React from 'react';
import logo from './../../images/logo.svg';
import './Loading.css';

function Loading() {
	return (
		<div className='Loader'>
			<header className='Loader-header'>
				<img src={logo} className='App-logo' alt='logo' />
			</header>
		</div>
	);
}

export { Loading };
