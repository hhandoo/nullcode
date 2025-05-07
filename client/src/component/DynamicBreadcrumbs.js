import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumbs, Typography, Chip } from "@mui/material";

const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);
  if (location.pathname === "/") return null;

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }} separator="›" >
      <Chip
        label="Home"
        clickable
        onClick={() => navigate("/")}
        sx={{ cursor: "pointer" }}
      />
      {pathnames.map((value, index) => {
        if (index === 0 && value === "p1") return null;

        const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label = decodeURIComponent(value);

        return isLast ? (
          <Typography color="text.primary" key={pathTo}>
            {label}
          </Typography>
        ) : (
          <Chip
            key={pathTo}
            label={label}
            clickable
            onClick={() => navigate(pathTo)}
            sx={{ cursor: "pointer" }}
          />
        );
      })}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;
