import {
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import MessageIcon from "@mui/icons-material/Message";
import CheckIcon from "@mui/icons-material/Check";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/hooks";

import { sendFriendRequest } from "../../redux/features/friends";

interface ProfileActionsProps {
  isOwner?: boolean;
  userId: string;
  friendshipStatus?:
    | "none"
    | "pending_sent"
    | "pending_received"
    | "accepted";
}

const ProfileActions = ({
  isOwner = false,
  userId,
  friendshipStatus = "none",
}: ProfileActionsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { sendingRequestId } =
    useAppSelector(
      (state) => state.friends,
    );

  const isSending =
    sendingRequestId === userId;

  const handleAddFriend = async () => {
    if (!userId) return;

    try {
      const res = await dispatch(
        sendFriendRequest(userId),
      ).unwrap();

      toast.success(
        res?.data?.message ??
          "Friend request sent",
      );
    } catch (error) {
      const err = error as {
        errMessage?: string;
      };

      toast.error(
        err?.errMessage ??
          "Failed to send friend request",
      );
    }
  };

  const handleMessage = () => {
    navigate("/chat", {
      state: {
        userId,
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        mt: 3,
        px: 3,
      }}
    >
      {isOwner ? (
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          sx={{
            borderRadius: 3,
            px: 3,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Edit Profile
        </Button>
      ) : (
        <>
          {friendshipStatus ===
          "accepted" ? (
            <Button
              variant="outlined"
              disabled
              startIcon={<CheckIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Friends
            </Button>
          ) : friendshipStatus ===
            "pending_sent" ? (
            <Button
              variant="outlined"
              disabled
              startIcon={<CheckIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Request Sent
            </Button>
          ) : friendshipStatus ===
            "pending_received" ? (
            <Button
              variant="outlined"
              onClick={() =>
                navigate(
                  "/friends-requests",
                )
              }
              sx={{
                borderRadius: 3,
                px: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Respond
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={
                isSending ? (
                  <CircularProgress
                    size={17}
                    color="inherit"
                  />
                ) : (
                  <PersonAddIcon />
                )
              }
              disabled={isSending}
              onClick={
                handleAddFriend
              }
              sx={{
                borderRadius: 3,
                px: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              {isSending
                ? "Sending..."
                : "Add Friend"}
            </Button>
          )}

          {friendshipStatus ===
            "accepted" && (
            <Button
              variant="outlined"
              startIcon={
                <MessageIcon />
              }
              onClick={
                handleMessage
              }
              sx={{
                borderRadius: 3,
                px: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Message
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default ProfileActions;