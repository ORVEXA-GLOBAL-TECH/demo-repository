export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    role: string
}

export async function login(payload: LoginPayload) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        throw new Error('Invalid credentials')
    }

    return response.json() as Promise<LoginResponse>
}
