'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { WalletSafeDTO } from '@/types/wallet';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text, CheckCircle2, AlertCircle } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<WalletSafeDTO>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<WalletSafeDTO, unknown> }) => (
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
    id: 'blockchain',
    accessorKey: 'blockchain',
    header: ({ column }: { column: Column<WalletSafeDTO, unknown> }) => (
      <DataTableColumnHeader column={column} title='Blockchain' />
    ),
    cell: ({ cell }) => <div className='capitalize'>{cell.getValue<string>()}</div>,
    meta: {
      label: 'Blockchain',
      placeholder: 'Filter by blockchain...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'secretStored',
    accessorKey: 'secretStored',
    header: 'Secret',
    cell: ({ cell }) => {
      const stored = cell.getValue<boolean>();
      return (
        <Badge variant={stored ? 'default' : 'destructive'} className='capitalize'>
          {stored ? (
            <>
              <CheckCircle2 className='mr-1 h-3 w-3' /> Stored
            </>
          ) : (
            <>
              <AlertCircle className='mr-1 h-3 w-3' /> Missing
            </>
          )}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ cell }) => {
      const value = cell.getValue<string>();
      const date = value ? new Date(value) : null;
      return (
        <div>
          {date && !isNaN(date.getTime())
            ? `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ cell }) => {
      const value = cell.getValue<string>();
      const date = value ? new Date(value) : null;
      return (
        <div>
          {date && !isNaN(date.getTime())
            ? `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : '-'}
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];