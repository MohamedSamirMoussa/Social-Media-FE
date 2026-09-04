import { themes } from "../../theme/theme";
import { useAppSelector } from "../../hooks/hooks";
import { Outlet } from "react-router-dom";

const Dark = () => {
  const { activeTheme } = useAppSelector((state) => state.theme);
  const currentTheme = themes[activeTheme] || themes["light"];
  return (
    <div style={{ backgroundColor: currentTheme.background}}>
      <Outlet />
    </div>
  );
};

export default Dark;
