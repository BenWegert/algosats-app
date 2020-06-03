import React from 'react'
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native'
import { Button, Text, Appbar, Divider, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default function Cashout(props) {
	const theme = useSelector(state => state.persistReducers.theme);
  	const dispatch = useDispatch();
	const { navigation } = props
	return (
		<View style={{flex: 1, backgroundColor: theme.colors.primary}}>
			<View style={{height: APPBAR_HEIGHT, backgroundColor: theme.colors.primary}} />
			<Appbar style={{justifyContent: 'space-between'}}>
				<Appbar.Action icon="chevron-left" onPress={() => navigation.goBack()} />
				<Avatar.Image size={50} source={require('../assets/images/logos/interac.png')}/>
				<Avatar.Image size={50} />
			</Appbar>
			<Divider style={{backgroundColor: theme.colors.divider}}/>
			<ScrollView>
				<Text style={{color: theme.colors.secondary, fontSize: 15}}>Stay tuned for upcoming updates</Text>
			</ScrollView>
			<Divider style={{backgroundColor: theme.colors.divider}}/>
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#ebebeb'
  },
  text: {
	color: '#101010',
	fontSize: 24,
	fontWeight: 'bold'
  }
})
