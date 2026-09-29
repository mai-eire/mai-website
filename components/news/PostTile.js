import React from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

// The media slot for a row that has no photograph of its own.
//
// Statements never carry a cover image - a press statement that needs a stock
// photo is one nobody trusts - and an article sometimes arrives without one.
// Either way an empty grey box reads as a broken image, so both get a designed
// tile instead: same construction, opposite tone. The statement tile is solid
// brand green and says STATEMENT; the article tile is quiet paper-grey. They
// are built as one component so the pair can never drift apart.
const PostTile = ({ type, referenceCode, compact = false }) => {
  const isStatement = type === 'STATEMENT';

  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 0.5 : 1,
        px: 1,
        ...(isStatement
          ? {
              background: 'linear-gradient(145deg, #2e7d32 0%, #1b5e20 100%)',
              color: '#ffffff',
            }
          : {
              backgroundColor: '#eceef0',
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.07)',
            }),
        // A faint diagonal grain, so the tile reads as a printed document
        // rather than a flat colour swatch.
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          opacity: isStatement ? 0.1 : 0.5,
          backgroundImage: `repeating-linear-gradient(135deg, ${
            isStatement ? '#ffffff' : '#ffffff'
          } 0, ${isStatement ? '#ffffff' : '#ffffff'} 1px, transparent 1px, transparent 9px)`,
        },
      }}
    >
      <Box sx={{ position: 'relative', opacity: isStatement ? 0.95 : 0.4 }}>
        <Image
          src={isStatement ? '/assets/MAI_Logo_White.png' : '/assets/MAI_Logo.png'}
          alt=""
          width={compact ? 52 : 72}
          height={compact ? 22 : 30}
          style={{ objectFit: 'contain' }}
        />
      </Box>

      <Typography
        sx={{
          position: 'relative',
          fontSize: compact ? '0.55rem' : '0.66rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          lineHeight: 1.4,
        }}
      >
        {isStatement ? 'STATEMENT' : 'ARTICLE'}
      </Typography>

      {isStatement && referenceCode && !compact && (
        <Typography
          sx={{
            position: 'relative',
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            opacity: 0.85,
            fontFamily: 'monospace',
          }}
        >
          {referenceCode}
        </Typography>
      )}
    </Box>
  );
};

export default PostTile;
