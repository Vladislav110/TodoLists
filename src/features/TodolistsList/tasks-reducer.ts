import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils";
import { appActions } from "app/app-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { createAppAsyncThunk } from "common/utils/createAsyncThunk";


const slice = createSlice({
  name: "tasksReducer",
  initialState: {} as TasksStateType,
  reducers: {
    clearTasks: () => {
      return {};
    }
  },

  extraReducers: builder => {
    builder
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex(t => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks.splice(index, 1);
        }
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex(t => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel };
        }
      })
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      });
  }
});


const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>("tasksReducer/fetchTasks", async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTasks(todolistId);
    const tasks = res.data.items;
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { tasks, todolistId };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export const ResultCode = {
  success :0,
  error :1,
  captcha :10
} as const

const addTask = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>("tasksReducer/addTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
    if (res.data.resultCode === ResultCode.success) {
      const task = res.data.data.item;
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { task };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});


const updateTask = createAppAsyncThunk<
  { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string },
  { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }>
("tasksReducer/updateTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  try {

    const state = getState();
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
    if (!task) {
      console.warn("task not found in the state");
      return rejectWithValue(null);
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel
    };

    const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
    if (res.data.resultCode === ResultCode.success) {
      return { taskId: arg.taskId, domainModel: arg.domainModel, todolistId: arg.todolistId };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});


const removeTask = createAppAsyncThunk<any, { taskId: string, todolistId: string }>("tasksReducer/removeTask", async (arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    let res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId);
    if (res) {
      return ({ taskId: arg.taskId, todolistId: arg.todolistId });
    }
  } catch (e) {
    return rejectWithValue(null);
  }

});

export const tasksActions = slice.actions;
export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };


export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
