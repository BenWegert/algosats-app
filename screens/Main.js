import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, 
	Vibration, Image, TouchableOpacity, SplashScreen } from 'react-native';
import { DefaultTheme, Provider as PaperProvider, Button, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { setJWT, setRefreshToken } from '../actions'


import Ionicons from 'react-native-vector-icons/Ionicons';

import Login from './Login'
import Signup from './Signup'
import Wallet from './Wallet'
import Withdraw from './Withdraw'
import SettingsStack from './SettingsStack'
import Exchange from './Exchange'
import Cashout from './Cashout'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()


export default function Main(props) {
	const { navigation } = props
	const [isLoading, setLoading] = React.useState(false)
	const loggedIn = useSelector(state => state.reducers.loggedIn)
	const jwt = useSelector(state => state.reducers.jwt)
	const dispatch = useDispatch()

	React.useEffect(() => {
		
	},[loggedIn])

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
		</Stack.Navigator>	
	);
}

function Home(props) {
	const { navigation } = props
	const theme = useSelector(state => state.persistReducers.theme)
	return (
		<Tab.Navigator
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
			<Tab.Screen name="Wallet" component={Wallet}/>
			<Tab.Screen name="ExchangeButton" component={Wallet} tabBarButton />
			<Tab.Screen name="Settings" component={SettingsStack} />
		</Tab.Navigator>
	)
}