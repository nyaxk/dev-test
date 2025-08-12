import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Task } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface CreateModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    task: Task | null;
}

const formSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    subTasks: z.array(
        z.object({
            id: z.number(),
            title: z.string().min(1),
            finished: z.boolean(),
        })
    ),
});

type FormData = z.infer<typeof formSchema>;

export default function EditModal({ open, setOpen, task }: CreateModalProps) {
    const queryClient = useQueryClient();
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            subTasks: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'subTasks',
    });

    useEffect(() => {
        if (task) {
            form.reset({
                title: task.title,
                description: task.description,
                subTasks: task.subTasks,
            });
        }
    }, [task])

    const handleSubmit = useMutation({
        mutationFn: (values: FormData) => api.put(`/tasks/${task?.id}`, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Tarefa atualizada com sucesso');
            form.reset();
            setOpen(false);
        },
    })
    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
            {/* Fundo preto atrás do painel */}
            <div className="fixed inset-0 z-40 bg-black/50" aria-hidden="true" />

            {/* Painel do diálogo acima do fundo */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <DialogPanel className="max-w-lg space-y-4 border p-12 bg-white rounded">
                    <DialogTitle className="font-bold">Adicionar Tarefa</DialogTitle>
                    <Description>Adicionar uma nova tarefa e sub tarefas</Description>

                    <Controller
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <div className="space-y-2">
                                <label htmlFor="title">Título</label>
                                <input {...field} id="title" className="w-full border p-2" />
                            </div>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <div className="space-y-2">
                                <label htmlFor="description">Descrição</label>
                                <textarea {...field} id="description" className="w-full border p-2 resize-none" rows={5} />
                            </div>
                        )}
                    />

                    <div>
                        <div className='flex items-center justify-between mb-2'>
                            <label className="font-semibold">Subtarefas</label>
                            <button
                                type="button"
                                onClick={() => append({ id: 0, title: '', finished: false })}
                                className="mt-2 inline-block rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-2 mb-2 border">
                                <Controller
                                    control={form.control}
                                    name={`subTasks.${index}.title`}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            placeholder="Título da subtarefa"
                                            className="flex-1 p-2"
                                        />
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name={`subTasks.${index}.finished`}
                                    render={({ field }) => (
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                    )}
                                />

                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-600 hover:text-red-800 font-bold bg-red-100 hover:bg-red-200 p-2 mr-1"
                                    aria-label={`Remover subtarefa ${index + 1}`}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}


                    </div>

                    <Button
                        onClick={form.handleSubmit(data => handleSubmit.mutate(data))}
                        className="mt-4 w-full rounded bg-green-600 py-2 text-white hover:bg-green-700"
                    >
                        Salvar
                    </Button>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
