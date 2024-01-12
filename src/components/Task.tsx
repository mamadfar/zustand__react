import {FC} from 'react';
import './Task.css';
import classNames from "classnames";
import {useStore} from "../store";
import Trash from "../assets/trash.svg";

interface ITaskProps {
    title: string;
    id: number;
}

const Task: FC<ITaskProps> = ({title, id}) => {

    const task = useStore(store => store.tasks.find(task => task.title === title));

    const deleteTask = useStore(store => store.deleteTask);

    const setDraggedTask = useStore(store => store.setDraggedTask);

    return (
        <div className="task" draggable onDragStart={() => setDraggedTask(id)}>
            <div>{title}</div>
            <div className="bottomWrapper">
                <div><img src={Trash} alt="Delete" onClick={() => deleteTask(id)}/></div>
                <div className={classNames("status", task?.state)}>{task?.state}</div>
            </div>
        </div>
    );
};

export default Task;
