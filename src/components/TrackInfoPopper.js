import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/base/ClickAwayListener';

export default function TrackInfoPopper({content, anchorEl, handleClose}) {

  const open = Boolean(anchorEl);
  const id = open ? 'track-info-popper' : undefined;

  return (
    <div>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={handleClose}>
          <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
            {content}
          </Box>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}