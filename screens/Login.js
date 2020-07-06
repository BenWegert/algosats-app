import React from 'react'
import { Button, Text, Appbar, Divider, Avatar, ActivityIndicator,
Modal, Portal } from 'react-native-paper';
import { StyleSheet, StatusBar, View, ScrollView, TextInput, Platform } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import * as LocalAuthentication from 'expo-local-authentication';
import { config } from '../config'
import { setJWT, setRefreshToken, setWallet } from '../actions'
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default function Authentication(props) {
	const { navigation } = props
	const { refreshToken } = props.route.params
	const [ loggedIn, setLoggedIn ] = React.useState(false)
	const theme = useSelector(state => state.persistReducers.theme);
	const lock = useSelector(state => state.persistReducers.lock)
	const refresh = useSelector(state => state.persistReducers.refresh)
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const jwt = useSelector(state => state.persistReducers.jwt);
	const wallet = useSelector(state => state.reducers.wallet)
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (refresh)
			checkProfile()
	},[refresh, jwt])

	function checkProfile() {
		fetch(config.url + '/profile', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + jwt
				}
			}).then(response => {
				if (response.status === 200) {
					response.json()
					.then(responseJson => {
						dispatch(setWallet(responseJson.wallet))
						if (lock && !loggedIn) {
							LocalAuthentication.isEnrolledAsync().then(res => {
								if (res === true && lock === true)
									LocalAuthentication.authenticateAsync().then(unlock => {
										if (unlock.success === true) {
											navigation.reset({
												index: 3,
								  				routes: [{ name: 'Home' }],
											})
										}
									})
							})
						}
						else if (loggedIn)
							navigation.reset({
								index: 3,
				  				routes: [{ name: 'Home' }],
							})
						else if (!loggedIn && !lock)
							navigation.reset({
								index: 3,
				  				routes: [{ name: 'Home' }],
							})
					})
				}
				else if (refresh){
					refreshToken()
				}
			})
	}

	const login = () => {
		fetch(config.url + '/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: email,
				password: password
			}),
		}).then((response) => response.json())
		.then((responseJson) => {
			setLoggedIn(true)
			dispatch(setJWT(responseJson.token))
			dispatch(setRefreshToken(responseJson.refresh))
		})
		.catch((error) => {
			console.error(error);
		});
	}

	const logout = () => {
		fetch(config.url + '/logout', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				refresh: refresh,
			}),
		}).then((response) => {
			if (response.status === 200) {
				dispatch(setRefreshToken(false))
			}
		})
		.catch((error) => {
			console.error(error);
		});
	}

	const unlock = () => {
		LocalAuthentication.isEnrolledAsync().then(res => {
			if (res === true && lock === true)
				LocalAuthentication.authenticateAsync().then(unlock => {
					if (unlock.success === true) {
						navigation.reset({
							index: 3,
			  				routes: [{ name: 'Home' }],
						})
					}
				})
		})
	}

	return(
		<View style={{flex: 1, backgroundColor: theme.colors.primary}} >
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
			<View style={{height: APPBAR_HEIGHT, backgroundColor: theme.colors.primary}} />
			<Appbar>
				<Avatar.Image size={50} />
				<Appbar.Content style={{flex: 1, alignItems: 'center'}} />
				<Appbar.Action icon="information-outline" onPress={() => setModal(true)} />
			</Appbar>
			<Divider style={{backgroundColor: theme.colors.divider}}/>
			<View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>
				<Avatar.Image size={100} source={require('../assets/images/logo.png')} />
				<Text style={{color: theme.colors.secondary, fontSize: 40}} >AlgoSats</Text>
			</View>
			{refresh ? 
				<>
					<View style={{paddingLeft: 30, paddingRight: 30}}>
						<Button onPress={unlock} mode='contained' style={{backgroundColor: theme.colors.accent}}>Unlock</Button>
						<Button onPress={logout} mode='contained' style={{backgroundColor: theme.colors.accent}}>Logout</Button>
	       			</View>
	       		</>
			:  
				<>
					<View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>
						<TextInput
							mode="outlined"
							style={{width: 300, padding: 10, alignSelf: 'center', color: theme.colors.secondary}}
							selectionColor={theme.colors.accent}
							underlineColor={theme.colors.accent}
							placeholder='Email Adress'
							value={email}
							onChangeText={text => setEmail(text)}
							theme={{ colors: theme.colors }}
						/>
						<TextInput
							mode="outlined"
							style={{width: 300, padding: 10, alignSelf: 'center', color: theme.colors.secondary}}
							selectionColor={theme.colors.accent}
							underlineColor={theme.colors.accent}
							placeholder='Password'
							value={password}
							onChangeText={text => setPassword(text)}
							theme={{ colors: theme.colors }}
						/>
					</View>
					<View style={{paddingLeft: 30, paddingRight: 30}}>
						<Button onPress={login} mode='contained' style={{backgroundColor: theme.colors.accent}}>Log In</Button>
		       		</View>
		       	</>
			}
		</View>
	)
}
