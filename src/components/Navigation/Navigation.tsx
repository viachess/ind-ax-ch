import { NavLink } from "react-router-dom";

import { routes } from "../../config/routesConfig";

const navStyles = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const Navigation = () => {
  return (
    <nav style={navStyles}>
      {routes.map(({ path, linkText }, index) => (
        <NavLink
          style={({ isActive }) => {
            return {
              display: "block",
              margin: "1rem 0",
              color: isActive ? "red" : "",
            };
          }}
          to={path}
          key={index}
        >
          {linkText}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
