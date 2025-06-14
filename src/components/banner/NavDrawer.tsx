"use client";

import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import Link from "next/link";

/**
 * Navigation item structure for the drawer menu
 */
interface NavItem {
  /** Display text for the navigation item */
  label: string;
  /** URL path for the navigation item */
  href: string;
}

/**
 * Props for the NavDrawer component
 */
interface NavDrawerProps {
  /** Whether the drawer is currently open */
  open: boolean;
  /** Function to toggle the drawer open/closed state */
  handleDrawerToggle: () => void;
  /** Array of navigation items to display in the drawer */
  navItems: NavItem[];
}

/**
 * Navigation drawer component that displays a slide-out menu with navigation links
 */
const NavDrawer: React.FC<NavDrawerProps> = (props) => {
  const { open, handleDrawerToggle, navItems } = props;
  return (
    <nav>
      <Drawer
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Stack onClick={handleDrawerToggle}>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HomeIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ my: 1 }}>
                Weight Training
              </Typography>
            </ListItemButton>
          </ListItem>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={{ textAlign: "center" }}
                >
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          color: "primary.main",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Drawer>
    </nav>
  );
};

export default NavDrawer;
