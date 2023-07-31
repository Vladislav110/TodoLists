import {setErrorAC, SetErrorActionType, setStatusAC, SetStatusActionType} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

export const handlerServerAppError = <T>(dispatch:ErrorUtilsDispatchType, data: ResponseType<T>) => {
    const error = data.messages[0]
    if (error) {
        dispatch(setErrorAC(error))
    } else {
        dispatch(setErrorAC("Some error"))
    }
    dispatch(setStatusAC("failed"))
}


export const handleServerNetworkError = (dispatch: ErrorUtilsDispatchType, error: string) => {
    dispatch(setErrorAC(error))
    dispatch(setStatusAC("failed"))
}

type ErrorUtilsDispatchType = Dispatch<SetStatusActionType | SetErrorActionType>