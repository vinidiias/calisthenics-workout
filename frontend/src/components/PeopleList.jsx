import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
// MATERIAL UI
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
// TANSTACK TABLE
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// CONTEXT
import { UserContext } from "../contexts/UserContext";
// API
import { deleteFollowToUser, postFollowToUser } from "../services/userApi";
// HOOKS
import { useResponseNotifier } from "../hooks/useResponseNotifier";

export const PeopleList = ({ people }) => {
  const [pending, setPending] = useState(() => {
    return (
      people?.map((p) => {
        return p !== null ? { [p?._id]: false } : {};
      }) ?? []
    );
  });
  
  const { user, setUser } = useContext(UserContext);
  const { handleErrorResponse } = useResponseNotifier();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: handleFollow } = useMutation({
    mutationFn: postFollowToUser,
    onSuccess: (resp) => {
      setUser((prev) => ({
        ...prev,
        following: resp.userFrom.following,
      }));
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (resp) => handleErrorResponse(resp.response.data),
  });

  const { mutateAsync: handleUnfollow } = useMutation({
    mutationFn: deleteFollowToUser,
    onSuccess: (resp) => {
      setUser((prev) => ({
        ...prev,
        following: resp.userFrom?.following,
      }));
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (resp) => handleErrorResponse(resp.response.data),
  });

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
          const isFollowing = user.following.includes(row.original._id);
          return (
            <>
              {user._id !== row.original._id && (
                <Button
                  loading={pending[row.original._id]}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setPending((prev) => ({
                      ...prev,
                      [row.original._id]: true,
                    }));

                    if (isFollowing) handleUnfollow({ userFrom: user._id, userTo: row.original._id });
                    else handleFollow({ userFrom: user._id, userTo: row.original._id });
                    

                    setPending((prev) => ({
                      ...prev,
                      [row.original._id]: false,
                    }));
                  }}
                >
                  {isFollowing
                    ? "Stop Following"
                    : "Follow"}
                </Button>
              )}
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, handleFollow, navigate],
  );

  const data = useMemo(() => people, [people]);

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
          Empty.
        </Typography>
      )}
    </>
  );
};
