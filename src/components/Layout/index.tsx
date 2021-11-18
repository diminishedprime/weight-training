import '@/firebase';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';

const provider = new GoogleAuthProvider();

interface LayoutProps {
  title: string;
}

enum LoginStatus {
  Unknown,
  LoggedIn,
  LoggedOut,
}

const useAuth = () => {
  const auth = useMemo(() => getAuth(), []);
  const [currentUser, setCurrentUser] = React.useState<User | null>(
    auth.currentUser,
  );

  const loginStatus = useMemo(
    () =>
      window === undefined
        ? LoginStatus.Unknown
        : currentUser === null
        ? LoginStatus.LoggedOut
        : LoginStatus.LoggedIn,
    [currentUser],
  );

  useEffect(() => onAuthStateChanged(auth, setCurrentUser), [auth]);

  const login = useCallback(() => {
    signInWithPopup(auth, provider).then((result) => {
      setCurrentUser(result.user);
    });
  }, [auth]);

  const logout = useCallback(() => {
    signOut(auth).then(() => {
      setCurrentUser(null);
    });
  }, [auth]);

  return { login, logout, loginStatus };
};

const useDrawer = () => {
  const [isOpen, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((old) => !old);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const open = useCallback(() => {
    setOpen(true);
  }, []);

  return { toggle, close, isOpen, open };
};

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { loginStatus, login, logout } = useAuth();
  const { isOpen, close, open } = useDrawer();
  return (
    <div>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, mb: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={open}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {loginStatus === LoginStatus.LoggedIn && (
              <Button onClick={logout} color="inherit">
                Logout
              </Button>
            )}
            {loginStatus === LoginStatus.LoggedOut && (
              <Button onClick={login} color="inherit">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer anchor="left" open={isOpen} onClose={close}>
        <List>
          <ListItemText>
            <Link href="/">Home</Link>
          </ListItemText>
          <ListItemText>
            <Link href="/404">404</Link>
          </ListItemText>
        </List>
      </Drawer>
      <Box sx={{ ml: 0.5, mr: 0.5 }}>{children}</Box>
    </div>
  );
};

export default Layout;
