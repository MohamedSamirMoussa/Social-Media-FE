import { Box, Typography } from "@mui/material";

interface ProfileInfoProps {
  firstName: string;
  lastName: string;
  username: string;
}

const ProfileInfo = ({
  firstName,
  lastName,
  username,
}: ProfileInfoProps) => {
  return (
    <Box
      sx={{
        mt: 10,
        px: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
          lineHeight: 1.2,
        }}
      >
        {firstName} {lastName}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 0.5,
          fontSize: "1rem",
        }}
      >
        @{username}
      </Typography>
    </Box>
  );
};

export default ProfileInfo;

