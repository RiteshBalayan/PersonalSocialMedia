import React, { useState, useEffect } from 'react';
import { Paper, List, ListItem, ListItemIcon, ListItemText, Box, Avatar  } from '@mui/material';
import { Home, Whatshot, Person, Search, SwitchAccount, Settings, ExitToApp} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const navigate = useNavigate();

  // Access user authentication and profile information from your state
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn); 
  const userId = useSelector(state => state.auth.user?.id); 
  const userName = useSelector(state => state.auth.user?.username);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await axiosInstance.get(`/profiles/${userId}/`);
          setProfilePicUrl(response.data.profile_pic); 
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      }
    };

    fetchProfilePic();
  }, [isLoggedIn, userId]); 

  // Handler function for button clicks within the sidebar
  const handleNavigation = (destination) => {
    setActiveItem(destination);
    console.log(`Navigating to: ${destination}`);  // Replace this with actual navigation logic later
  };

  const paperStyle = {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '20px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', // Floating shadow effect
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)', // Slightly scales on hover for effect
    },
  };

    // Handler function for logout
    const handleLogout = async () => {
      navigate('/login')
    };

  return (
    <Box
      sx={{
        width: 240,
        marginLeft: '20px', // Float away from the left screen edge
        marginTop: '20px',
        position: 'fixed', // Fixes the sidebar so it stays while scrolling
      }}
    >
      <List>
          {/* Profile */}
            <Paper sx={paperStyle} onClick={handleLogout}>   
          <ListItem>
            <ListItemIcon>
            {isLoggedIn && profilePicUrl ? ( 
              <Avatar src={profilePicUrl} alt={userName} /> 
            ) : (
              <Person /> 
            )}
            </ListItemIcon>
            <ListItemText primary={isLoggedIn ? userName : "Profile"} />
          </ListItem>
        </Paper>

        {/* Home */}
        <Paper sx={paperStyle} onClick={() => handleNavigation('Home')}>
          <ListItem>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Paper>

        {/* Trending */}
        <Paper sx={paperStyle} onClick={() => handleNavigation('Trending')}>
          <ListItem>
            <ListItemIcon>
              <Whatshot />
            </ListItemIcon>
            <ListItemText primary="Trending" />
          </ListItem>
        </Paper>

        {/* Search */}
        <Paper sx={paperStyle} onClick={() => handleNavigation('Search')}>
          <ListItem>
            <ListItemIcon>
              <Search />
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItem>
        </Paper>

        {/* Switch User */}
        <Paper sx={paperStyle} onClick={() => handleNavigation('Switch User')}>
          <ListItem>
            <ListItemIcon>
              <SwitchAccount />
            </ListItemIcon>
            <ListItemText primary="Switch User" />
          </ListItem>
        </Paper>

        {/* Settings */}
        <Paper sx={paperStyle} onClick={() => handleNavigation('Settings')}>
          <ListItem>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Paper>

          {/* Logout */}
          {isLoggedIn && (
          <Paper sx={paperStyle} onClick={handleLogout}>   
            <ListItem>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </Paper>
        )}

      </List>
    </Box>
  );
};

export default Sidebar;
