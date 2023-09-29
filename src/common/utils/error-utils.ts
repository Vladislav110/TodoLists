import { BaseResponseType } from "api/todolists-api";
import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";
import { AppDispatch } from "app/store";
import axios from "axios";

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    if (data.messages.length) {
      dispatch(appActions.setAppError({ error: data.messages[0] }));
    } else {
      dispatch(appActions.setAppError({ error: "Some error occurred" }));
    }
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};


export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
  let errorMessage = "Some error occurred";

// Проверка на наличие axios ошибки
  if (axios.isAxiosError(err)) {

    errorMessage = err.response?.data.message || err?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err);
  }
  dispatch(appActions.setAppError({ error: errorMessage }));
  dispatch(appActions.setAppStatus({ status: "failed" }));
};