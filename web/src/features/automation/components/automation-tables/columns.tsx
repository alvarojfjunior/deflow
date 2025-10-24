'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { AutomationSafeDTO, AutomationStatus } from '@/types/automation';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<AutomationSafeDTO>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<AutomationSafeDTO, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Filter by name...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'strategy',
    accessorKey: 'strategy.name',
    header: ({ column }: { column: Column<AutomationSafeDTO, unknown> }) => (
      <DataTableColumnHeader column={column} title='Strategy' />
    ),
    cell: ({ row }) => <div className='capitalize'>{row.original.strategy.name}</div>,
    meta: {
      label: 'Strategy',
      placeholder: 'Filter by strategy...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'blockchain',
    accessorKey: 'strategy.params.blockchain',
    header: ({ column }: { column: Column<AutomationSafeDTO, unknown> }) => (
      <DataTableColumnHeader column={column} title='Blockchain' />
    ),
    cell: ({ row }) => <div className='capitalize'>{row.original.strategy.params.blockchain}</div>,
    meta: {
      label: 'Blockchain',
      placeholder: 'Filter by blockchain...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<AutomationSafeDTO, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<AutomationStatus>();
      const variant = status === 'active' ? 'default' : status === 'paused' ? 'secondary' : 'destructive';
      return <Badge variant={variant as any} className='capitalize'>{status}</Badge>;
    },
    meta: {
      label: 'Status',
      placeholder: 'Filter by status...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    enableHiding: false
  }
];