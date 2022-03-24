import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { MaterialUISwitch } from './button/MaterialUiSwitch';

interface HeaderProps {
  onSwitchClick: () => void;
  mode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSwitchClick, mode }) => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          StoreTail
        </Typography>
        <MaterialUISwitch onClick={onSwitchClick} checked={mode} />
      </Toolbar>
    </AppBar>
  );
};
