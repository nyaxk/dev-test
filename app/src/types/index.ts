export interface Task {
    id: number;
    title: string;
    description: string;
    subTasks: SubTask[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SubTask {
    id: number;
    title: string;
    finished: boolean;
    taskId: number;
    task?: Task;
    createdAt: Date;
    updatedAt: Date;
}