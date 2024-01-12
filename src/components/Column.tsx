import {FC, useState, DragEvent} from 'react';
import './Column.css';
import Task from "./Task.tsx";
import {useStore} from "../store";
import {shallow} from "zustand/shallow";
import classNames from "classnames";

interface IColumnProps {
    state: string
}

const Column: FC<IColumnProps> = ({state}) => {

    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const [drop, setDrop] = useState(false);

    // * Way 1
    const tasks = useStore(store =>
            store.tasks.filter(task => task.state === state),
        // * Way A
        // (prev, next) => {
        //     const longest = prev.length > next.length ? prev.length : next.length;
        //     for (let i = 0; i < longest; i++) {
        //         if (!prev[i] || !next[i]) return false;
        //         if (prev[i] !== next[i]) return false;
        //     }
        //     return true;
        // }
        shallow // * Way B
    );
    // * Way 2
    // const filteredTasks = useMemo(() => tasks.filter(task => task.state === state), [tasks, state]);

    const addTask = useStore(store => store.addTask);

    const setDraggedTask = useStore(store => store.setDraggedTask);
    const draggedTaskId = useStore(store => store.draggedTaskId);
    const movedTask = useStore(store => store.moveTask);

    const handleSubmit = () => {
        addTask(text, state);
        setText("");
        setOpen(false);
    }

    const handleDrop = () => {
        movedTask(draggedTaskId, state);
        setDraggedTask(null);
        setDrop(false);
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDrop(true);
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDrop(false);
    }

    return (
        <div className={classNames('column', {drop})} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave}>
            <div className="titleWrapper">
                <p>{state}</p>
                <button onClick={() => setOpen(true)}>Add</button>
            </div>
            {tasks.map(task => (
                <Task key={task.id} title={task.title} id={task.id}/>
            ))}
            {open && (
                <div className="modal">
                    <div className="modal__content">
                        <input type="text" onChange={e => setText(e.target.value)} value={text}/>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Column;


// const RefTest = () => {
//     const ref = useRef<any>(null);
//
//     useEffect(() => {
//         useStore.subscribe(
//             store => store.tasks,
//             tasks => ref.current = tasks
//         )
//     }, [])
//     return ref.current
// }