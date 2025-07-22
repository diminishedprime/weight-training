"use client";
import {
  PaginationProps as MUIPaginationProps,
  PaginationItem,
  Stack,
} from "@mui/material";
import useMUIPagination from "@mui/material/usePagination";
import Link from "next/link";
import React from "react";

export interface PaginationWithHrefProps extends MUIPaginationProps {
  hrefFor?: (pageNum: number) => string;
}

const Pagination: React.FC<PaginationWithHrefProps> = ({
  hrefFor,
  ...props
}) => {
  // Use MUI's usePagination hook for custom rendering
  const { items } = useMUIPagination({
    ...props,
    showFirstButton: true,
    showLastButton: true,
  });

  // Split items into left, middle, right groups
  const leftItems = items.filter(
    (item) => item.type === "first" || item.type === "previous",
  );
  const rightItems = items.filter(
    (item) => item.type === "next" || item.type === "last",
  );
  const middleItems = items.filter(
    (item) =>
      item.type === "page" ||
      item.type === "start-ellipsis" ||
      item.type === "end-ellipsis",
  );

  const renderItem = (
    item: ReturnType<typeof useMUIPagination>["items"][number],
  ) => {
    // For navigation buttons, use hrefFor if available and item.page is defined
    const navTypes = ["first", "previous", "next", "last", "page"];
    // Default color is 'primary' unless overridden
    const color = item.selected ? (props.color ?? "primary") : undefined;
    if (hrefFor && navTypes.includes(item.type) && item.page) {
      return (
        <PaginationItem
          key={item.type + item.page}
          {...item}
          component={Link}
          href={hrefFor(item.page)}
          color={color}
        />
      );
    }
    return (
      <PaginationItem
        key={item.type + (item.page ?? "")}
        {...item}
        color={color}
      />
    );
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Stack direction="row" spacing={1}>
        {leftItems.map(renderItem)}
      </Stack>
      <Stack direction="row" spacing={1}>
        {middleItems.map(renderItem)}
      </Stack>
      <Stack direction="row" spacing={1}>
        {rightItems.map(renderItem)}
      </Stack>
    </Stack>
  );
};

export default Pagination;
