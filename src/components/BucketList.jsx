import { useState, useEffect } from 'react';
import { database, ref, set, onValue, remove, off } from '../services/firebase';

const BucketList = ({ room }) => {
    const [todoInput, setTodoInput] = useState('');
    const [todos, setTodos] = useState({});

    useEffect(() => {
        if (!room) return;

        const todosRef = ref(database, `/rooms/${room}/todos`);
        const unsubTodos = onValue(todosRef, (snapshot) => {
            setTodos(snapshot.val() || {});
        });

        return () => off(todosRef);
    }, [room]);

    const handleAdd = () => {
        if (!todoInput.trim()) return;
        const id = Date.now();
        set(ref(database, `/rooms/${room}/todos/${id}`), {
            text: todoInput,
            done: false
        });
        setTodoInput('');
    };

    const handleToggle = (id, currentDone) => {
        set(ref(database, `/rooms/${room}/todos/${id}/done`), !currentDone);
    };

    const handleDelete = (id) => {
        remove(ref(database, `/rooms/${room}/todos/${id}`));
    };

    return (
        <div className="box">
            <h2>FUTURE OPS // BUCKET LIST</h2>
            <input
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                placeholder="Add a mission (movie, trip, recipe...)"
            />
            <button className="small-btn alt" onClick={handleAdd}>
                Add
            </button>
            <div className="todo-list">
                {Object.keys(todos)
                    .sort()
                    .map((id) => {
                        const item = todos[id];
                        return (
                            <div key={id} className="todo-item">
                                <input
                                    type="checkbox"
                                    checked={!!item.done}
                                    onChange={() => handleToggle(id, item.done)}
                                />
                                <span className={item.done ? 'done' : ''}>{item.text}</span>
                                <button
                                    className="delete-todo-btn"
                                    onClick={() => handleDelete(id)}
                                    title="Delete"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default BucketList;
