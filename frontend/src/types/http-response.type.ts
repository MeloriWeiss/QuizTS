export type RefreshResponseType = {
    error: boolean,
    accessToken?: string,
    refreshToken?: string,
    message: string,
}
export type LogoutResponseType = {
    error: boolean,
    message: string,
}
export type QuizListType = {
    id: number,
    name: string,
}
export type TestResultType = {
    score: number,
    testId: number,
    total: number,
    userId: number,
}
export type DefaultResponseType = {
    error: boolean,
    message: string,
}
export type SignupResponseType = {
    error: boolean,
    user?: { id: number, email: string, name: string, lastName: string },
    message: string,
}
export type LoginResponseType = {
    error: boolean,
    accessToken?: string,
    refreshToken?: string,
    fullName?: string,
    userId?: number,
    message: string,
}
export type PassTestResponseType = {
    score: number,
    total: number,
}
