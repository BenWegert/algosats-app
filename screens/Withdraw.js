import React from 'react'
import { Button, Text, Appbar, Divider, Avatar, Portal, Modal, TextInput } from 'react-native-paper';
import { StatusBar, View, ScrollView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { BarCodeScanner } from 'expo-barcode-scanner';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default function Withdraw(props) {
	const [modal, setModal] = React.useState(false)
	const [input, setInput] = React.useState('')
	const [hasPermission, setHasPermission] = React.useState(null);
	const [scanned, setScanned] = React.useState(false);
	const theme = useSelector(state => state.persistReducers.theme);
	const { navigation } = props 

	React.useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true);
		setInput(data)
		setModal(false)
		setScanned(false);
	};

	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={{flex: 1, backgroundColor: theme.colors.primary}} >
			<View style={{height: APPBAR_HEIGHT, backgroundColor: theme.colors.primary}} />
			<Appbar>
				<Appbar.Action icon="close" onPress={() => navigation.goBack()} />
				<Appbar.Content title="Withdraw" style={{flex: 1, alignItems: 'center'}} />
				<Appbar.Action icon="qrcode-scan" onPress={() => setModal(true)} />
			</Appbar>
			<Divider style={{backgroundColor: theme.colors.divider}}/>
			<TextInput
				mode="outlined"
				style={{width: '95%', alignSelf: 'center'}}
				selectionColor={theme.colors.accent}
				underlineColor={theme.colors.accent}
				placeholder='Send to username or wallet address'
				value={input}
				onChangeText={text => setInput(text)}
				theme={{ colors: theme.colors }}
			/>
			<TouchableOpacity onPress={() => navigation.navigate('Cashout')} >
				<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<View style={{alignSelf: 'flex-start', padding: 20}}>
						<Avatar.Image size={40} source={require('../assets/images/logos/interac.png')}/>
					</View>
					<View style={{flex: 1, justifyContent: 'center'}} >
						<Text style={{color: theme.colors.secondary, fontSize: 15}} >Cash out</Text>
					</View>
					<View style={{padding: 20}} >
						<Avatar.Icon size={40} icon='chevron-right'/>
					</View>
				</View>
			</TouchableOpacity>
			<Divider style={{backgroundColor: theme.colors.divider}}/>
			<Portal>
				<Modal visible={modal} onDismiss={() => setModal(false)}>
					<View style={{flexDirection: 'column', borderWidth: 3, borderColor: theme.colors.secondary,
						height:350, width: 350, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', overflow: 'hidden'}}>
						<BarCodeScanner
							onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
							style={{height: 470, width: 350}}
						/>
					</View>
					<Text style={{alignSelf: 'center', textAlign: 'center',padding: 30, fontSize: 20, color: theme.colors.secondary}}>
						Scan the address of any accepted crypto.
					</Text>
					<View style={{paddingLeft: 30, paddingRight: 30}}>
						<Button onPress={() => setModal(false)} mode='contained' style={{backgroundColor: theme.colors.accent}}>Cancel</Button>
	           		</View>
	           	</Modal>
	        </Portal>
		</View>
	)
}