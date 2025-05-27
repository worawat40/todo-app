'use client';
import { useState } from 'react';

export default function TodosPage() {
    const [todoTasks, setTodoTasks] = useState([
        {
            id: 1,
            title: 'Buy Presents',
            description: 'Go and get Christmas presents for Lana and Sandra',
            priority: 'high',
            done: false,
        },
    ]);

    const [doneTasks, setDoneTasks] = useState([
        {
            id: 4,
            title: 'Call James',
            description: 'Call James for a meeting update',
            priority: 'done',
            done: true,
        },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'normal',
    });

    const handleAddTask = () => {
        const newTask = {
            id: Date.now(),
            ...form,
            done: false,
        };
        setTodoTasks([...todoTasks, newTask]);
        setForm({ title: '', description: '', priority: 'normal' });
        setShowForm(false);
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-orange-500';
            case 'normal':
                return 'bg-blue-500';
            case 'done':
                return 'bg-green-600';
            default:
                return 'bg-gray-300';
        }
    };

    return (
        <div className="flex mt-10 justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl/20 p-8 space-y-6">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-5xl font-bold leading-none">25</span>
                            <div className="flex flex-col justify-center leading-snug">
                                <p className="text-base font-medium text-gray-800">Tuesday</p>
                                <p className="text-base text-gray-600">Dec 2018</p>
                            </div>
                        </div>

                        <button
                            onClick={handleAddTask}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1.5 text-sm rounded-full transition"
                        >
                            + New Task
                        </button>
                    </div>

                    {/* Todo Tasks */}
                    <div>
                        <h2 className="text-lg font-bold border-b pb-1">TODO TASKS</h2>
                        <div className="space-y-4 mt-4">
                            {todoTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`rounded-lg text-white p-4 flex items-center justify-between shadow ${getPriorityStyle(task.priority)}`}
                                >
                                    <div>
                                        <p className="text-xs uppercase font-bold">
                                            {task.priority === 'high' ? 'HIGH PRIORITY' : 'NORMAL PRIORITY'}
                                        </p>
                                        <h3 className="font-semibold text-lg">{task.title}</h3>
                                        <p className="text-sm">{task.description}</p>
                                    </div>
                                    <div className="w-5 h-5 border-2 border-white rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Done Tasks */}
                    <div>
                        <h2 className="text-lg font-bold border-b pb-1">DONE TASKS</h2>
                        <div className="space-y-4 mt-4">
                            {doneTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`rounded-lg text-white p-4 flex items-center justify-between shadow ${getPriorityStyle(task.priority)}`}
                                >
                                    <div>
                                        <p className="text-xs uppercase font-bold">DONE</p>
                                        <h3 className="font-semibold text-lg">{task.title}</h3>
                                        <p className="text-sm">{task.description}</p>
                                    </div>
                                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                        <span className="text-green-500 text-sm font-bold">✓</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
