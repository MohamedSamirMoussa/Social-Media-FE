// CreatePost.tsx

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { Close, ImageOutlined } from "@mui/icons-material";

import { useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { createPost } from "../../redux/features/posts";
import toast from "react-hot-toast";

interface CreatePostProps {
  currentUser?: {
    username?: string;
    firstName?: string;
    lastName?: string;

    profileImage?: {
      secure_url?: string;
    };
  } | null;
}

const CreatePost = ({ currentUser }: CreatePostProps) => {
  const [open, setOpen] = useState(false);

  const [description, setDescription] = useState("");

  const [attachments, setAttachments] = useState<File[]>([]);

  const [allowComments, setAllowComments] = useState(true);
  const dispatch = useAppDispatch();
  /*
  |--------------------------------------------------------------------------
  | Select attachments
  |--------------------------------------------------------------------------
  */

  const handleAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files?.length) return;

    setAttachments((prev) => [...prev, ...Array.from(files)]);

    e.target.value = "";
  };

  /*
  |--------------------------------------------------------------------------
  | Remove attachment
  |--------------------------------------------------------------------------
  */

  const removeAttachment = (index: number) => {
    setAttachments((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Close dialog
  |--------------------------------------------------------------------------
  */

  const handleClose = () => {
    setOpen(false);

    setDescription("");

    setAttachments([]);

    setAllowComments(true);
  };

  const handleCreatePost = async () => {
    if (!description.trim() && !attachments.length) {
      return;
    }

    const formData = new FormData();

    if (description.trim()) {
      formData.append("description", description.trim());
    }
    formData.append("allowComments", String(allowComments));

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    const post = await dispatch(createPost(formData)).unwrap();

    console.log("Created post:", post);

    toast.success("Post created successfully");

    handleClose();
  };

  return (
    <>
      {/* ================= CREATE POST CARD ================= */}

      <Box
        sx={{
          width: "100%",

          p: 2,

          borderRadius: 3,

          backgroundColor: "background.paper",

          border: "1px solid",

          borderColor: "divider",

          my: 8,
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
            src={currentUser?.profileImage?.secure_url}
            sx={{
              width: 44,
              height: 44,
            }}
          />

          <Box
            onClick={() => setOpen(true)}
            sx={{
              flex: 1,

              px: 2,
              py: 1.3,

              borderRadius: 5,

              backgroundColor: "action.hover",

              cursor: "pointer",

              "&:hover": {
                backgroundColor: "action.selected",
              },
            }}
          >
            <Typography color="text.secondary">
              What's on your mind,{" "}
              {currentUser?.firstName ?? currentUser?.username ?? "user"}?
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",

            justifyContent: "center",
          }}
        >
          <Button startIcon={<ImageOutlined />} onClick={() => setOpen(true)}>
            Photo / Video
          </Button>
        </Box>
      </Box>

      {/* ================= CREATE POST DIALOG ================= */}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {/* Header */}

        <DialogTitle
          sx={{
            position: "relative",

            textAlign: "center",

            fontWeight: 800,
          }}
        >
          Create Post
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",

              right: 12,
              top: 10,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {/* User */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1.5,

              mb: 2,
            }}
          >
            <Avatar src={currentUser?.profileImage?.secure_url} />

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {currentUser?.username ??
                  `${currentUser?.firstName ?? ""} ${
                    currentUser?.lastName ?? ""
                  }`}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Public
              </Typography>
            </Box>
          </Box>

          {/* Description */}

          <TextField
            multiline
            fullWidth
            minRows={4}
            placeholder="What's on your mind?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
              },
            }}
            sx={{
              mb: 2,

              "& textarea": {
                fontSize: "1.1rem",
              },
            }}
          />

          {/* ================= SELECTED ATTACHMENTS ================= */}

          {attachments.length > 0 && (
            <Box
              sx={{
                display: "grid",

                gridTemplateColumns:
                  attachments.length === 1 ? "1fr" : "1fr 1fr",

                gap: 0.5,

                mb: 2,

                maxHeight: 400,

                overflowY: "auto",
              }}
            >
              {attachments.map((file, index) => {
                const isImage = file.type.startsWith("image/");

                const isVideo = file.type.startsWith("video/");

                return (
                  <Box
                    key={`${file.name}-${index}`}
                    sx={{
                      position: "relative",

                      borderRadius: 2,

                      overflow: "hidden",

                      backgroundColor: "action.hover",

                      minHeight: 180,
                    }}
                  >
                    {/* Image */}

                    {isImage && (
                      <Box
                        component="img"
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        sx={{
                          width: "100%",

                          height: "100%",

                          minHeight: 180,

                          maxHeight: 300,

                          objectFit: "cover",

                          display: "block",
                        }}
                      />
                    )}

                    {/* Video */}

                    {isVideo && (
                      <Box
                        component="video"
                        src={URL.createObjectURL(file)}
                        controls
                        sx={{
                          width: "100%",

                          height: "100%",

                          minHeight: 180,

                          maxHeight: 300,

                          objectFit: "cover",

                          display: "block",
                        }}
                      />
                    )}

                    {/* Other file */}

                    {!isImage && !isVideo && (
                      <Box
                        sx={{
                          height: 180,

                          display: "flex",

                          alignItems: "center",

                          justifyContent: "center",

                          p: 2,
                        }}
                      >
                        <Typography>{file.name}</Typography>
                      </Box>
                    )}

                    {/* Remove */}

                    <IconButton
                      onClick={() => removeAttachment(index)}
                      sx={{
                        position: "absolute",

                        top: 8,

                        right: 8,

                        backgroundColor: "background.paper",

                        boxShadow: 2,

                        "&:hover": {
                          backgroundColor: "background.paper",
                        },
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* ================= ADD ATTACHMENTS ================= */}

          <Box
            sx={{
              p: 1.5,

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              border: "1px solid",

              borderColor: "divider",

              borderRadius: 2,

              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              Add to your post
            </Typography>

            <IconButton component="label">
              <ImageOutlined />

              <input
                hidden
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleAttachments}
              />
            </IconButton>
          </Box>

          {/* ================= OPTIONS ================= */}

          <FormControlLabel
            control={
              <Switch
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
              />
            }
            label="Allow comments"
          />

          {/* ================= CREATE BUTTON ================= */}

          <Button
            fullWidth
            variant="contained"
            onClick={handleCreatePost}
            disabled={!description.trim() && attachments.length === 0}
            sx={{
              mt: 2,

              py: 1.2,

              borderRadius: 2,

              fontWeight: 700,
            }}
          >
            Post
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePost;
