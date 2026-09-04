import { Box } from "@mui/material";

import Posts from "../Posts/Posts";

const Home = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Posts />
    </Box>
  );
};

export default Home;
