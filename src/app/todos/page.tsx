'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import InputText from '@/components/InputText';
import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    completed: boolean;
}

const getPriorityStyle = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'bg-orange-500';
        case 'normal':
            return 'bg-blue-500';
        default:
            return 'bg-gray-300';
    }
};

function TaskList({
    tasks,
    onEdit,
    onDone,
    onDelete,
    isDoneList = false,
}: {
    tasks: Task[];
    onEdit?: (task: Task) => void;
    onDone?: (id: string) => void;
    onDelete?: (id: string) => void;
    isDoneList?: boolean;
}) {
    return (
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            {tasks.map((task) => (
                <Card key={task.id} className={`${isDoneList ? 'bg-green-600' : getPriorityStyle(task.priority)} text-white`}>
                    <CardContent className="flex justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-xs uppercase font-bold">{isDoneList ? 'DONE' : task.priority.toUpperCase()}</p>
                            <h3 className={`font-semibold text-lg ${isDoneList ? 'line-through' : ''}`}>{task.title}</h3>
                            <p className={`text-sm ${isDoneList ? 'opacity-80' : ''}`}>{task.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {!isDoneList && (
                                <>
                                    <Edit className="w-4 h-4 hover:text-green-300 cursor-pointer" onClick={() => onEdit?.(task)} />
                                    <Trash2 className="w-4 h-4 hover:text-green-300 cursor-pointer" onClick={() => onDelete?.(task.id)} />
                                    <button
                                        onClick={() => onDone?.(task.id)}
                                        className="w-5 h-5 rounded-full border-2 border-white bg-white hover:bg-green-500 transition"
                                    >
                                        <span className="block w-full h-full rounded-full" />
                                    </button>
                                </>
                            )}
                            {isDoneList && (
                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-sm font-bold">✓</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function TodosPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [form, setForm] = useState({ title: '', description: '', priority: 'normal' });

    const day = dayjs().format('D');
    const weekday = dayjs().format('dddd');
    const monthYear = dayjs().format('MMM YYYY');

    useEffect(() => {
        const id = localStorage.getItem('user_id');
        if (id) setUserId(id);
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get(`/api/todos?user_id=${userId}`);
            setTasks(response.data.data);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAddOrUpdateTask = async () => {
        if (!form.title.trim()) return;

        const payload = { ...form, completed: false };

        try {
            if (editingTaskId) {
                await axios.put('/api/todos', { id: editingTaskId, ...payload });
            } else {
                await axios.post('/api/todos', { ...payload, user_id: userId });
            }

            await fetchTodos();
            setForm({ title: '', description: '', priority: 'normal' });
            setEditingTaskId(null);
            setIsDialogOpen(false);
        } catch (err) {
            console.error('Failed to save task:', err);
        }
    };

    const handleMarkDone = async (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        try {
            await axios.put('/api/todos', { ...task, completed: true });
            fetchTodos();
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/todos?id=${id}`);
            fetchTodos();
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    const openEditDialog = (task: Task) => {
        setIsDialogOpen(true);
        setEditingTaskId(task.id);
        setForm({ title: task.title, description: task.description, priority: task.priority });
    };

    const todoTasks = tasks.filter((t) => !t.completed);
    const doneTasks = tasks.filter((t) => t.completed);

    return (
        <div className="flex mt-10 justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl/20 p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="text-5xl font-bold leading-none">{day}</span>
                        <div className="flex flex-col justify-center leading-snug">
                            <p className="text-sm font-semibold text-gray-800">{weekday}</p>
                            <p className="text-sm text-gray-600">{monthYear}</p>
                        </div>
                    </div>

                    <Dialog
                        open={isDialogOpen}
                        onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) {
                                setEditingTaskId(null);
                                setForm({ title: '', description: '', priority: 'normal' });
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => setIsDialogOpen(true)}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1.5 text-sm rounded-full"
                            >
                                + New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingTaskId ? 'Edit Task' : 'Add Task'}</DialogTitle>
                                <DialogDescription>Fill in the details of your task.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 p-4 rounded bg-gray-50">
                                <InputText
                                    type="text"
                                    placeholder="Task title"
                                    className="w-full border p-2 rounded text-sm"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                                <textarea
                                    placeholder="Description"
                                    className="w-full border p-2 rounded text-sm"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                                <select
                                    className="w-full border p-2 rounded text-sm"
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddOrUpdateTask}>{editingTaskId ? 'Update' : 'Add'} Task</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* TODO TASKS */}
                {todoTasks.length > 0 && (
                    <>
                        <h2 className="text-base font-bold border-b pb-1">TODO TASKS</h2>
                        <TaskList tasks={todoTasks} onEdit={openEditDialog} onDone={handleMarkDone} onDelete={handleDelete} />
                    </>
                )}

                {/* DONE TASKS */}
                {doneTasks.length > 0 && (
                    <>
                        <h2 className="text-base font-bold border-t mt-6 pt-4 pb-1">DONE TASKS</h2>
                        <TaskList tasks={doneTasks} isDoneList />
                    </>
                )}
            </div>
        </div>
    );
}
