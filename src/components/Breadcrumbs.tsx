import Link from "next/link";
import { Breadcrumbs as MUIBreadcrumbs, Typography } from "@mui/material";

function toTitleCase(str: string) {
  return str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface BreadcrumbsProps {
  pathname: string;
  labels?: Record<string, string>;
  nonLinkable?: string[];
}

export default function Breadcrumbs({
  pathname,
  labels = {},
  nonLinkable = [],
}: BreadcrumbsProps) {
  const pathParts = pathname.split("/").filter(Boolean);

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
