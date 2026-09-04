import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import {
  getPendingRequests,
  updateFriendRequest,
} from "../../redux/features/friends";
import { useEffect } from "react";

const FriendRequests = () => {
  const dispatch = useAppDispatch();

  const { requests, loading } = useAppSelector((state) => state.friends);

  console.log("requests", requests);

  const handleResponse = async (
    friendRequestId: string,
    response: "accepted" | "rejected",
  ) => {
    try {
      const res = await dispatch(
        updateFriendRequest({
          friendRequestId,
          response,
        }),
      ).unwrap();

      toast.success(res.message ?? "Friend request updated");
    } catch (error) {
      const err = error as {
        errMessage?: string;
      };

      toast.error(err?.errMessage ?? "Failed to update friend request");
    }
  };

  useEffect(() => {
    const fetching = async () => {
      const res = await dispatch(getPendingRequests());
      console.log(res);
    };
    fetching()
  }, [dispatch]);

  if (loading && requests.length === 0) {
    return (
      <Box
        sx={{
          mt: 4,
          py: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 8,
      }}
    >
      <Typography
        sx={{
          fontSize: "1.5rem",
          fontWeight: 900,
          mb: 2,
        }}
      >
        Friend Requests
      </Typography>

      {requests.length === 0 ? (
        <Box
          sx={{
            p: 4,

            border: "1px solid",

            borderColor: "divider",

            borderRadius: 3,

            backgroundColor: "background.paper",

            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            No friend requests
          </Typography>

          <Typography variant="body2" color="text.secondary">
            New friend requests will appear here.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },

            gap: 2,
          }}
        >
          {requests.map((request) => {
            const user = request.requestFromId;

            return (
              <Box
                key={request._id}
                sx={{
                  p: 2.5,

                  border: "1px solid",

                  borderColor: "divider",

                  borderRadius: 3,

                  backgroundColor: "background.paper",

                  display: "flex",

                  flexDirection: "column",

                  gap: 2,

                  transition: "all 0.2s ease",

                  "&:hover": {
                    boxShadow: 3,

                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: 1.5,
                  }}
                >
                  <Avatar
                    src={user.profileImage?.secure_url}
                    alt={user.username}
                    sx={{
                      width: 56,
                      height: 56,
                    }}
                  />

                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={
                      loading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <CheckIcon />
                      )
                    }
                    disabled={loading}
                    onClick={() => handleResponse(request._id, "accepted")}
                    sx={{
                      borderRadius: 3,

                      textTransform: "none",

                      fontWeight: 700,
                    }}
                  >
                    Accept
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    disabled={loading}
                    onClick={() => handleResponse(request._id, "rejected")}
                    sx={{
                      borderRadius: 3,

                      textTransform: "none",

                      fontWeight: 700,
                    }}
                  >
                    Reject
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default FriendRequests;
