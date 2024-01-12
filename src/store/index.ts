import {create} from "zustand";
import {devtools, persist, subscribeWithSelector} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";

interface ITask {
    id: number
    title: string
    state: string
}

interface ITaskStore {
    tasks: Array<ITask>;
    draggedTaskId: number | null;
    tasksInOnGoing: number;
    addTask: (title: string, state: string) => void,
    deleteTask: (id: number) => void
    setDraggedTask: (id: number | null) => void,
    moveTask: (id: number | null, state: string) => void
}

// const logger = (config: any) => (set: any, get: any, api: any) => config(
//     (...args: any[]) => {
//         console.log(args);
//         set(...args);
//     },
//     get,
//     api
// )
export const useStore = create<ITaskStore>()(subscribeWithSelector(persist(devtools(immer((set) => ({
    tasks: [],
    draggedTaskId: null,
    tasksInOnGoing: 0,
    addTask: (title: string, state: string, id?: number) => set(
        // (store) => store.tasks.push({id: id ? id : Math.floor(Math.random() * 999999999), title, state}) // ? Immer
        store => ({tasks: [...store.tasks, {id: id ? id : Math.floor(Math.random() * 999999999), title, state}]}) // ? Spread
        ,false, 'addTask'),
    deleteTask: (id: number) => set(store => ({tasks: store.tasks.filter(task => task.id !== id)}),false, 'deleteTask'),
    setDraggedTask: (id: number | null) => set({draggedTaskId: id},false, 'setDraggedTask'),
    moveTask: (id: number | null, state: string) => set(store => ({
        tasks: store.tasks.map(task => task.id === id ? {
            ...task,
            state
        } : task)
    }),false, 'moveTask')
}))), {name: 'task-store'})));

useStore.subscribe((store) => store.tasks, (newTasks, prevTasks) => {
    useStore.setState({tasksInOnGoing: newTasks.filter(task => task.state === "ONGOING").length});
    console.log('Tasks in ONGOING: ', useStore.getState().tasksInOnGoing);
})