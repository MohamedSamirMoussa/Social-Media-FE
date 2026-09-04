import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  Attachment,
  Close,
  Home,
  InsertDriveFile,
  MoreVert,
  Send,
} from "@mui/icons-material";

import type React from "react";
import type {
  ChatWindowProps,
  IAttachments,
  IMessage,
} from "../../types/types";
import { useState } from "react";
import { useAppSelector } from "../../hooks/hooks";
import { themes } from "../../theme/theme";
import { Link } from "react-router-dom";

const ChatWindow = ({
  user,
  formik,
  currentUser,
  messages,
  attachments,
  setAttachments,
  uploadingAttachments,
  setSelectedFriend,
  isOnline,
}: ChatWindowProps) => {
  /*
  |--------------------------------------------------------------------------
  | Safe Messages
  |--------------------------------------------------------------------------
  */

  const safeMessages = Array.isArray(messages) ? messages : [];
  const [toggleDropMenu, setToggleDropMenu] = useState(false);
  const { activeTheme } = useAppSelector((state) => state.theme);

  const currentTheme = themes[activeTheme] || themes["light"];

  /*
  |--------------------------------------------------------------------------
  | Select Attachments
  |--------------------------------------------------------------------------
  */

  const handleAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const selectedFiles = Array.from(files);

    /*
     * Add newly selected files
     * without removing previously selected files.
     */
    setAttachments((prev) => [...prev, ...selectedFiles]);

    /*
     * Reset input value so the same file
     * can be selected again later.
     */
    e.target.value = "";
  };
  const handleDropMenu = () => {
    setToggleDropMenu(!toggleDropMenu);
  };
  /*
  |--------------------------------------------------------------------------
  | Remove Attachment
  |--------------------------------------------------------------------------
  */

  const removeAttachment = (index: number) => {
    setAttachments((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  /*
  |--------------------------------------------------------------------------
  | File Helpers
  |--------------------------------------------------------------------------
  */

  const isImage = (file: File) => file.type.startsWith("image/");

  const isVideo = (file: File) => file.type.startsWith("video/");

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        backgroundColor: "background.default",
      }}
    >
      {/* ================= CHAT HEADER ================= */}

      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 64, sm: 80 },
          flexShrink: 0,
          px: { xs: 1, sm: 2, md: 3 },
          py: 1,
          gap: 1,
          boxSizing: "border-box",

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          borderBottom: "1px solid",
          borderColor: "divider",

          backgroundColor: "background.paper",
        }}
      >
        {/* User Information */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
            flex: 1,
            minWidth: 0,
          }}
        >
          <IconButton
            type="button"
            aria-label="Back to friends"
            onClick={() => setSelectedFriend(null)}
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              flexShrink: 0,
              width: 44,
              height: 44,
            }}
          >
            <ArrowBack />
          </IconButton>

          {/* Avatar */}

          <Box
            sx={{
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Avatar
              src={user?.profileImage?.secure_url}
              alt={user?.username}
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
              }}
            />

            {/* Online indicator */}

            <Box
              sx={{
                position: "absolute",

                bottom: 1,
                right: 1,

                width: 12,
                height: 12,

                borderRadius: "50%",

                backgroundColor: isOnline ? "success.main" : "grey.500",

                border: "2px solid",

                borderColor: "background.paper",
              }}
            />
          </Box>

          {/* Username */}

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
              }}
            >
              {user?.username}
            </Typography>

            <Typography noWrap variant="body2" color="text.secondary">
              {isOnline ? "Active now" : "Offline"}
            </Typography>
          </Box>
        </Box>

        <IconButton
          type="button"
          aria-label="Chat options"
          aria-expanded={toggleDropMenu}
          onClick={handleDropMenu}
          sx={{ flexShrink: 0, width: 44, height: 44 }}
        >
          <MoreVert />
        </IconButton>

        {toggleDropMenu && (
          <Box
            sx={{
              position: "absolute",
              top: "calc(100% - 4px)",
              right: { xs: 8, sm: 16 },
              zIndex: 10,
              minWidth: 150,
              maxWidth: "calc(100% - 16px)",
              p: 0.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.paper",
              boxShadow: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {/* Close Chat */}

              <Button
                fullWidth
                onClick={() => setSelectedFriend(null)}
                sx={{
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: currentTheme.color,
                  gap: 1,
                }}
              >
                <Close /> Chat
              </Button>

              {/* Close */}

              <Link
                to={"/"}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "none",
                  color: currentTheme.color,
                  gap: 1,
                }}
              >
                <Home /> Home
              </Link>
            </Box>
          </Box>
        )}
      </Box>

      {/* ================= MESSAGES ================= */}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehavior: "contain",

          p: { xs: 1.5, sm: 2, md: 3 },

          display: "flex",

          flexDirection: "column",

          gap: 2,
        }}
      >
        {safeMessages.map((message: Partial<IMessage>, index) => {
          /*
           * Check if this message belongs
           * to the current logged-in user.
           */
          const isMine = message.senderId === currentUser?._id;

          return (
            <Box
              key={message._id ?? index}
              sx={{
                alignSelf: isMine ? "flex-end" : "flex-start",

                minWidth: 0,
                flexShrink: 0,
                maxWidth: { xs: "90%", sm: "85%", md: "75%", lg: "70%" },
              }}
            >
              <Box
                sx={{
                  p: { xs: "8px 12px", sm: "10px 15px" },
                  minWidth: 0,
                  overflowWrap: "anywhere",

                  borderRadius: isMine
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",

                  backgroundColor: isMine
                    ? "rgba(0, 153, 204, 0.85)"
                    : "action.hover",

                  color: isMine ? "#fff" : "text.primary",
                }}
              >
                {/* Message text */}

                {message.text && (
                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      fontSize: { xs: "0.9375rem", sm: "1rem" },
                    }}
                  >
                    {message.text}
                  </Typography>
                )}

                {/* Uploaded attachments */}

                {message.attachments && message.attachments.length > 0 && (
                  <Box
                    sx={{
                      mt: message.text ? 1 : 0,

                      display: "flex",

                      flexDirection: "column",

                      gap: 1,
                    }}
                  >
                    {message.attachments.map(
                      (attachment: IAttachments, attachmentIndex) => (
                        <Box key={attachment.public_id ?? attachmentIndex}>
                          {/* Image attachment */}

                          <Box
                            component="img"
                            src={attachment.secure_url}
                            alt="attachment"
                            sx={{
                              maxWidth: "100%",
                              maxHeight: 250,
                              width: 250,
                              height: "auto",

                              borderRadius: 2,

                              objectFit: "cover",

                              display: "block",
                            }}
                          />
                        </Box>
                      ),
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ================= SELECTED ATTACHMENTS ================= */}

      {attachments.length > 0 && (
        <Box
          sx={{
            px: { xs: 1, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            flexShrink: 0,
            minWidth: 0,

            borderTop: "1px solid",

            borderColor: "divider",

            backgroundColor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",

              gap: 1,

              overflowX: "auto",
              minWidth: 0,
              maxWidth: "100%",

              pb: 0.5,
            }}
          >
            {attachments.map((file, index) => {
              const image = isImage(file);

              const video = isVideo(file);

              return (
                <Box
                  key={`${file.name}-${index}`}
                  sx={{
                    position: "relative",

                    flexShrink: 0,
                    minWidth: 0,
                    width: { xs: 110, sm: 130 },

                    border: "1px solid",

                    borderColor: "divider",

                    borderRadius: 2,

                    overflow: "hidden",

                    backgroundColor: "action.hover",
                  }}
                >
                  {/* Image Preview */}

                  {image ? (
                    <Box
                      component="img"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      sx={{
                        width: "100%",

                        height: { xs: 72, sm: 100 },

                        objectFit: "cover",

                        display: "block",
                      }}
                    />
                  ) : (
                    /*
                     * Non-image file preview
                     */
                    <Box
                      sx={{
                        height: { xs: 72, sm: 100 },

                        display: "flex",

                        flexDirection: "column",

                        alignItems: "center",

                        justifyContent: "center",

                        gap: 0.5,
                      }}
                    >
                      {video ? (
                        <Typography variant="caption">Video</Typography>
                      ) : (
                        <InsertDriveFile />
                      )}

                      <Typography
                        variant="caption"
                        noWrap
                        sx={{
                          maxWidth: "100%",
                          px: 1,
                          boxSizing: "border-box",
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  )}

                  {/* Remove Attachment */}

                  <IconButton
                    size="small"
                    disabled={uploadingAttachments}
                    onClick={() => removeAttachment(index)}
                    sx={{
                      position: "absolute",

                      top: 4,

                      right: 4,

                      width: 26,

                      height: 26,

                      backgroundColor: "background.paper",

                      boxShadow: 2,

                      "&:hover": {
                        backgroundColor: "background.paper",
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>

                  {/* File Information */}

                  <Box
                    sx={{
                      px: 1,
                      py: 0.7,
                    }}
                  >
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{
                        display: "block",
                      }}
                    >
                      {file.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* ================= MESSAGE INPUT ================= */}

      <Box
        sx={{
          p: { xs: 1, sm: 2 },
          pb: {
            xs: "max(8px, env(safe-area-inset-bottom))",
            sm: "max(16px, env(safe-area-inset-bottom))",
          },
          minWidth: 0,
          flexShrink: 0,

          borderTop: "1px solid",

          borderColor: "divider",

          backgroundColor: "background.paper",
        }}
      >
        <form
          onSubmit={formik.handleSubmit}
          style={{
            display: "flex",

            alignItems: "center",

            gap: 6,
            minWidth: 0,
            width: "100%",
          }}
        >
          {/* Message Input */}

          <TextField
            fullWidth
            id="text"
            name="text"
            placeholder={`Message ${user?.username}...`}
            value={formik.values.text}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.errors.text && formik.touched.text)}
            disabled={uploadingAttachments}
            size="small"
            slotProps={{
              htmlInput: {
                "aria-label": `Message ${user?.username ?? "friend"}`,
              },
            }}
            sx={{
              flex: 1,
              minWidth: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
              "& .MuiInputBase-input": { fontSize: 16 },
            }}
          />

          {/* Attachment Selector */}

          <IconButton
            component="label"
            aria-label="Attach files"
            disabled={uploadingAttachments}
            sx={{ flexShrink: 0, width: 44, height: 44 }}
          >
            <Attachment />

            <input
              hidden
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={handleAttachments}
            />
          </IconButton>

          {/* Send Button */}

          <Button
            type="submit"
            aria-label="Send message"
            variant="contained"
            disabled={
              /*
               * Disable while uploading files
               */
              uploadingAttachments ||
              /*
               * Disable if both text
               * and attachments are empty
               */
              (!formik.values.text.trim() && attachments.length === 0)
            }
            sx={{
              minWidth: { xs: 44, sm: 48 },
              width: { xs: 44, sm: 48 },
              height: { xs: 44, sm: 48 },
              p: 0,
              flexShrink: 0,

              borderRadius: "50%",
            }}
          >
            <Send fontSize="small" />
          </Button>
        </form>

        {/* Upload status */}

        {uploadingAttachments && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 1,
            }}
          >
            Uploading attachments...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatWindow;
