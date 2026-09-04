import { Avatar, Box, IconButton } from "@mui/material";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import type { IProfileImage, SignupError } from "../../redux/features/auth";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import type React from "react";

import {
  coverImagesThunk,
  profileImageThunk,
} from "../../redux/features/profile";

import toast from "react-hot-toast";

interface ProfileHeaderProps {
  profileImage: string;
  coverImages: IProfileImage[];
  isOwner: boolean;
}

const ProfileHeader = ({
  profileImage,
  coverImages,
  isOwner,
}: ProfileHeaderProps) => {
  const dispatch = useAppDispatch();

  const reduxProfileImage = useAppSelector(
    (state) => state.profile.profileImage.secure_url,
  );

  const reduxCoverImages = useAppSelector((state) => state.profile.coverImages);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      const res = await dispatch(profileImageThunk(file)).unwrap();

      toast.success(res.message);

      e.target.value = "";
    } catch (error) {
      const err = error as SignupError;

      toast.error(err.errMessage);
    }
  };

  const uploadCoverImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    try {
      const res = await dispatch(coverImagesThunk(Array.from(files))).unwrap();

      toast.success(res.message);

      e.target.value = "";
    } catch (error) {
      const err = error as SignupError;

      toast.error(err.errMessage);
    }
  };

  const displayedProfileImage = isOwner
    ? reduxProfileImage || profileImage
    : profileImage;

  const displayedCoverImages =
    isOwner && reduxCoverImages.length > 0 ? reduxCoverImages : coverImages;

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "background.paper",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          height: 280,
          display: "grid",
          gridTemplateColumns:
            displayedCoverImages.length >= 3
              ? "2fr 1fr 1fr"
              : displayedCoverImages.length === 2
                ? "1fr 1fr"
                : "1fr",
          gap: 0.5,
          backgroundColor: "action.hover",
          overflow: "hidden",
          borderRadius: 4,
        }}
      >
        {displayedCoverImages.slice(0, 3).map((image, index) => (
          <Box
            key={image.public_id || index}
            component="img"
            src={image.secure_url}
            alt={`Cover ${index + 1}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ))}
      </Box>

      {isOwner && (
        <IconButton
          component="label"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "background.paper",
            },
          }}
        >
          <PhotoCameraIcon />

          <input
            onChange={uploadCoverImages}
            hidden
            type="file"
            accept="image/*"
            multiple
          />
        </IconButton>
      )}

      <Box
        sx={{
          position: "absolute",
          left: 32,
          bottom: -70,
        }}
      >
        <Avatar
          src={displayedProfileImage}
          alt="Profile"
          sx={{
            width: 150,
            height: 150,
            border: "6px solid",
            borderColor: "background.paper",
          }}
        />

        {isOwner && (
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              right: 5,
              bottom: 5,
              backgroundColor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "background.paper",
              },
            }}
          >
            <PhotoCameraIcon fontSize="small" />

            <input hidden type="file" accept="image/*" onChange={uploadImage} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default ProfileHeader;
