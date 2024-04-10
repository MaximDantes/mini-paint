export type Post = {
    id: string
    user: {
        uid: string
        email: string
        displayName?: string
    }
    fileUrl: string
    createdAt: Date
}
