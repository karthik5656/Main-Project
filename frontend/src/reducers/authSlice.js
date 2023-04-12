import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: {},
	isLoggedIn: false,
	alert: '',
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (state, action) => {
			state.isLoggedIn = true;
			state.user = action.payload.user;
		},
		setAlert: (state, action) => {
			state.alert = action.payload;
		},
		clearAlert: (state) => {
			state.alert = initialState.alert;
		},
	},
});

export const { login, setAlert, clearAlert } = authSlice.actions;

export default authSlice.reducer;
