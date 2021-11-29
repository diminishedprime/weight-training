import '@/firebase';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemText,
  styled,
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
import { Links } from '@/constants';
import { exerciseUIString } from '@/util';
import { Exercise } from '@/types';

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
      typeof window === undefined
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

  return { login, logout, loginStatus, user: currentUser };
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

export const UserCtx = React.createContext<User | null>(null);

const LinkButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginLeft: theme.spacing(1),
  justifyContent: 'flex-start',
}));

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { loginStatus, login, logout, user } = useAuth();
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
        <List sx={{ pr: 2 }}>
          <ListItemText>
            <LinkButton href="/">Home</LinkButton>
          </ListItemText>
          <Divider />
          <ListItemText sx={{ ml: 1 }}>Powerlifting</ListItemText>
          <ListItemText>
            <LinkButton href={Links.Squat}>
              {exerciseUIString(Exercise.Squat)}
            </LinkButton>
          </ListItemText>
          <ListItemText>
            <LinkButton href={Links.BenchPress}>
              {exerciseUIString(Exercise.BenchPress)}
            </LinkButton>
          </ListItemText>
          <ListItemText>
            <LinkButton href={Links.Deadlift}>
              {exerciseUIString(Exercise.Deadlift)}
            </LinkButton>
          </ListItemText>
          <Divider />
          <ListItemText sx={{ ml: 1 }}>Bar Accessory</ListItemText>
          <ListItemText>
            <LinkButton href={Links.FrontSquat}>
              {exerciseUIString(Exercise.FrontSquat)}
            </LinkButton>
          </ListItemText>
          <ListItemText>
            <LinkButton href={Links.OverheadPress}>
              {exerciseUIString(Exercise.OverheadPress)}
            </LinkButton>
          </ListItemText>
          <Divider />
          <ListItemText sx={{ ml: 1 }}>Dumbbell</ListItemText>
          <ListItemText>
            <LinkButton href={Links.DumbbellBicepCurl}>
              {exerciseUIString(Exercise.DumbbellBicepCurl)}
            </LinkButton>
          </ListItemText>
          <ListItemText>
            <LinkButton href={Links.DumbbellFly}>
              {exerciseUIString(Exercise.DumbbellFly)}
            </LinkButton>
          </ListItemText>
          <ListItemText>
            <LinkButton href={Links.DumbbellRow}>
              {exerciseUIString(Exercise.DumbbellRow)}
            </LinkButton>
          </ListItemText>
        </List>
      </Drawer>
      <UserCtx.Provider value={user}>
        <Box sx={{ ml: 0.5, mr: 0.5 }}>{children}</Box>
      </UserCtx.Provider>
    </div>
  );
};

export default Layout;
