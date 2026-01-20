import { useContext, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Box,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export const ParticipantsList = ({ dataTable, handleFollow }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "photo",
        header: "Photo",
        cell: ({ row }) => (
          <Box
            component="img"
            src={row.original.photo}
            alt=""
            sx={{
              width: 44,
              height: 44,
              objectFit: "cover",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/profile/${row.original._id}`)}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              onClick={() => navigate(`/profile/${row.original._id}`)}
              sx={{ cursor: "pointer" }}
            >
              {row.original.name}
            </Typography>
          </Box>
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
                  onClick={() =>
                    handleFollow({
                      userFrom: user._id,
                      userTo: row.original._id,
                    })
                  }
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
    [user, handleFollow, navigate],
  );

  const data = useMemo(() => dataTable, [dataTable]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {table.getRowModel().rows.length > 0 ? (
        <TableContainer>
          <Table>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        px: 1.5,
                        flex: 1,
                        borderColor: "divider",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ textAlign: "center", width: "100%", py: 2 }}>
          User Not Found!
        </Typography>
      )}
    </>
  );
};
