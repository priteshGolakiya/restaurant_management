import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
    items: {
        isactive: boolean, role: string, user_name: string, userid: string
    };
}

const initialState: UserState = {
    items: {
        isactive: true,
        role: "",
        user_name: "",
        userid: ""
    },
};

export const userSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.items = action.payload;
        },
        clearUserDetails: (state) => {
            state.items = initialState.items
        }
    },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;
