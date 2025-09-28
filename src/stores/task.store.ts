import { atom, map } from "nanostores";

export interface Task {
    id: number;
    text: string;
    completed: boolean;
    editing?: boolean;
    editText?: string;
}

export const tasks = atom<Task[]>([]);

export const filter = atom<"all" | "active" | "completed">("all");

export const addTask = (text: string) => {
    if (text.trim()) {
        const newTask: Task = { id: Date.now(), text, completed: false };
        tasks.set([...tasks.get(), newTask]);
    }
};

export const deleteTask = (id: number) => {
    tasks.set(tasks.get().filter((task) => task.id !== id));
};

export const toggleTask = (id: number) => {
    tasks.set(tasks.get().map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
};

export const clearCompleted = () => {
    tasks.set(tasks.get().filter((task) => !task.completed));
};

export const setFilter = (newFilter: "all" | "active" | "completed") => {
    filter.set(newFilter);
};

export const startEdit = (id: number) => {
    tasks.set(tasks.get().map((task) => (task.id === id ? { ...task, editing: true, editText: task.text } : task)));
};

export const saveEdit = (id: number, newText: string) => {
    if (newText.trim()) {
        tasks.set(tasks.get().map((task) => (task.id === id ? { ...task, text: newText, editing: false } : task)));
    }
};

export const cancelEdit = (id: number) => {
    tasks.set(tasks.get().map((task) => (task.id === id ? { ...task, editing: false } : task)));
};

export const moveTask = (fromIndex: number, toIndex: number) => {
    const currentTasks = tasks.get();
    const [moved] = currentTasks.splice(fromIndex, 1);
    currentTasks.splice(toIndex, 0, moved);
    tasks.set([...currentTasks]);
};
