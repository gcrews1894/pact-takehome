'use client';

import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ResourceDocument } from '@/types/resource';
import { formatRelativeTime } from '@/lib/date-utils';

interface ResourceTableProps {
  data: ResourceDocument[];
  loading: boolean;
  onRowClick: (resource: ResourceDocument) => void;
}

const columns: ColumnDef<ResourceDocument>[] = [
  {
    accessorKey: 'resource.metadata.resourceType',
    header: 'Resource Type',
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: 'resource.metadata.createdTime',
    header: 'Created',
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">
        {formatRelativeTime(getValue() as string)}
      </div>
    ),
  },
  {
    accessorKey: 'resource.metadata.fetchTime',
    header: 'Fetched',
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">
        {formatRelativeTime(getValue() as string)}
      </div>
    ),
  },
];

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      ))}
    </div>
  );
}

export const ResourceTable = React.memo<ResourceTableProps>(function ResourceTable({ data, loading, onRowClick }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-semibold">No resources found</h3>
          <p className="text-muted-foreground">
            No resources are currently available in the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});