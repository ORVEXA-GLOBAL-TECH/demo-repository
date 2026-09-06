import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersSlice'
import authReducer from './authSlice'

export const store = configureStore({
    reducer: {
        users: usersReducer,
        auth: authReducer
    }
})
