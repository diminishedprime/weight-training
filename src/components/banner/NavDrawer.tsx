"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface NavDrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  navItems: NavItem[];
}

export default function NavDrawer({
  mobileOpen,
  handleDrawerToggle,
  navItems,
}: NavDrawerProps) {
  return (
    <nav>
      <Drawer
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box onClick={handleDrawerToggle}>
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
        </Box>
      </Drawer>
    </nav>
  );
}
