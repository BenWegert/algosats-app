import React from 'react'
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native'
import { Button, Text, Appbar, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";

export default function Exchange(props) {
	const theme = useSelector(state => state.persistReducers.theme);
  	const dispatch = useDispatch();
	const { navigation } = props
	return (
		<View style={{flex: 1, backgroundColor: theme.colors.primary}}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
			<Appbar.Header statusBarHeight={0}>
				<Appbar.Content
					title="Settings"
				/>
			</Appbar.Header>
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
