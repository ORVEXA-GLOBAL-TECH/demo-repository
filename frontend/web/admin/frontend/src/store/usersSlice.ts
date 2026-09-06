import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type RoleFilter = 'all' | 'admin' | 'manager' | 'accountant'

interface UsersState {
    roleFilter: RoleFilter
}

const initialState: UsersState = {
    roleFilter: 'all'
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setRoleFilter(state, action: PayloadAction<RoleFilter>) {
            state.roleFilter = action.payload
        }
    }
})

export const { setRoleFilter } = usersSlice.actions
export default usersSlice.reducer
