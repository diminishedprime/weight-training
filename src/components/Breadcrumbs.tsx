"use client";
import { EquipmentType } from "@/common-types";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import { Constants } from "@/database.types";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  IconButton,
  Menu,
  MenuItem,
  Breadcrumbs as MUIBreadcrumbs,
  Link as MUILink,
  Typography,
} from "@mui/material";
import Link from "next/link";
import * as React from "react";

const toTitleCase = (str: string) =>
  str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export interface BreadcrumbsProps {
  pathname: string;
  labels?: Record<string, string | React.JSX.Element>;
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
    null,
  );
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // TODO: (easy) we should always show the second to last, and last because
  // otherwise it's annoying to go up exactly one level.
  if (pathParts.length <= 4) {
    return (
      <MUIBreadcrumbs aria-label="breadcrumb" sx={{ my: 1, ml: 1 }}>
        <MUILink component={Link} href="/">
          Home
        </MUILink>
        {pathParts.map((part, idx) => {
          const href = "/" + pathParts.slice(0, idx + 1).join("/");
          const label = labels[part] || toTitleCase(part);
          const isNonLinkable = nonLinkable.includes(part);
          const isEquipmentType =
            Constants.public.Enums.equipment_type_enum.includes(
              part as EquipmentType,
            );
          const icon = isEquipmentType ? (
            <DisplayEquipmentThumbnail
              equipmentType={part as EquipmentType}
              size={32}
            />
          ) : null;
          if (isNonLinkable) {
            return (
              <Typography color="text.primary" key={href}>
                {label}
              </Typography>
            );
          }
          return (
            <MUILink
              component={Link}
              href={href}
              key={href}
              underline="hover"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {icon}
              {label}
            </MUILink>
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
        aria-label="breadcrumb-menu"
      >
        {middleParts.map((part, i) => {
          const idx = i + 1;
          const href = "/" + pathParts.slice(0, idx + 1).join("/");
          const label = labels[part] || toTitleCase(part);
          const isNonLinkable = nonLinkable.includes(part);
          const isEquipmentType =
            Constants.public.Enums.equipment_type_enum.includes(
              part as EquipmentType,
            );
          const icon = isEquipmentType ? (
            <DisplayEquipmentThumbnail
              equipmentType={part as EquipmentType}
              size={32}
            />
          ) : null;
          if (isNonLinkable) {
            return (
              <MenuItem
                key={href}
                disabled
                sx={{ justifyContent: "flex-end", display: "flex" }}
              >
                {label}
              </MenuItem>
            );
          }
          return (
            <MenuItem
              key={href}
              component="a"
              href={href}
              onClick={handleMenuClose}
              sx={{ justifyContent: "flex-end", display: "flex" }}
            >
              <MUILink
                component={Link}
                href={href}
                underline="none"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {icon}
                {label}
              </MUILink>
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
          onClick={handleMenuClick}
        >
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
