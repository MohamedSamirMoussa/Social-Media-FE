import { useEffect } from "react";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CheckIcon from "@mui/icons-material/Check";
import ScheduleIcon from "@mui/icons-material/Schedule";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import { getAllUsers, sendFriendRequest } from "../../redux/features/friends";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { friends, loading, sendingRequestId } = useAppSelector(
    (s) => s.friends,
  );
  const users = friends;
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleAddFriend = async (userId: string) => {
    try {
      await dispatch(sendFriendRequest(userId)).unwrap();
    } catch (error) {
      console.error("Send friend request error:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 6,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Typography
        sx={{
          fontSize: "1.6rem",
          fontWeight: 900,
          mb: 3,
        }}
      >
        Discover People
      </Typography>

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },

          gap: 2,
        }}
      >
        {users.map((user) => {
          const isSending = sendingRequestId === user._id;

          const isPendingSent = user.friendshipStatus === "pending_sent";

          const isPendingReceived =
            user.friendshipStatus === "pending_received";

          const isFriend = user.friendshipStatus === "accepted";

          return (
            <Box
              key={user._id}
              sx={{
                p: 2,

                border: "1px solid",

                borderColor: "divider",

                borderRadius: 3,

                backgroundColor: "background.paper",

                display: "flex",

                flexDirection: "column",

                gap: 2,

                transition: "0.2s ease",

                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                onClick={() => navigate(`/profile/${user._id}`)}
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
                    width: 55,
                    height: 55,
                  }}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    @{user.username}
                  </Typography>
                </Box>
              </Box>

              {isFriend ? (
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  startIcon={<CheckIcon />}
                >
                  Friends
                </Button>
              ) : isPendingSent ? (
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  startIcon={<CheckIcon />}
                >
                  Request Sent
                </Button>
              ) : isPendingReceived ? (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                >
                  Respond
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  disabled={isSending}
                  startIcon={
                    isSending ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <PersonAddAlt1Icon />
                    )
                  }
                  onClick={() => handleAddFriend(user._id)}
                >
                  {isSending ? "Sending..." : "Add Friend"}
                </Button>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AllUsers;
