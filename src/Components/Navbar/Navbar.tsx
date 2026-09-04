import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  CloseOutlined,
  DarkMode,
  Home,
  LightMode,
  MenuOutlined,
} from "@mui/icons-material";

import { Box, Button, Typography } from "@mui/material";

import { logoutThunk } from "../../redux/features/auth";

import toast from "react-hot-toast";

import "./Navbar.css";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { themes, type IThemes } from "../../theme/theme";
import { setActiveTheme } from "../../redux/features/theme";
import { useState } from "react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth,
  );
  const { activeTheme } = useAppSelector((state) => state.theme);
  const currentTheme = themes[activeTheme] || themes["light"];
  const [menu, setMenu] = useState(true);
  const themeKeys = Object.keys(themes);
  const handleTheme = (tabTheme: string) => {
    const res = dispatch(setActiveTheme(tabTheme as keyof IThemes));
    console.log(res);
  };

  const handleMenu = () => {
    setMenu(!menu);
  };

  /* =========================
     Logout
  ========================= */

  const handleLogout = async () => {
    const res = await dispatch(logoutThunk()).unwrap();
    console.log(res);
    try {
      toast.success(res.message);

      navigate("/login");
    } catch (error) {
      const err = error as {
        errMessage?: string;
      };

      toast.error(err.errMessage || "Logout failed");
    }
  };

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: currentTheme.background,
        }}
      >
        <Toolbar>
          <Typography>Loading...</Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        borderRadius: 0,
        backgroundColor: currentTheme.background,
        width: "100%",
        top: 0,
        left: 0,
        right: 0,
      }}
      component="nav"
      className="nav-bar"
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* =====================
            HOME
        ===================== */}

        <Link
          to="/"
          className="link"
          style={{
            color: currentTheme.color,
          }}
        >
          <Home />
        </Link>

        {/* =====================
            AUTH AREA
        ===================== */}

        <Box
          id="overly"
          sx={{
            fontSize: "1.2rem",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            gap: 3,
          }}
        >
          <Button
            onClick={handleMenu}
            sx={{
              color: currentTheme.color,
            }}
          >
            <MenuOutlined />
          </Button>
          <Box
            id="box"
            sx={{
              position: "absolute",
              top: 0,
              right: 2,
              height: "100vh",
              opacity: `${!menu ? 100 : 100}`,
              transition: "0.3s ease-in-out",
              translate: `${!menu ? 0 : "240px 0px"}`,
              backgroundColor: currentTheme.background,
              paddingY: 5,
              boxShadow: "0 2px 2px #00000049",
              alignItems: "center",
              paddingX: 5,
            }}
          >
            <Box
              sx={{
                paddingY: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {isAuthenticated && user ? (
                <>
                  {/* USERNAME */}

                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 900,
                      color: currentTheme.color,
                    }}
                  >
                    {user.username}
                  </Typography>

                  <Link
                    to="/chat"
                    style={{
                      color: currentTheme.color,
                    }}
                    className="link"
                  >
                    Chat
                  </Link>
                  <Link
                    to="/profile"
                    style={{
                      color: currentTheme.color,
                    }}
                    className="link"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/friends"
                    style={{
                      color: currentTheme.color,
                    }}
                    className="link"
                  >
                    Friends
                  </Link>
                  <Link
                    to="/friends-requests"
                    style={{
                      color: currentTheme.color,
                    }}
                    className="link"
                  >
                    Friends Requests
                  </Link>

                  {/* LOGOUT */}

                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    sx={{
                      color: currentTheme.color,
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  {/* SIGN UP */}

                  <NavLink
                    to="/register"
                    className="link"
                    style={{
                      color: currentTheme.color,
                    }}
                  >
                    Sign up
                  </NavLink>

                  {/* SIGN IN */}

                  <NavLink
                    to="/login"
                    className="link"
                    style={{
                      color: currentTheme.color,
                    }}
                  >
                    Sign in
                  </NavLink>
                </>
              )}
              {themeKeys.map((themeKey) => {
                const tabTheme = themes[themeKey as keyof IThemes];
                const displayName = tabTheme.name;
                console.log(tabTheme);

                return (
                  <>
                    <Button
                      variant="contained"
                      key={themeKey}
                      onClick={() => handleTheme(themeKey)}
                      sx={{
                        color: currentTheme.color,
                        borderRadius: 0,
                      }}
                    >
                      {displayName == "Dark Theme" ? (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                          }}
                        >
                          <DarkMode />
                          <Typography component={"span"}>Dark</Typography>
                        </Box>
                      ) : (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            <LightMode />
                            <Typography component={"span"}>Light</Typography>
                          </Box>
                        </>
                      )}
                    </Button>
                  </>
                );
              })}
            </Box>
            <Button
              onClick={handleMenu}
              sx={{
                color: currentTheme.color,
                position: "absolute",
                left: 0,
                top: 20,
              }}
            >
              <CloseOutlined />
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
