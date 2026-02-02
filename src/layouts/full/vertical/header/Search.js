import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons';
import Menuitems from '../sidebar/MenuItems';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { Link } from 'react-router-dom';

const Search = () => {
  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);
  const [search, setSerach] = useState('');

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  const filterRoutes = (rotr, cSearch) => {
    if (!cSearch || cSearch.trim() === '') {
      return rotr;
    }
    
    const searchLower = cSearch.toLocaleLowerCase();
    
    return rotr.filter((t) => {
      // Skip navlabel items
      if (t.navlabel || t.subheader) {
        return false;
      }
      
      // Check if title matches
      const titleMatch = t.title && t.title.toLocaleLowerCase().includes(searchLower);
      
      // Check if href matches (if href exists)
      const hrefMatch = t.href && t.href.toLocaleLowerCase().includes(searchLower);
      
      // Check if any child matches
      const childMatch = t.children && t.children.some((child) => {
        const childTitleMatch = child.title && child.title.toLocaleLowerCase().includes(searchLower);
        const childHrefMatch = child.href && child.href.toLocaleLowerCase().includes(searchLower);
        return childTitleMatch || childHrefMatch;
      });
      
      return titleMatch || hrefMatch || childMatch;
    });
  };
  const searchData = filterRoutes(Menuitems, search);
  return (
    <>
      <IconButton
        aria-label="show 4 new mails"
        color="inherit"
        aria-controls="search-menu"
        aria-haspopup="true"
        onClick={() => setShowDrawer2(true)}
        size="large"
      >
        <IconSearch size="16" />
      </IconButton>
      <Dialog
        open={showDrawer2}
        onClose={() => setShowDrawer2(false)}
        fullWidth
        maxWidth={'sm'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { position: 'fixed', top: 30, m: 0 } }}
      >
        <DialogContent className="testdialog">
          <Stack direction="row" spacing={2} alignItems="center">
            <CustomTextField
              id="tb-search"
              placeholder="Search here"
              fullWidth
              onChange={(e) => setSerach(e.target.value)}
            />
            <IconButton size="small" variant="outlined" onClick={handleDrawerClose2}>
              <IconX size="18" />
            </IconButton>
          </Stack>
        </DialogContent>
        <Divider />
        <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Typography variant="h5" p={1}>
            Quick Page Links
          </Typography>
          <Box>
            <List component="nav">
              {searchData.length > 0 ? (
                searchData.map((menu) => {
                  return (
                    <Box key={menu.title ? menu.id : menu.subheader || Math.random()}>
                      {menu.title && !menu.children && menu.href ? (
                        <ListItemButton sx={{ py: 0.5, px: 1 }} to={menu.href} component={Link}>
                          <ListItemText
                            primary={menu.title}
                            secondary={menu.href}
                            sx={{ my: 0, py: 0.5 }}
                          />
                        </ListItemButton>
                      ) : null}
                      {menu.children ? (
                        <>
                          {menu.children.map((child) => {
                            if (!child.href) return null;
                            return (
                              <ListItemButton
                                sx={{ py: 0.5, px: 1 }}
                                to={child.href}
                                component={Link}
                                key={child.title ? child.id : Math.random()}
                              >
                                <ListItemText
                                  primary={child.title}
                                  secondary={child.href}
                                  sx={{ my: 0, py: 0.5 }}
                                />
                              </ListItemButton>
                            );
                          })}
                        </>
                      ) : null}
                    </Box>
                  );
                })
              ) : (
                <Box p={2}>
                  <Typography variant="body2" color="text.secondary">
                    No results found
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Search;
