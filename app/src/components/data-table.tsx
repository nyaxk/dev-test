'use client';

import React from 'react';
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Loader2, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    emptyMessage?: string;
    onAdd?: () => void;
    onAddText?: string;
}
export default function DataTable<TData, TValue>({
    columns,
    data,
    isLoading = false,
    emptyMessage = "Nenhum dado encontrado",
    onAdd,
    onAddText = "Adicionar",
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            {/* Search bar */}
            <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-2">
                <div className="flex ml-auto">
                    {!!onAdd && (
                        <Button className='border p-2' onClick={onAdd}>
                            <Plus className="h-4 w-4" />
                            {onAddText}
                        </Button>
                    )}
                </div>
            </div>
            <div className="border">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-10">
                                        <Loader2 className="animate-spin mx-auto w-10 h-10" />
                                    </TableCell>
                                </TableRow>
                            ) : data.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-10">
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>)
}