import React, { FC, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { TrackingData } from "../types/TrackingData";

interface TrackingTableProps {
  data: TrackingData[];
  onCheckHistory?: (id: string) => void;
  onStatusClick?: (status: string, id: string) => void;
  isLoading?: boolean;
}

const columnHelper = createColumnHelper<TrackingData>();

const LoadingSkeleton: React.FC = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <tr key={i} className="border-b border-gray-200 animate-pulse">
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </td>
      </tr>
    ))}
  </>
);

export const TrackingTable: FC<TrackingTableProps> = ({
  data,
  onCheckHistory,
  onStatusClick,
  isLoading = false,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("created", {
        header: "CREATED",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("recipient", {
        header: "RECIPIENT",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("sender", {
        header: "SENDER",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("trackingNumber", {
        header: "Tracking Number",
        cell: (info) => (
          <span
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
              case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
              case "in_transit":
              case "in transit":
                return "bg-blue-100 text-blue-800 border-blue-200";
              case "pending":
              case "created":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
              case "cancelled":
              case "canceled":
                return "bg-red-100 text-red-800 border-red-200";
              case "returned":
                return "bg-orange-100 text-orange-800 border-orange-200";
              default:
                return "bg-gray-100 text-gray-800 border-gray-200";
            }
          };

          return (
            <span
              onClick={() => onStatusClick?.(status, info.row.original.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                status
              )} ${
                onStatusClick
                  ? "cursor-pointer hover:opacity-80 transition-opacity"
                  : ""
              }`}
            >
              {status.replace("_", " ").toUpperCase()}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <button
            onClick={() => onCheckHistory?.(info.row.original.id)}
            disabled={!info.row.original.trackingNumber || isLoading}
            className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check History
          </button>
        ),
      }),
    ],
    [onCheckHistory, onStatusClick, isLoading]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <div className="overflow-x-auto shadow-lg ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <LoadingSkeleton />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No tracking data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            Loading packages...
          </div>
        ) : (
          `Total items: ${data.length}`
        )}
      </div>
    </div>
  );
};
