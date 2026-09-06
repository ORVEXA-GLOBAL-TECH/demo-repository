export interface UserDto {
    id: number
    email: string
    name: string
    role: 'ADMIN' | 'MANAGER' | 'ACCOUNTANT'
}

export interface UserForm {
    email: string
    name: string
    role: 'ADMIN' | 'MANAGER' | 'ACCOUNTANT'
    password: string
}

function getAuthHeaders() {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchUsers(role: string) {
    const query = role && role !== 'all' ? `?role=${encodeURIComponent(role)}` : ''
    const response = await fetch(`/api/users${query}`, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    })
    if (!response.ok) {
        throw new Error('Failed to fetch users')
    }
    return response.json() as Promise<UserDto[]>
}

export async function createUser(data: UserForm) {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error('Failed to create user')
    }
    return response.json() as Promise<UserDto>
}

export async function updateUser(id: number, data: UserForm) {
    const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error('Failed to update user')
    }
    return response.json() as Promise<UserDto>
}

export async function deleteUser(id: number) {
    const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders()
        }
    })
    if (!response.ok) {
        throw new Error('Failed to delete user')
    }
}
