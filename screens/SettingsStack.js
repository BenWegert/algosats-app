import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import Settings from './Settings'

const Stack = createStackNavigator()

export default function SettingsStack(props){
	return (
		<Stack.Navigator 
			initialRouteName='Settings'
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen 
				name='Settings' 
				component={Settings} 
			/>
		</Stack.Navigator>
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