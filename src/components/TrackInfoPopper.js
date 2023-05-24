import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';

export default function TrackInfoPopper({content, anchorEl, handleClose}) {

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          {content}
        </Box>
        <button aria-describedby={id} type="button" onClick={handleClose}>
          Close Popper
        </button>
      </Popper>
    </div>
  );
}