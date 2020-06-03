import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, 
	Vibration, Image, TouchableOpacity, SplashScreen } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider, Button, Avatar } from 'react-native-paper';
import { store, persistor } from './store';

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import Main from './screens/Main'
const theme = {
	...DefaultTheme,
	colors: {
		primary: '#141a20',
		secondary: '#ffffff',
		accent: '#17a2b8',
		divider: '#555d66'
	}
};

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
// 	Wallet: {
// 		screen: Home,
// 		navigationOptions: {
// 			tabBarIcon: ({ focused, color, size }) => {
// 				let iconName;

// 				if (route.name === 'Home') {
// 					iconName = 
// 				} 
// 				else if (route.name === 'Settings') {
// 					iconName = focused ? 'ios-list-box' : 'ios-list';
// 				}

// 				// You can return any component that you like here!
// 				return <Ionicons name={focused ? 'ios-information-circle' : 'ios-information-circle-outline';} size={size} color={color} />;
// 		}
// 	}
// });

const registerForPushNotificationsAsync = async () => {
	if (Constants.isDevice) {
		const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = await Notifications.getExpoPushTokenAsync();
	} 
	else {
		alert('Must use physical device for Push Notifications');
	}

	if (Platform.OS === 'android') {
		Notifications.createChannelAndroidAsync('signals', {
			name: 'Signals',
			sound: true,
			priority: 'max',
			vibrate: [0, 250, 250, 250],
		});
	}
};

export default function AppContainer(props) {
	const [expoPushToken, setExpoPushToken ] = React.useState('')
	const [notification, setNotification ] = React.useState({})
	const [isLoading, setLoading] = React.useState(false)

	const _handleNotification = notification => {
		//Vibration.vibrate();
		//console.log(notification);
		setNotification(notification)
	};

	React.useEffect(() => {
		registerForPushNotificationsAsync();
		// Handle notifications that are received or selected while the app
		// is open. If the app was closed and then opened by tapping the
		// notification (rather than just tapping the app icon to open it),
		// this function will fire on the next tick after the app starts
		// with the notification data.
		const _notificationSubscription = Notifications.addListener(_handleNotification);
	},[])

	return (
		<Provider store={store}>
			<PersistGate loading={<View style={{flex: 1, backgroundColor: theme.colors.primary}}></View>} persistor={persistor}>
				<PaperProvider theme={theme}>
					<NavigationContainer>
						<Main />
					</NavigationContainer>
				</PaperProvider>
			</PersistGate>
		</Provider>
	);
}