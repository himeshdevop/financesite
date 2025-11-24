import React from 'react';
import { cn } from '../Layout';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    className?: string;
}

export function Table<T extends { id: string }>({ data, columns, onRowClick, className }: TableProps<T>) {
    return (
        <div className={cn("w-full overflow-x-auto rounded-xl border border-white/5", className)}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 bg-surface/50">
                        {columns.map((col, idx) => (
                            <th key={idx} className={cn("p-4 text-xs font-medium text-secondary uppercase tracking-wider", col.className)}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="p-8 text-center text-secondary">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    "group transition-colors hover:bg-white/5",
                                    onRowClick && "cursor-pointer"
                                )}
                            >
                                {columns.map((col, idx) => (
                                    <td key={idx} className={cn("p-4 text-sm text-white/90", col.className)}>
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(item)
                                            : (item[col.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
