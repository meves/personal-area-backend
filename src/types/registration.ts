export type RegistrationModel = {
    id: number
    email: string
    password: string
    role: string
    createdAt: Date
    updatedAt: Date
}

export type RegistrationBody = {
    email: string
    password: string
    role: string
}