import React from 'react'
import { Dimensions, View, ScrollView, StatusBar, PanResponder, Text, FlatList, RefreshControl } from 'react-native'
import { Button, Appbar, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { config } from '../config'

import { LineChart, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import * as scale from 'd3-scale'
import { Circle, G, Line } from 'react-native-svg'

const WIDTH = Dimensions.get("window").width;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;



export default function Chart(props) {

	const theme = useSelector(state => state.persistReducers.theme)
	const jwt = useSelector(state => state.persistReducers.jwt)
	const [ data, setData ] = React.useState({'1d': [], '1w': [], '1m': [], '1y': [], 'all': []})
	const [ fullData, setFullData ] = React.useState({})
	const [ slider, setSlider ] = React.useState(null)
	const { navigation } = props
	const { refreshToken } = props.route.params
	const ws = useSelector(state => state.reducers.ws)
	const { symbol } = props.route.params
	const names = useSelector(state => state.reducers.symbols)
	const prices = useSelector(state => state.reducers.prices)
	const [ interval, setInterval ] = React.useState('1d')
	const [ percent, setPercent ] = React.useState(parseFloat(prices['p' + symbol]).toFixed(2))
	const [ refreshing, setRefreshing ] = React.useState(false)
	const wallet = useSelector(state => state.reducers.wallet)
	const [ log, setLog ] = React.useState(false)

	React.useEffect(() => {
		if (symbol !== 'cad')
			getData(symbol)
	}, [])

	React.useEffect(() => {
		if (fullData[interval] !== undefined) {
			if (interval !== '1d') {
				setPercent(parseFloat((prices[symbol]-data[interval][0])/data[interval][0]*100).toFixed(2))
			}
			else
				setPercent(parseFloat(prices['p' + symbol]).toFixed(2))
		}
	}, [interval, prices])

	React.useEffect(() => {
		if (fullData[interval] !== undefined) {
			if (slider === null) {
				if (interval !== '1d') {
					setPercent(parseFloat((prices[symbol]-data[interval][0])/data[interval][0]*100).toFixed(2))
				}
				else
					setPercent(parseFloat(prices['p' + symbol]).toFixed(2))
			}
			else
				setPercent(parseFloat((data[interval][parseInt(slider*data[interval].length-1)]-data[interval][0])/data[interval][0]*100).toFixed(2))
		}
	}, [slider])

	function getData(symbol, interval) {
		setRefreshing(true)
		fetch(config.url + '/chart/' + symbol, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + jwt
			}
		})
		.then(response => {
			setRefreshing(false)
			if (response.status === 200) {
				response.json()
				.then(async responseJson => {
					var cleaned = {}
					for (interval of Object.keys(responseJson)) {
						var arr = []
						for (candle of responseJson[interval]) {
							await arr.push(candle[4]) 
						}
						cleaned[interval] = arr
					}
					setData(cleaned)
					setFullData(responseJson)
				})
			}
		})
		.catch((error) => {
			setRefreshing(false)
			console.error(error);
		});
	}

	function changeSlider(input) {
		setSlider(Math.abs(input/WIDTH).toFixed(3))
	}

	const panResponder = React.useRef(
		PanResponder.create({
			// Ask to be the responder:
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

			onPanResponderGrant: (evt, gestureState) => {
				changeSlider(gestureState['x0'])
				// The gesture has started. Show visual feedback so the user knows
				// what is happening!
				// gestureState.d{x,y} will be set to zero now
			},
			onPanResponderMove: (evt, gestureState) => {
				changeSlider(gestureState['x0'] + gestureState['dx'])
				// The most recent move distance is gestureState.move{X,Y}
				// The accumulated gesture distance since becoming responder is
				// gestureState.d{x,y}
			},
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				setSlider(null)
				// The user has released all touches while this view is the
				// responder. This typically means a gesture has succeeded
			},
			onPanResponderTerminate: (evt, gestureState) => {
				setSlider(null)
				// Another component has become the responder, so this gesture
				// should be cancelled
			},
			onShouldBlockNativeResponder: (evt, gestureState) => {
				// Returns whether this component should block native components from becoming the JS
				// responder. Returns true by default. Is currently only supported on android.
			return true;
			}
		})
	).current;

	function timeConverter(t) {   
		var a = new Date(t);
		if (t < 10000000000)
			a = new Date(t*1000)
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours() % 12;
		if (a.getHours() === 12)
			hour = 12
		var m = (a.getHours() > 11 ? 'PM' : 'AM')
		var min = a.getMinutes().toString().padStart(2, 0);
		return date + ' ' + month + ' ' + year + ', ' + hour + ':' + min + ' ' + m;
	}

	function onRefresh() {
		getData(symbol, interval)
	}

	const Tooltip = ({ x, y }) => (
		<G
			x={ x(parseInt(slider*data[interval].length-1)) - (75 / 2) }
			key={ 'tooltip' }
		>
			<G x={ 75 / 2 }>
				<Line
					y1={ 400 }
					y2={ y(data[interval][ parseInt(slider*data[interval].length-1) ]) }
					stroke={ 'grey' }
					strokeWidth={ 2 }
				/>
				<Circle
					cy={ y(data[interval][ parseInt(slider*data[interval].length-1) ]) }
					r={ 5 }
					stroke={ theme.colors.accent }
					strokeWidth={ 6 }
					fill={ theme.colors.secondary }
				/>
			</G>
		</G>
	)

	return (
		<View style={{flex: 1, backgroundColor: theme.colors.primary}}>
			<View style={{height: APPBAR_HEIGHT, backgroundColor: theme.colors.primary}} />
			<Appbar>
				<Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} />
				<Appbar.Content title={names[symbol]} style={{flex: 1, alignItems: 'center'}} />
				<Appbar.Action icon="swap-horizontal" onPress={() => console.log('excahnge btc')} />
			</Appbar>
			<Divider style={{backgroundColor: theme.colors.divider}}/>
			<View style={{flex: 1}}>
				<FlatList
					ListHeaderComponent={
						<>
							{
								( symbol !== 'cad' ?
									<>
										<View style={{ backgroundColor: theme.colors.primary, flexDirection: 'column', padding: 10}}>
											<View style={{flexDirection: 'row', justifyContent: 'center'}}>
												{
													(slider !== null ? 
														<Text style={{ color: theme.colors.accent, fontSize: 18 }}>
															{timeConverter(fullData[interval][ parseInt(slider*data[interval].length-1) ][0])}
														</Text>
													:
														<Text style={{ color: theme.colors.accent, fontSize: 18 }}>
															Current price
														</Text>
													)
												}
											</View>
											<View style={{flexDirection: 'row', justifyContent: 'center'}}>
												<View>
													{
														(slider !== null ? 
															<Text style={{ color: theme.colors.secondary, fontSize: 35 }}>
																{'$' + (data[interval][parseInt(slider*data[interval].length-1)].toString()+'').replace(/(\..*)$|(\d)(?=(\d{3})+(?!\d))/g, (digit, fract) => fract || digit + ',').replace(/(\.[0-9]*[1-9])0+$/, '$1')}
															</Text>
														: 
															<Text style={{ color: theme.colors.secondary, fontSize: 35 }}>
																{'$' + (prices[symbol].toString()+'').replace(/(\..*)$|(\d)(?=(\d{3})+(?!\d))/g, (digit, fract) => fract || digit + ',').replace(/(\.[0-9]*[1-9])0+$/, '$1')}
															</Text>
														)
													}
												</View>
												<View style={{flexDirection: 'column', paddingLeft: 20, justifyContent: 'space-around'}}>
													<Text style={ percent > 0 ? {color: theme.colors.green, fontSize: 24} : {color: theme.colors.red, fontSize: 24}}>
														{percent}%
													</Text>
												</View>
											</View>
										</View>
										<View {...panResponder.panHandlers} style={{ backgroundColor: theme.colors.primary}}>
											<LineChart {...panResponder.panHandlers}
												style={{ height: 200 }}
												data={ data[interval] }
												svg={{
													stroke: theme.colors.accent,
													strokeWidth: 2,
												}}
												contentInset={{ top: 20, bottom: 20 }}
												curve={ shape.curveLinear }
												animate={true}
												yScale={log ? scale.scaleLog : scale.scaleLinear}
												>
													{
														(slider !== null ? 
															<Tooltip/>
														:
															null
														)
													}
											</LineChart>
										</View>
										<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
											<Button onPress={() => setInterval('1d')}>
												<Text style={interval === '1d' ? {color: theme.colors.accent} : {color: theme.colors.secondary}}>
													1D
												</Text>
											</Button>
											<Button onPress={() => setInterval('1w')}>
												<Text style={interval === '1w' ? {color: theme.colors.accent} : {color: theme.colors.secondary}}>
													1W
												</Text>
											</Button>
											<Button onPress={() => setInterval('1m')}>
												<Text style={interval === '1m' ? {color: theme.colors.accent} : {color: theme.colors.secondary}}>
													1M
												</Text>
											</Button>
											<Button onPress={() => setInterval('1y')}>
												<Text style={interval === '1y' ? {color: theme.colors.accent} : {color: theme.colors.secondary}}>
													1Y
												</Text>
											</Button>
											<Button onPress={() => setInterval('all')}>
												<Text style={interval === 'all' ? {color: theme.colors.accent} : {color: theme.colors.secondary}}>
													ALL
												</Text>
											</Button>
											<Button onPress={() => setLog(!log)}>
												<Text style={log ? {color: theme.colors.accent} : {color: theme.colors.secondary}}>
													LOG
												</Text>
											</Button>
										</View>
										<Divider style={{backgroundColor: theme.colors.divider}}/>

									</>
								:
									null
								)
							}
							<View style={{flexDirection: 'column', justifyContent: 'space-between', padding: 20}}>
								<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
									<View>
										<Text style={{color: theme.colors.secondary, fontSize: 18}}>
											Balance
										</Text>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
										<Text style={{color: theme.colors.secondary, fontSize: 18}}>
											{wallet[symbol]}
										</Text>
									</View>
								</View>
								<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15}}>
									<View style={{width: '48%'}}>
										<Button style={{backgroundColor: theme.colors.accent}} icon="arrow-down" mode="contained" onPress={() => setModal(true)}>Receive</Button>
									</View>
									<View style={{width: '48%'}}>
										<Button style={{backgroundColor: theme.colors.accent}} icon="arrow-up" mode="contained" onPress={() => navigation.navigate('Withdraw')}>Send</Button>
									</View>
								</View>				
							</View>
							<Divider style={{backgroundColor: theme.colors.divider}}/>
						</>
					}
					refreshControl={
						<RefreshControl
							colors={[theme.colors.accent, theme.colors.secondary]}
							refreshing={refreshing}
							onRefresh={() => onRefresh()} 
						/>
					}
					alwaysBounceVertical={false}
					extraData={false}
					data={[{id: '1', text: "sdasd"}, {id: '2', text: "sdsdasdasd"}, {id: '3', text: "sdassadasdasd"}]}
					renderItem={({ item }) => 
						(
							<View style={{flex: 1}}>
								<Text style={{ color: theme.colors.accent, fontSize: 158 }}></Text>
							</View>
						)
					}
					keyExtractor={item => item.id}
				/>
			</View>
		</View>
	)
}