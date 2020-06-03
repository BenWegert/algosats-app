export const setJWT = (data) => (
	{
		type: 'JWT',
		payload: data
	}
)

export const setRefreshToken = (data) => (
	{
		type: 'REFRESH',
		payload: data
	}
)

export const setLock = (data) => (
	{
		type: 'LOCK',
		payload: data
	}
)

export const setLoggedIn = (data) => (
	{
		type: 'LOGGEDIN',
		payload: data
	}
)

export const setTheme = (data) => (
	{
		type: 'THEME',
		payload: data
	}
)