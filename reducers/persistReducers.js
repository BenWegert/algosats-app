const initialState = {
	theme: {
		colors: {
			primary: '#141a20',
			secondary: '#ffffff',
			accent: '#17a2b8',
			divider: '#555d66',
			green: '#6da06f',
			red: '#c13525'
		}
	},
	lock: false,
};

const persistReducers = (state = initialState, action) => {
	switch (action.type) {
		case 'THEME': {
			return {
				...state,
				theme: action.payload,
			}
		}
		case 'REFRESH': {
			return {
				...state,
				refresh: action.payload,
			}
		}
		case 'JWT': {
			return {
				...state,
				jwt: action.payload,
			}
		}
		case 'LOCK': {
			return {
				...state,
				lock: action.payload,
			}
		}
		default: {
			return state;
		}
	}
};
// Exports
export default persistReducers;