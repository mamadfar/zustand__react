import {expect, test, vi} from "vitest";
import {useStore} from "./index.ts";
import {useEffect} from "react";
import {render} from "@testing-library/react";

vi.mock('zustand')

const TestComponent = ({selector, effect}) => {
    const items = useStore(selector);

    useEffect(() => effect(items), [items])

    return null;
}

test("Should return default value at the start", () => {
    const selector = (store) => store.tasks;
    const effect = vi.fn();

    render(<TestComponent selector={selector} effect={effect} />);
    expect(effect).toHaveBeenCalledWith([])
})

test("Should add an items to the store and return the effect", () => {
    const selector = (store) => ({tasks: store.tasks, addTask: store.addTask, deleteTask: store.deleteTask});

    let createdTask = false;
    let currentItems;

    const effect = vi.fn().mockImplementation((items) => {
        currentItems = items;
        if (!createdTask) {
            items.addTask('a', 'b', 1);
            createdTask = true;
        } else if (items.tasks.length === 1) {
            items.deleteTask(1)
        }
    });

    render(<TestComponent selector={selector} effect={effect} />);
    expect(effect).toHaveBeenCalledTimes(3);
    expect(currentItems?.tasks).toEqual([]); // we added a task then deleted it
})