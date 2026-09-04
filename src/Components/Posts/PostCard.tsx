import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import {
  ChatBubbleOutlined,
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  MoreHoriz,
} from "@mui/icons-material";
import {
  createComment,
  deletePost,
  editPost,
  getComments,
  toggleReact,
  type IPost,
} from "../../redux/features/posts";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useFormik, type FormikHelpers } from "formik";
import { toast } from "react-hot-toast";
import type { SignupError, User } from "../../redux/features/auth";
import type { IComment } from "../../types/types";
interface IPostCardProps {
  post: IPost;
  user: User;
}

interface IPostEdit {
  description: string;
}

const PostCard = ({ post, user }: IPostCardProps) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector(
    (state) => state.posts.comments[post._id] ?? [],
  );

  console.log(comments);
  

  const [showComments, setShowComments] = useState(false);
  const [toggleDropMenu, setToggleDropMenu] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [open, setOpen] = useState(false);
  const isAllowed = post?.ownerId?._id === user?._id;
  const initialValues: IPostEdit = {
    description: post.description ?? "",
  };

  const handleReact = async () => {
    try {
      await dispatch(toggleReact(post._id)).unwrap();
    } catch (error) {
      console.error("Like error:", error);
    }
  };
  

  const handleComments = async () => {
    const next = !showComments;
    setShowComments(next);

    if (next) {
      await dispatch(
        getComments({
          refId: post._id,
          onModel: "post",
        }),
      );
    }
  };

  const handleCreateComment = async () => {
    if (!commentContent.trim()) return;

    try {
      const res = await dispatch(
        createComment({
          refId: post._id,
          content: commentContent.trim(),
          onModel: "post",
        }),
      );
      console.log(res);

      setCommentContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropMenu = () => {
    setToggleDropMenu(!toggleDropMenu);
  };

  const handleDeletePost = async () => {
    try {
      const res = await dispatch(deletePost(post._id)).unwrap();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (
    values: IPostEdit,
    { resetForm }: FormikHelpers<IPostEdit>,
  ) => {
    try {
      const res = await dispatch(
        editPost({ postId: post?._id, description: values.description.trim() }),
      ).unwrap();
      console.log(res);
      toast.success(res.message);
      resetForm();
      setOpen(false);
    } catch (error) {
      const err = (error as SignupError).errMessage as string;
      toast.error(err);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            src={post.ownerId?.profileImage?.secure_url}
            sx={{
              width: 44,
              height: 44,
            }}
          />

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {post?.ownerId?.username}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {post?.createdAt}
            </Typography>
          </Box>
        </Box>

        {/* ================= DROPDOWN ================= */}

        <Box
          sx={{
            position: "relative",
          }}
        >
          {isAllowed && (
            <IconButton onClick={handleDropMenu}>
              <MoreHoriz />
            </IconButton>
          )}

          {toggleDropMenu && (
            <Box
              sx={{
                position: "absolute",
                top: 45,
                right: 0,
                zIndex: 10,
                minWidth: 150,
                p: 0.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: 4,
              }}
            >
              {/* Edit */}

              <Button
                fullWidth
                startIcon={<Edit />}
                onClick={() => {
                  formik.setFieldValue("description", post?.description ?? "");

                  setOpen(true);
                  setToggleDropMenu(false);
                }}
                sx={{
                  justifyContent: "flex-start",
                  color: "warning.main",
                  textTransform: "none",
                }}
              >
                Edit post
              </Button>

              {/* Delete */}

              <Button
                fullWidth
                startIcon={<Delete />}
                onClick={handleDeletePost}
                sx={{
                  justifyContent: "flex-start",
                  color: "error.main",
                  textTransform: "none",
                }}
              >
                Delete post
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* ================= DESCRIPTION ================= */}

      {post.description && (
        <Box
          sx={{
            px: 2,
            pb: 2,
          }}
        >
          <Typography
            sx={{
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {post.description}
          </Typography>
        </Box>
      )}

      {/* ================= ATTACHMENTS ================= */}

      {post.attachments?.length > 0 && (
        <Box>
          {post.attachments.length === 1 ? (
            <Box
              component="img"
              src={post.attachments[0]?.secure_url}
              alt="post"
              sx={{
                width: "100%",
                maxHeight: 550,
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0.5,
              }}
            >
              {post?.attachments.slice(0, 4).map((attachment, index) => (
                <Box
                  key={attachment?.public_id || index}
                  component="img"
                  src={attachment?.secure_url}
                  alt="post"
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* ================= STATS ================= */}

      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {post.likeCounts ?? 0} likes
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {post.commentsCount ?? 0} comments
        </Typography>
      </Box>

      <Divider />

      {/* ================= ACTIONS ================= */}

      <Box
        sx={{
          px: 1,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <IconButton onClick={handleReact}>
          {post.isLiked ? (
            <>
              <Favorite
                sx={{
                  color: "error.main",
                  transform: "scale(1.08)",
                  transition: "0.15s",
                }}
              />
            </>
          ) : (
            <>
              <FavoriteBorder
                sx={{
                  transition: "0.15s",
                }}
              />
            </>
          )}
        </IconButton>

        <IconButton onClick={handleComments} disabled={!post.allowComments}>
          <ChatBubbleOutlined />
        </IconButton>
      </Box>

      {showComments && post.allowComments && (
        <Box
          sx={{
            px: 2,
            pb: 2,
          }}
        >
          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={commentContent}
              placeholder="Write a comment..."
              onChange={(e) => setCommentContent(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={handleCreateComment}
              disabled={!commentContent.trim()}
            >
              Post
            </Button>
          </Box>

          {comments.map((comment: Partial<IComment>) => (
            <Box
              key={comment._id}
              sx={{
                display: "flex",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Avatar
                src={comment?.ownerId?.profileImage?.secure_url || ""}
                sx={{
                  width: 34,
                  height: 34,
                }}
              />

              <Box
                sx={{
                  flex: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {comment?.ownerId?.username}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                  }}
                >
                  {comment.content}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ================= EDIT DIALOG ================= */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Post</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              mt: 1,
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={4}
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Edit your post..."
            />

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button
                type="button"
                onClick={() => {
                  setOpen(false);

                  formik.setFieldValue("description", post.description ?? "");
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={!formik.values.description.trim()}
              >
                Save changes
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PostCard;
