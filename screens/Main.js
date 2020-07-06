import { createBottomTabNavigator, NavigationActions } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, 
	Vibration, Image, TouchableOpacity, SplashScreen, YellowBox } from 'react-native';
import { DefaultTheme, Provider as PaperProvider, Button, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { setJWT, setRefreshToken } from '../actions'
import { config } from '../config'


import Ionicons from 'react-native-vector-icons/Ionicons';

import Login from './Login'
import Signup from './Signup'
import Wallet from './Wallet'
import Withdraw from './Withdraw'
import SettingsStack from './SettingsStack'
import Exchange from './Exchange'
import Cashout from './Cashout'
import Chart from './Chart'

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()


export default function Main(props) {
	const { navigation } = props
	const [isLoading, setLoading] = React.useState(false)

	const jwt = useSelector(state => state.reducers.jwt)
	const refresh = useSelector(state => state.persistReducers.refresh)
	const dispatch = useDispatch()

	function refreshToken() {
		fetch(config.url + '/refresh', {
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

	return (
		<Stack.Navigator 
			initialRouteName='Login'
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen 
				name='Login' 
				component={Login}
				initialParams={{
					refreshToken: () => refreshToken()
				}}
			/>
			<Stack.Screen 
				name='Signup' 
				component={Signup}
			/>
			<Stack.Screen 
				name='Home' 
				component={Home}
			/>
			<Stack.Screen 
				name='Exchange' 
				component={Exchange} 
			/>
			<Stack.Screen 
				name='Withdraw' 
				component={Withdraw} 
			/>
			<Stack.Screen 
				name='Cashout' 
				component={Cashout} 
			/>
			<Stack.Screen 
				name='Chart' 
				component={Chart}
				initialParams={{
					refreshToken: () => refreshToken()
				}}
			/>
		</Stack.Navigator>	
	);
}

function Home(props) {
	const { navigation } = props
	const theme = useSelector(state => state.persistReducers.theme)
	return (
		<Tab.Navigator
			screenProps={{test: 'asdasd'}}
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {

					if (route.name === 'Wallet') {
						return <Ionicons name='ios-wallet' size={size} color={color} />;
					} 
					else if (route.name === 'Settings') {
						return <Ionicons name='ios-settings' size={size} color={color} />;
					}
					else if (route.name === 'ExchangeButton') {
						return (
							<TouchableOpacity style={{activeOpacity: 0.8}} onPress={() => navigation.navigate('Exchange')}>
								<View style={{height: 90, width: 60, alignItems: 'center'}}>
									<Avatar.Icon style={{backgroundColor: theme.colors.accent}} size={60} icon="swap-horizontal-bold" />
								</View>
							</TouchableOpacity>
						)
					}
				},
			})}
			tabBarOptions={{
				borderTopWidth: 0,
				showLabel: false,
				activeTintColor: theme.colors.accent,
				inactiveTintColor: theme.colors.divider,
				style: {
					backgroundColor: theme.colors.primary,
					borderTopWidth: 0,
		            height: 55,
		            paddingBottom: 5,
				}
			}}
		>
			<Tab.Screen 
				name="Wallet" 
				component={Wallet}
			/>
			<Tab.Screen 
				name="ExchangeButton" 
				component={Wallet}
				tabBarButton
			/>
			<Tab.Screen 
				name="Settings" 
				component={SettingsStack} 
			/>
		</Tab.Navigator>
	)
}