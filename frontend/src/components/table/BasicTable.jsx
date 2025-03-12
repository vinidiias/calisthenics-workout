import { useContext, useMemo, useState } from "react"
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { Button, Typography } from "@mui/material";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export const BasicTable = ({ dataTable, handleFollow, search, setSearch }) => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const columns = useMemo(
    () => [
      {
        accessorKey: "photo",
        header: "Photo",
        cell: ({ row }) => (
          <img
            src={row.original.photo}
            alt=""
            className="w-11 h-11 object-cover rounded-full cursor-pointer"
            onClick={() => navigate(`/profile/${row.original._id}`)}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <Typography
              onClick={() => navigate(`/profile/${row.original._id}`)}
              sx={{ cursor: "pointer"}}
            >
              {row.original.name}
            </Typography>
            <Typography>{row.original.biography}</Typography>
          </div>
        ),
      },
      {
        header: "Action",
        cell: ({ row }) => {
          return (
            <>
              {user._id === row.original._id ? null : (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontSize: ".9em",
                    fontWeight: "regular",
                    backgroundColor: "var(--color-gray-700)",
                    borderRadius: 5,
                  }}
                  onClick={() => handleFollow({ userFrom: user._id, userTo: row.original._id })}
                >
                  {user.following.includes(row.original._id)
                    ? "Stop Following"
                    : "Follow"}
                </Button>
              )}
            </>
          );
        },
      },
    ],
    [user, handleFollow, navigate] // ✅ `columns` não depende de `dataTable`, então pode ter uma dependência vazia
  );

    const data = useMemo(() => dataTable, [dataTable]);

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      globalFilterFn: (row, columnId, filterValue) =>
        row.original.name.toLowerCase().includes(filterValue.toLowerCase()),
      state: {
        globalFilter: search,
      },
    });
    
    return (
      <>
        {table.getRowModel().rows.length > 0 ? (
          <table className="text-left">
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="flex items-start mb-5">
                  {row.getVisibleCells().map((cell) => (
                    <>
                      <td key={cell.id} className="px-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center w-full">User Not Found!</p>
        )}
      </>
    );
}