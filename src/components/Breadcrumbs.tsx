"use client";
import * as React from "react";
import Link from "next/link";
import {
  Breadcrumbs as MUIBreadcrumbs,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const toTitleCase = (str: string) =>
  str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export interface BreadcrumbsProps {
  pathname: string;
  labels?: Record<string, string>;
  nonLinkable?: string[];
}

// TODO: This could really stand to be refactored. There's a lot of duplication,
// and it's kinda hard to read/edit.
export default function Breadcrumbs({
  pathname,
  labels = {},
  nonLinkable = [],
}: BreadcrumbsProps) {
  const pathParts = pathname.split("/").filter(Boolean);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (pathParts.length <= 4) {
    return (
      <MUIBreadcrumbs aria-label="breadcrumb" sx={{ my: 1, ml: 1 }}>
        <Link href="/">Home</Link>
        {pathParts.map((part, idx) => {
          const href = "/" + pathParts.slice(0, idx + 1).join("/");
          const isLast = idx === pathParts.length - 1;
          const label = labels[part] || toTitleCase(part);
          const isNonLinkable = nonLinkable.includes(part);
          if (isLast || isNonLinkable) {
            return (
              <Typography color="text.primary" key={href}>
                {label}
              </Typography>
            );
          }
          return (
            <Link href={href} key={href}>
              {label}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    );
  }

  // More than 4 parts: Home, first, menu, last
  const firstHref = "/" + pathParts[0];
  const firstLabel = labels[pathParts[0]] || toTitleCase(pathParts[0]);
  const lastIdx = pathParts.length - 1;
  const lastHref = "/" + pathParts.slice(0, lastIdx + 1).join("/");
  const lastLabel =
    labels[pathParts[lastIdx]] || toTitleCase(pathParts[lastIdx]);
  const isLastNonLinkable = nonLinkable.includes(pathParts[lastIdx]);
  const middleParts = pathParts.slice(1, lastIdx);

  return (
    <React.Fragment>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        aria-label="breadcrumb-menu">
        {middleParts.map((part, i) => {
          const idx = i + 1;
          const href = "/" + pathParts.slice(0, idx + 1).join("/");
          const label = labels[part] || toTitleCase(part);
          const isNonLinkable = nonLinkable.includes(part);
          if (isNonLinkable) {
            return (
              <MenuItem key={href} disabled>
                {label}
              </MenuItem>
            );
          }
          return (
            <MenuItem
              key={href}
              component="a"
              href={href}
              onClick={handleMenuClose}>
              {label}
            </MenuItem>
          );
        })}
      </Menu>
      <MUIBreadcrumbs aria-label="breadcrumb" sx={{ my: 1, ml: 1 }}>
        <Link href="/">Home</Link>
        <Link href={firstHref}>{firstLabel}</Link>
        <IconButton
          color="primary"
          size="small"
          aria-label="Show more breadcrumbs"
          onClick={handleMenuClick}>
          <MoreHorizIcon />
        </IconButton>
        {isLastNonLinkable ? (
          <Typography color="text.primary" key={lastHref}>
            {lastLabel}
          </Typography>
        ) : (
          <Link href={lastHref} key={lastHref}>
            {lastLabel}
          </Link>
        )}
      </MUIBreadcrumbs>
    </React.Fragment>
  );
}
