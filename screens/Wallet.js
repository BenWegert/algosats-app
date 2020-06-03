import React from 'react'
import { Button, Text, Appbar, Divider, Avatar, ActivityIndicator,
Modal, Portal } from 'react-native-paper';
import { StyleSheet, StatusBar, View, ScrollView, FlatList, Platform } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Notifications } from 'expo';

import { setTheme } from '.././actions.js'
import BTClogo from '../assets/images/logos/BTC.png'
import ETHlogo from '../assets/images/logos/ETH.png'
import LTClogo from '../assets/images/logos/LTC.png'
import CADlogo from '../assets/images/logos/CAD.png'
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const names = {
	BTC: 'Bitcoin',
	ETH: 'Ethereum',
	LTC: 'Litecoin',
	CAD: 'Dollars'
}


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
  	const [balance, setBalance] = React.useState(123400.00)
  	const [amounts, setAmounts] = React.useState({
  		BTC: 0.232144,
  		ETH: 2.312000,
  		LTC: 5.232142,
  		CAD: 1500.18
  	})

  	const [loading, setLoading] = React.useState(true)
	const { navigation } = props

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
	}, [])

	var list = Object.keys(amounts).sort((a, b) => amounts[b] - amounts[a]).map(key => {
		var image = key === 'BTC' ? BTClogo : (key === 'ETH' ? ETHlogo : (key === 'LTC' ? LTClogo: CADlogo))
		return (
			<View key={key} style={{flexDirection: 'row'}}>
				<View style={{alignSelf: 'flex-start', padding: 20}}>
					<Avatar.Image size={40} source={image} />
				</View>
				<View style={{flex: 1, justifyContent: 'center'}}>
					<Text style={{color: theme.colors.accent, fontSize: 17}}>{names[key]}</Text>
					<Text style={{color: theme.colors.secondary, fontSize: 12}}>$23.1323</Text>
				</View>
				<View style={{justifyContent: 'center', paddingRight: 20}}>
					<Text style={{color: theme.colors.accent, fontSize: 15, alignSelf: 'flex-end'}}>
					{(amounts[key].toFixed(7).toString()+'').replace(/(\..*)$|(\d)(?=(\d{3})+(?!\d))/g, (digit, fract) => fract || digit + ',').replace(/(\.[0-9]*[1-9])0+$/, '$1')}</Text>
					<Text style={{color: theme.colors.secondary, fontSize: 12, alignSelf: 'flex-end'}}>$0.00</Text>
				</View>
			</View>
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
					<Text style={style.text}>$</Text>
					<Text style={style.text}>{balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
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
					<ScrollView>
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