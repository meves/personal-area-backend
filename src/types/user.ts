export type UserModel = {
    id: number
    firstname: string
    lastname: string
    createdAt: Date
    updatedAt: Date
}

export type UserParams = {
    id?: number
    username?: string
}

export type UserBody = {
    firstname: string
    lastname: string
}
