import { Box, CircularProgress, Stack, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

import { useEffect } from "react";

import { getAllPost } from "../../redux/features/posts";
import type { User } from "../../redux/features/auth";

const Posts = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);


  const { posts, loading } = useAppSelector((state) => state.posts);

  /*
  |--------------------------------------------------------------------------
  | Get Posts
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(getAllPost());
  }, [dispatch]);

  return (
    <Box
      sx={{
        /*
         * Full available screen
         *
         * لو عندك Navbar 70px مثلاً:
         * height: "calc(100vh - 70px)"
         */
        height: "100vh",

        width: "100%",

        display: "flex",
        justifyContent: "center",

        backgroundColor: "background.default",

        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 650,

          height: "100%",

          display: "flex",
          flexDirection: "column",

          px: 2,
          pt: 2,
        }}
      >
        {/* =========================================================
            CREATE POST
            =========================================================

            This section does NOT scroll.
            It always stays visible.
        */}

        <Box
          sx={{
            flexShrink: 0,
            pb: 2,
          }}
        >
          <CreatePost currentUser={user} />
        </Box>

        {/* =========================================================
            POSTS SCROLL AREA
            ========================================================= */}

        <Box
          sx={{
            flex: 1,

            /*
             * Very important with flexbox
             * to allow this section to scroll.
             */
            minHeight: 0,

            overflowY: "auto",

            /*
             * Keep scrollbar away
             * from post content slightly.
             */
            pr: 0.5,

            pb: 3,
          }}
        >
          <Stack spacing={2}>
            {/* Initial Loading */}

            {loading && posts.length === 0 && (
              <Box
                sx={{
                  py: 4,

                  display: "flex",

                  justifyContent: "center",
                }}
              >
                <CircularProgress size={30} />
              </Box>
            )}

            {/* Posts */}

            {posts.map((post) => (
              <PostCard key={post._id} post={post} user={user as User} />
            ))}

            {/* Empty State */}

            {!loading && posts.length === 0 && (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  py: 4,
                }}
              >
                No posts yet
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Posts;
