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
  ThemeProvider,
  createTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import { PushPin } from '@mui/icons-material';
import { GatsbyLinkProps, Link } from 'gatsby';
import { linkForExercise } from '@/constants';
import { AuthCtxType, exerciseUIString } from '@/types';
import { useUserDocNoCtx } from '@/firebase/hooks/useUserDoc';
import { AuthCtx } from './AuthProvider';
import { LoginStatus } from './useAuth';
import useDrawer from '@/hooks/useDrawer';
import UserMenu from '@/components/Layout/UserMenu';

export interface LoggedOutProps {
  LogIn: JSX.Element;
}

interface LayoutProps {
  title: string;
  LoggedOut?: React.FC<LoggedOutProps>;
}

// This is pretty terrible, but It works and I don't feel like fighting the
// type checking.
const LinkBehavior = React.forwardRef<
  any,
  Omit<GatsbyLinkProps<any>, 'to'> & { href: GatsbyLinkProps<any>['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Link ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
} as any);

const LinkButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginLeft: theme.spacing(1),
  justifyContent: 'flex-start',
}));

const Layout: React.FC<LayoutProps> = ({ children, title, LoggedOut }) => {
  const { loginStatus, login, user } = React.useContext(AuthCtx as AuthCtxType);
  const { isOpen, close, open } = useDrawer();
  const userDocRequest = useUserDocNoCtx(user);

  const LogIn = React.useMemo(
    () => (
      <Button onClick={login} size="small" variant="contained" color="primary">
        Login
      </Button>
    ),
    [login],
  );

  const pinned = React.useMemo(() => {
    if (
      userDocRequest.type === 'resolved' &&
      userDocRequest.userDoc.pinnedExercises.type === 'set'
    ) {
      return (
        <>
          <Divider />
          <ListItemText sx={{ ml: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <PushPin />
              Pinned
            </Box>
          </ListItemText>
          {userDocRequest.userDoc.pinnedExercises.exercises.map((e) => (
            <ListItemText key={e}>
              <LinkButton href={linkForExercise(e)} onClick={close}>
                {exerciseUIString(e)}
              </LinkButton>
            </ListItemText>
          ))}
        </>
      );
    }
    return null;
  }, [userDocRequest, close]);

  return (
    <ThemeProvider theme={theme}>
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
              {loginStatus === LoginStatus.LoggedIn && <UserMenu />}
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
            {pinned}
          </List>
        </Drawer>
        <Box sx={{ ml: 0.5, mr: 0.5 }}>
          {loginStatus === LoginStatus.LoggedIn ? (
            children
          ) : loginStatus === LoginStatus.LoggedOut &&
            LoggedOut !== undefined ? (
            <LoggedOut LogIn={LogIn} />
          ) : loginStatus === LoginStatus.LoggedOut ? (
            children
          ) : (
            <Typography>Determining login status...</Typography>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
