import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Typography, Link as MuiLink, Divider } from '@mui/material';

// Renders a post's Markdown body.
//
// react-markdown builds React elements rather than injecting an HTML string,
// so a post body can never smuggle a <script> onto the page even if an editor
// account is compromised. Each element is mapped to the site's typography so
// post bodies match the rest of the site instead of falling back to browser
// defaults.
const components = {
  h1: (props) => <Typography variant="h3" component="h2" sx={{ mt: 5, mb: 2 }} {...props} />,
  h2: (props) => <Typography variant="h4" component="h2" sx={{ mt: 5, mb: 2 }} {...props} />,
  h3: (props) => <Typography variant="h5" component="h3" sx={{ mt: 4, mb: 1.5 }} {...props} />,
  p: (props) => <Typography variant="body1" sx={{ mb: 2.5, fontSize: '1.0625rem' }} {...props} />,
  a: ({ href, ...props }) => (
    <MuiLink
      href={href}
      // Outbound links open in a new tab; noopener is what stops the opened
      // page from reaching back into this one via window.opener.
      {...(href && /^https?:/.test(href)
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      sx={{ color: 'primary.main', textDecorationColor: 'rgba(46,125,50,0.4)' }}
      {...props}
    />
  ),
  ul: (props) => <Box component="ul" sx={{ pl: 3, mb: 2.5 }} {...props} />,
  ol: (props) => <Box component="ol" sx={{ pl: 3, mb: 2.5 }} {...props} />,
  li: (props) => (
    <Box component="li" sx={{ mb: 1 }}>
      <Typography variant="body1" component="span" sx={{ fontSize: '1.0625rem' }} {...props} />
    </Box>
  ),
  blockquote: (props) => (
    <Box
      component="blockquote"
      sx={{
        m: 0,
        my: 3,
        pl: 3,
        borderLeft: '4px solid',
        borderColor: 'primary.main',
        fontStyle: 'italic',
        color: 'text.secondary',
      }}
      {...props}
    />
  ),
  hr: () => <Divider sx={{ my: 4 }} />,
  strong: (props) => <Box component="strong" sx={{ fontWeight: 700 }} {...props} />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <Box
      component="img"
      src={src}
      alt={alt || ''}
      sx={{ maxWidth: '100%', height: 'auto', borderRadius: 2, my: 3 }}
    />
  ),
  table: (props) => (
    <Box sx={{ overflowX: 'auto', my: 3 }}>
      <Box
        component="table"
        sx={{
          borderCollapse: 'collapse',
          width: '100%',
          '& th, & td': { border: '1px solid', borderColor: 'divider', p: 1.5, textAlign: 'left' },
          '& th': { backgroundColor: 'background.default', fontWeight: 700 },
        }}
        {...props}
      />
    </Box>
  ),
};

const PostBody = ({ body }) => (
  <Box sx={{ '& > *:first-of-type': { mt: 0 } }}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {body || ''}
    </ReactMarkdown>
  </Box>
);

export default PostBody;
