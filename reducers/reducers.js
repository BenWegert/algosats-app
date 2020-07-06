const initialState = {
	loggedIn: false,
	wallet: {
		cad: 0,
		btc: 0,
		eth: 0,
		xrp: 0
	},
	symbols: {
		btc: 'Bitcoin',
		eth: 'Ethereum',
		xrp: 'Ripple',
		cad: 'Dollars'
	},
	prices: {
		btc: "--.--", 
		eth: "--.--", 
		xrp: "--.--", 
		cad: 1,
		pbtc: "--.-%", 
		peth: "--.-%", 
		pxrp: "--.-%"
	}
};

const reducers = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGGEDIN': {
			return {
				...state,
				loggedIn: action.payload,
			}
		}
		case 'WALLET': {
			return {
				...state,
				wallet: action.payload,
			}
		}
		case 'WS': {
			return {
				...state,
				ws: action.payload,
			}
		}
		case 'SYMBOLS': {
			return {
				...state,
				symbols: action.payload,
			}
		}
		case 'PRICES': {
			return {
				...state,
				prices: action.payload,
			}
		}
		default: {
			return state;
		}
	}
};
// Exports
export default reducers;