import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Task from "../Task";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {TaskType} from "../Todolist";


export default {
    title: 'TODOLIST/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Task>;

const TaskCopy = ()=> {
    const task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistId1'][0])
    return <Task task ={task} todoListId = {'todolistId1'} />
}

const Template: ComponentStory<typeof Task> = (args) => <TaskCopy/>

export const taskIsNotDone = Template.bind({});


