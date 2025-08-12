"use client";

import DataTable from "@/components/data-table";
import CreateModal from "@/components/tasks/create-modal";
import EditModal from "@/components/tasks/edit-modal";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { SubTask, Task } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [createModal, setCreateModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const { data: tasks, isLoading: tasksLoading, refetch: tasksRefetch } = useQuery({
    initialData: [],
    queryKey: ["tasks"],
    queryFn: async () => api.get("/tasks").then(({ data }) => data),
  })

  const handleDelete = useMutation({
    mutationFn: (id: number) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      toast.success('Tarefa excluída com sucesso')
      tasksRefetch()
    }
  })

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Título",
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: info => (info.getValue() as string).length > 30 ? (info.getValue() as string).slice(0, 30) + '...' : info.getValue()
    },
    {
      accessorKey: "subTasks",
      header: "Sub-tarefas",
      cell: info => (info.getValue() as SubTask[]).length
    },
    {
      accessorKey: "actions",
      header: "Ações",
      cell: info => <div className="flex gap-2">
        <Button onClick={() => {
          setSelectedTask(info.row.original)
          setEditModal(true)
        }}>
          <Edit />
        </Button>
        <Button onClick={() => {
          if (confirm('Tem certeza que deseja excluir essa tarefa?')) {
            handleDelete.mutate(info.row.original.id)
          }
        }}>
          <Trash2 />
        </Button>
      </div>
    }
  ]

  return (
    <div className="container mx-auto py-6 space-y-6 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold ">Gestão de Tarefas</h1>
          <p className=" mt-1">Gerencie suas tarefas com facilidade</p>
        </div>
      </div>

      <DataTable
        isLoading={tasksLoading}
        columns={columns}
        data={tasks}
        onAdd={() => setCreateModal(true)}
        emptyMessage="Nenhuma tarefa encontrada"
      />

      <CreateModal open={createModal} setOpen={setCreateModal} />
      <EditModal open={editModal} setOpen={setEditModal} task={selectedTask} />
    </div>
  );
}
