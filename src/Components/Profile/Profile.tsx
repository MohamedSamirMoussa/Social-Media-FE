import { Box, CircularProgress, Container } from "@mui/material";

import { useEffect } from "react";
import { useParams } from "react-router-dom";

import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import ProfileActions from "./ProfileActions";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import { getAllUsers } from "../../redux/features/friends";
import type { User } from "../../redux/features/auth";

const Profile = () => {
  const dispatch = useAppDispatch();

  const { userId } = useParams<{ userId: string }>();

  const { user: currentUser } = useAppSelector((state) => state.auth);

  const { friends, loading } = useAppSelector((state) => state.friends);

  const selectedUser = userId
    ? friends.find((user) => user._id === userId)
    : null;

  const profileUser = userId ? selectedUser : currentUser;

  console.log(profileUser);
  

  const isOwner = !userId || userId === currentUser?._id;

  useEffect(() => {
    if (userId && friends.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch, userId, friends.length]);

  console.log({
    userId,
    currentUserId: currentUser?._id,
    profileUserId: profileUser?._id,
    isOwner,
  });

  if (!currentUser) {
    return null;
  }

  if (userId && !profileUser && loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!profileUser) {
    return <Box sx={{ p: 4 }}>User not found</Box>;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: 4,
        my: 8,
      }}
    >
      <Container>
        <ProfileHeader
          profileImage={profileUser.profileImage?.secure_url ?? ""}
          coverImages={(profileUser as User).coverImages ?? []}
          isOwner={isOwner}
        />

        <ProfileInfo
          firstName={profileUser.firstName}
          lastName={profileUser.lastName}
          username={profileUser.username}
        />

        <ProfileActions
          isOwner={isOwner}
          userId={profileUser._id}
          friendshipStatus={
            !isOwner ? (selectedUser?.friendshipStatus ?? "none") : undefined
          }
        />
      </Container>
    </Box>
  );
};

export default Profile;
