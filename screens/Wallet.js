import React from 'react'
import { Button, Text, Appbar, Divider, Avatar, ActivityIndicator,
Modal, Portal } from 'react-native-paper';
import { StyleSheet, StatusBar, View, ScrollView, FlatList, Platform, 
	TouchableOpacity, RefreshControl, AppState } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Notifications } from 'expo';
import { config } from '../config'

import { setTheme, setWs, setPrices, setRefreshToken, setJWT } from '.././actions.js'
import BTClogo from '../assets/images/logos/btc.png'
import ETHlogo from '../assets/images/logos/eth.png'
import LTClogo from '../assets/images/logos/ltc.png'
import XRPlogo from '../assets/images/logos/xrp.png'
import CADlogo from '../assets/images/logos/cad.png'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;


const styles = StyleSheet.create({
	bottom: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
	},
});

export default function Wallet(props) {
	const theme = useSelector(state => state.persistReducers.theme);
  	const dispatch = useDispatch();
  	const [modal, setModal] = React.useState(false)
  	const [balance, setBalance] = React.useState(0)
  	const wallet = useSelector(state => state.reducers.wallet)
  	const ws = useSelector(state => state.reducers.ws)
  	const jwt = useSelector(state => state.persistReducers.jwt)
  	const refresh = useSelector(state => state.persistReducers.refresh)
  	const names = useSelector(state => state.reducers.symbols)
  	const prices = useSelector(state => state.reducers.prices)
  	const [ refreshing, setRefreshing ] = React.useState(false)
  	const [ wsError, setWsError ] = React.useState(0)
  	const [appState, setAppState] = React.useState(AppState.currentState);

  	const [loading, setLoading] = React.useState(true)
	const { navigation } = props

	const _handleAppStateChange = nextAppState => {
		if (nextAppState.match(/inactive|background/)) {
			if (ws !== undefined)
				ws.close()
		}
		else if (nextAppState.match(/active|foreground/)) {
			if (ws !== undefined)
				dispatch(setWs(new WebSocket(config.ws + jwt)))
		}
	}

	function updatePrices(e) {
		dispatch(setPrices({
			btc: e.btc.toFixed(0), 
			eth: e.eth.toFixed(2), 
			xrp: e.xrp.toFixed(4), 
			cad: 1,
			pbtc: e.pbtc,
			peth: e.peth,
			pxrp: e.pxrp
		}))
	}

	function onRefresh() {
		getPrices()
	}

	function getPrices() {
		fetch(config.url + '/ticker', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + jwt
			}
		})
		.then((response) => {
			if (response.status === 200) {
				response.json()
				.then(responseJson => {
					updatePrices(responseJson)
					dispatch(setWs(new WebSocket(config.ws + jwt)))
				})
			}
			else if (response.status === 401) {
				refreshToken()
			}
		})
		.catch((error) => {
			console.error(error);
		});
	}

	async function refreshToken() {
		await fetch(config.url + '/refresh', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				refresh: refresh
			})
		})
		.then((response) => {
			if (response.status === 200) {
				response.json()
				.then(responseJson => {
					dispatch(setJWT(responseJson.newToken))
				})
			}
			else {
				dispatch(setRefreshToken(false))
			}
		})
		.catch((error) => {
			console.error(error);
		});
	}

	if (ws !== undefined) {
			ws.onopen = () => {
				setWsError(0)
			console.log("Connected")
		}

		ws.onmessage = (e) => {
			var data = JSON.parse(e.data)
			if (data.type === 'prices')
				updatePrices(data.payload)	
		};

		ws.onerror = async (e) => {
			if (e.message.includes('Forbidden'))
				await refreshToken()
		};

		ws.onclose = (e) => {
			;
		};
	}

	var style = {
		text: {
			color: theme.colors.secondary,
			fontSize: 40,
			paddingTop: 20,
		},
		button: {
			backgroundColor: theme.colors.accent,
		},
		modal: {
			alignSelf: 'center', 
			backgroundColor: theme.colors.primary, 
			borderRadius: 5, 
			position: 'absolute',
			bottom: -15,
			height: '60%',
			width: '95%'
		}
	}

	React.useEffect(() => {
		const _notificationSubscription = Notifications.addListener(handleNotifications);
		AppState.addEventListener("change", _handleAppStateChange);
		getPrices()
	}, [])

	React.useEffect(() => {
		var sum = 0
		Object.keys(wallet).forEach(key => {sum += wallet[key]*prices[key]})
		setBalance(sum)
	}, [prices])

	React.useEffect(() => {
		getPrices()
	}, [jwt])

	var list = Object.keys(wallet).sort((a, b) => wallet[b]*prices[b] - wallet[a]*prices[a]).map(key => {
		var image = key === 'btc' ? BTClogo : (key === 'eth' ? ETHlogo : (key === 'ltc' ? LTClogo: (key === 'xrp' ? XRPlogo : CADlogo)))
		return (
			<TouchableOpacity key={key} style={{activeOpacity: 0.8}} onPress={() => navigation.navigate('Chart', {symbol: key})}>
				<View style={{flexDirection: 'row'}}>
					<View style={{alignSelf: 'flex-start', padding: 20}}>
						<Avatar.Image size={40} source={image} />
					</View>
					<View style={{flex: 1, justifyContent: 'center'}}>
						<Text style={{color: theme.colors.accent, fontSize: 17}}>{names[key]}</Text>
						{key === 'cad' ?  
							null
						:
							<View style={{flexDirection: 'row'}}>
								<Text style={{color: theme.colors.secondary, fontSize: 12}}>
									{'$' + (prices[key].toString()+'').replace(/(\..*)$|(\d)(?=(\d{3})+(?!\d))/g, (digit, fract) => fract || digit + ',').replace(/(\.[0-9]*[1-9])0+$/, '$1')}
								</Text>
								<View style={{flexDirection: 'row', paddingLeft: 10}}>
									{
										(parseFloat(prices['p' + key]) < 0 ? 
											<Text style={{color: theme.colors.red}}>
												{parseFloat(prices['p' + key]) ? parseFloat(prices['p' + key]).toFixed(2) : "-.--"}%
											</Text>
										:
											<Text style={{color: theme.colors.green}}>
												{parseFloat(prices['p' + key]) ? parseFloat(prices['p' + key]).toFixed(2) : "-.--"}%
											</Text>
										)
									}
								</View>
							</View>
						}
					</View>
					<View style={{justifyContent: 'center', paddingRight: 20}}>
						<Text style={{color: theme.colors.accent, fontSize: 15, alignSelf: 'flex-end'}}>
						{(wallet[key].toFixed(7).toString()+'').replace(/(\..*)$|(\d)(?=(\d{3})+(?!\d))/g, (digit, fract) => fract || digit + ',').replace(/(\.[0-9]*[1-9])0+$/, '$1')}</Text>
						{key === 'cad' ?  
							null
						:
							<Text style={{color: theme.colors.secondary, fontSize: 12, alignSelf: 'flex-end'}}>{'$' + ( wallet[key]*prices[key] ? (wallet[key]*prices[key]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-.--")}</Text>
						}
					</View>
				</View>
			</TouchableOpacity>
		)
	})

	const handleNotifications = (notification) => {}
	return (
		<View style={{flex: 1, backgroundColor: theme.colors.primary}}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
			<View style={{height: APPBAR_HEIGHT}} />
			<Appbar.Header statusBarHeight={0} style={{justifyContent: 'center'}}>
				<Avatar.Image size={50} source={require('../assets/images/logo.png')}/>
			</Appbar.Header>
			<Divider style={{backgroundColor: theme.colors.divider}}/>
			<View style={{flex: 1, flexDirection: 'column'}}>
				<View style={{flexDirection: 'row', justifyContent: 'center'}}>
					<Text style={style.text}>{'$' + (balance ? balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-.--")}</Text>
				</View>
				<View style={{flexDirection: 'row', justifyContent: 'center'}}>
					<View style={{paddingRight: 20, paddingTop: 10, paddingBottom: 20}}>
						<Button style={style.button} icon="arrow-down" mode="contained" onPress={() => setModal(true)}>Deposit</Button>
					</View>
					<View style={{paddingTop: 10, paddingBottom: 20}}>
						<Button style={style.button} icon="arrow-up" mode="contained" onPress={() => navigation.navigate('Withdraw')}>Withdraw</Button>
					</View>
				</View>
				<Divider style={{backgroundColor: theme.colors.divider}}/>
				<View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
					<ScrollView 
						style={{elevation: 10000}}
						refreshControl={
							<RefreshControl
								progressViewOffset={20}
								colors={[theme.colors.accent, theme.colors.secondary]}
								refreshing={refreshing}
								onRefresh={() => onRefresh()} 
							/>
						}
					>
						{list}
					</ScrollView>
				</View>
			</View>
			<Portal>
				<Modal visible={modal} onDismiss={() => setModal(false)}>
					<View style={style.modal}>
						<Text style={{color: theme.colors.secondary}} >Example Modal</Text>
					</View>
	           	</Modal>
	        </Portal>
			<Divider style={{backgroundColor: theme.colors.divider}}/>
		</View>
	)
}