const initialState = {
	theme: {
		colors: {
			primary: '#141a20',
			secondary: '#ffffff',
			accent: '#17a2b8',
			divider: '#555d66'
		}
	},
	refresh: '252f356b37e87e9debf4abe47f496503e2179ef7339b2ec9288973168a7b7e969b498b3557737551',
	lock: true,
	jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYmVud2VnZXJ0QGdtYWlsLmNvbSJ9LCJpYXQiOjE1OTExNDE1ODYsImV4cCI6MTU5MTE0MTg4Nn0.tYvFXoeUtjptGaZnIb3Grt1wQqMwIJ1hXB5P7bsAtGQ'
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