import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";

interface Task {
    id: number;
    text: string;
    completed: boolean;
    editing?: boolean;
    editText?: string;
}

interface TaskItemProps {
    task: Task;
    index: number;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
    onStartEdit: (id: number) => void;
    onSaveEdit: (id: number, text: string) => void;
    onCancelEdit: (id: number) => void;
    onMove: (from: number, to: number) => void;
}

const ItemType = "TASK";

const TaskItem: React.FC<TaskItemProps> = ({
    task,
    index,
    onDelete,
    onToggle,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onMove,
}) => {
    const [editText, setEditText] = useState(task.editText || task.text);
    const ref = useRef<HTMLLIElement>(null);

    const [{ isDragging }, drag] = useDrag<{ index: number }, unknown, { isDragging: boolean }>({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop<{ index: number }, void, { handlerId: Identifier | null }>({
        accept: ItemType,
        hover: (item: { index: number }, monitor) => {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            onMove(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <li ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
            {!task.editing ? (
                <>
                    <span className={task.completed ? "completed" : ""}>{task.text}</span>
                    <button className="edit-btn" onClick={() => onStartEdit(task.id)}>
                        edit
                    </button>
                    <button className="delete-btn" onClick={() => onDelete(task.id)}>
                        delete
                    </button>
                </>
            ) : (
                <>
                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <button
                        className="save-btn"
                        onClick={() => {
                            onSaveEdit(task.id, editText);
                            setEditText("");
                        }}
                    >
                        save
                    </button>
                    <button className="cancel-btn" onClick={() => onCancelEdit(task.id)}>
                        cancel
                    </button>
                </>
            )}
        </li>
    );
};

export default TaskItem;
