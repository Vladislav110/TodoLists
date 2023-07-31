export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)

export const setErrorAC = (error: string | null) => {
    return {
        type: 'SET-ERROR',
        error
    } as const
}

export type ActionsType = SetStatusActionType | SetErrorActionType

export type SetStatusActionType = ReturnType<typeof setStatusAC>
export type SetErrorActionType = ReturnType<typeof setErrorAC>