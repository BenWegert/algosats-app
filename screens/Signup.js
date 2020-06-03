import React from 'react'
import { Button, Text, Appbar, Divider, Avatar, ActivityIndicator,
Modal, Portal } from 'react-native-paper';
import { StyleSheet, StatusBar, View, ScrollView, TextInput, Platform } from 'react-native';

export default function Authentication(props) {
	return(
		<View style={styles.container}>
			<Text style={styles.title}> Welcome </Text>

			<View style={styles.form}>
				<TextInput
					editable={true}
					onChangeText={(username) => this.setState({username})}
					placeholder='Username'
					ref='username'
					returnKeyType='next'
					value={this.state.username}
				/>

				<TextInput
					editable={true}
					onChangeText={(password) => this.setState({password})}
					placeholder='Password'
					ref='password'
					returnKeyType='next'
					secureTextEntry={true}
					value={this.state.password}
				/>

				<TouchableOpacity style={styles.buttonWrapper} onPress={this.userLogin.bind(this)}>
					<Text> Log In </Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.userSignup.bind(this)}>
					<Text> Sign Up </Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
