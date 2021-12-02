import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { AuthCtx } from './AuthProvider';
import useDrawer from '@/hooks/useDrawer';
import { AuthCtxType } from '@/types';

const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, logout } = React.useContext(AuthCtx as AuthCtxType);
  const drawerAPI = useDrawer();
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      drawerAPI.open();
    },
    [drawerAPI],
  );

  if (user === 'unknown' || user === null) {
    return null;
  }

  return (
    <>
      <Tooltip title="Open Settings">
        <IconButton onClick={handleClick} sx={{ p: 0 }}>
          <Avatar alt={user.displayName || ''} src={user.photoURL || ''} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={drawerAPI.isOpen}
        onClose={drawerAPI.close}
      >
        <MenuItem onClick={logout}>
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
