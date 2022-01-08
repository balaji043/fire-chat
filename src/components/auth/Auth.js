import {
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
} from '@material-ui/core';
import firebase from 'firebase';
import React from 'react';
import GoogleButton from 'react-google-button';
import { firestoreInstance } from '../../configs/Firebase.config';
import classes from './Auth.module.css';

export default function Auth() {
	const signInUser = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		const data = await firebase.auth().signInWithPopup(provider);
		const user = data.user;
		if (user) {
			if (data.additionalUserInfo.isNewUser) {
				await firestoreInstance.collection(`users`).doc(user.uid).set({
					id: user.uid,
					displayName: user.displayName,
					photoURL: user.photoURL,
					email: user.email,
					chats: [],
				});
			} else {
				const changedUserData = {};
				const userSnapshot = await firestoreInstance
					.collection(`users`)
					.doc(data.user.uid)
					.get();
				const dbUserData = userSnapshot.data();
				let isChanged = false;

				if (dbUserData.displayName !== user.displayName) {
					isChanged = true;
					changedUserData.displayName = user.displayName;
				}
				if (dbUserData.photoURL !== user.photoURL) {
					isChanged = true;
					changedUserData.photoURL = user.photoURL;
				}

				if (isChanged) {
					await firestoreInstance
						.collection(`users`)
						.doc(user.uid)
						.set(changedUserData, {
							merge: true,
						});
				}
			}
		}
	};
	return (
		<div className={classes.root}>
			<div className={`${classes.container} ${classes.leftItem}`}>
				<h1>
					Welcome to <strong className={`${classes.appName}`}>Fire chat</strong>
				</h1>
				<GoogleButton onClick={() => signInUser()} />
			</div>
			<div className={`${classes.container} ${classes.rightItem}`}>
				<h1>Created using</h1>
				<List>
					{techStacks.map((element, i) => (
						<ListItem
							key={i}
							button
							onClick={() => {
								window.open(element.url);
							}}
						>
							<ListItemAvatar>
								<Avatar alt='' src={element.imageURL} />
							</ListItemAvatar>
							<ListItemText>{element.name}</ListItemText>
						</ListItem>
					))}
				</List>
			</div>
		</div>
	);
}

const techStacks = [
	{
		name: 'React',
		imageURL: 'https://media.graphcms.com/nwDDmXIpQy2CsuKY0jmA',
		url: 'https://reactjs.org/',
	},
	{
		name: 'Material UI',
		imageURL: 'https://media.graphcms.com/FRII0p1Qoq300Ht56aoh',
		url: 'https://material-ui.com/',
	},
	{
		name: 'Firebase',
		imageURL: 'https://media.graphcms.com/1q8os7Y0RuCi87kwi6V2',
		url: 'https://firebase.google.com/',
	},
];
