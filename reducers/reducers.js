const initialState = {
	loggedIn: false
};

const reducers = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGGEDIN': {
			return {
				...state,
				loggedIn: action.payload,
			}
		}
		default: {
			return state;
		}
	}
};
// Exports
export default reducers;