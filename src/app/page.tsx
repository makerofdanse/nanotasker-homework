"use client";

import { useStore } from "@nanostores/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import {
    tasks,
    filter,
    addTask,
    deleteTask,
    toggleTask,
    clearCompleted,
    setFilter,
    startEdit,
    saveEdit,
    cancelEdit,
    moveTask,
} from "@/stores/task.store";
import TaskItem from "@/components/TaskItem";

export default function Home() {
    const taskList = useStore(tasks);
    const currentFilter = useStore(filter);
    const [newTask, setNewTask] = useState("");

    const filteredTasks = taskList.filter((task) => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    const hasCompleted = taskList.some((task) => task.completed);

    const handleAdd = () => {
        addTask(newTask);
        setNewTask("");
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container">
                <h1>Nanotasker</h1>
                <div className="input-container">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="new task"
                    />
                    <button onClick={handleAdd}>add</button>
                </div>
                <div className="filters">
                    <button className={currentFilter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
                        all
                    </button>
                    <button className={currentFilter === "active" ? "active" : ""} onClick={() => setFilter("active")}>
                        active
                    </button>
                    <button
                        className={currentFilter === "completed" ? "active" : ""}
                        onClick={() => setFilter("completed")}
                    >
                        completed
                    </button>
                    {hasCompleted && (
                        <button className="clear" onClick={clearCompleted}>
                            clear done
                        </button>
                    )}
                </div>
                <ul>
                    {filteredTasks.map((task, index) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            index={index}
                            onDelete={deleteTask}
                            onToggle={toggleTask}
                            onStartEdit={startEdit}
                            onSaveEdit={saveEdit}
                            onCancelEdit={cancelEdit}
                            onMove={moveTask}
                        />
                    ))}
                </ul>
            </div>
        </DndProvider>
    );
}
