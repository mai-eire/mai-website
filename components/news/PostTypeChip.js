import React from 'react';
import { Chip } from '@mui/material';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { getPostType } from '../../data/posts';

// The tag that tells a reader, at a glance and everywhere a post appears,
// whether they are looking at an official position or someone's opinion.
// Statements take the solid brand green (institutional voice); articles take a
// quieter outline (individual voice). That contrast is the whole point, so the
// two are never styled the same.
const PostTypeChip = ({ type, size = 'small' }) => {
  const meta = getPostType(type);
  const isStatement = meta.id === 'STATEMENT';

  return (
    <Chip
      size={size}
      icon={isStatement ? <CampaignOutlinedIcon /> : <CreateOutlinedIcon />}
      label={meta.label}
      sx={{
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        height: 24,
        borderRadius: 1,
        ...(isStatement
          ? {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '& .MuiChip-icon': { color: 'primary.contrastText' },
            }
          : {
              backgroundColor: 'transparent',
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiChip-icon': { color: 'text.secondary' },
            }),
        '& .MuiChip-icon': { fontSize: 15, ml: 0.75 },
      }}
    />
  );
};

export default PostTypeChip;
