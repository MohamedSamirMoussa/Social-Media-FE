import {
  Avatar,
  Box,
  ButtonBase,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CircleIcon from "@mui/icons-material/Circle";

import { useAcceptedFriends } from "../../hooks/useQuery";
import type { FriendsProps, IFriend } from "../../types/types";

const Friends = ({
  selectedFriend,
  onSelectFriend,
  onlineUsers,
}: FriendsProps) => {
  const { data } = useAcceptedFriends();
  const friends: IFriend[] = data?.data?.friends ?? [];

  return (
    <Box
      sx={{
        display: {
          xs: selectedFriend ? "none" : "flex",
          sm: "flex",
        },
        width: { xs: "100%", sm: 240, md: 300, lg: 340 },
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        flexShrink: 0,
        flexDirection: "column",
        boxSizing: "border-box",
        borderRight: { xs: 0, sm: "1px solid" },
        borderColor: "divider",
        backgroundColor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 2, md: 3 },
          flexShrink: 0,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.3rem", md: "1.5rem" },
            fontWeight: 900,
            mb: 2,
          }}
        >
          Messages
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Search friends..."
          slotProps={{
            htmlInput: { "aria-label": "Search friends" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
            "& .MuiInputBase-input": { fontSize: 16 },
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          p: 1,
        }}
      >
        {friends.map((friend) => {
          const isSelected = selectedFriend?._id === friend._id;
          const isOnline = onlineUsers.includes(friend._id);

          return (
            <ButtonBase
              key={friend._id}
              type="button"
              onClick={() => onSelectFriend(friend)}
              aria-label={`Chat with ${friend.username}`}
              aria-pressed={isSelected}
              sx={{
                width: "100%",
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: { xs: 1.5, sm: 1, md: 1.5 },
                p: { xs: 1.5, sm: 1, md: 1.5 },
                mb: 0.5,
                borderRadius: 3,
                textAlign: "left",
                backgroundColor: isSelected ? "action.selected" : "transparent",
                transition: "background-color 0.2s ease",
                "&:hover": { backgroundColor: "action.hover" },
                "&.Mui-focusVisible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: -2,
                },
              }}
            >
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  src={friend.profileImage?.secure_url}
                  alt={friend.username}
                  sx={{
                    width: { xs: 48, sm: 44, md: 50 },
                    height: { xs: 48, sm: 44, md: 50 },
                  }}
                />
                <CircleIcon
                  sx={{
                    position: "absolute",
                    bottom: -1,
                    right: -1,
                    fontSize: 14,
                    color: isOnline ? "#22c55e" : "grey.500",
                    backgroundColor: "background.paper",
                    borderRadius: "50%",
                    transition: "color 0.2s ease",
                  }}
                />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography noWrap sx={{ fontWeight: 700 }}>
                  {friend.username}
                </Typography>
                <Typography
                  noWrap
                  variant="body2"
                  color={isOnline ? "success.main" : "text.secondary"}
                >
                  {isOnline ? "Online" : "Offline"}
                </Typography>
              </Box>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

export default Friends;
