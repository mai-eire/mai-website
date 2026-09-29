import React, { useState } from 'react';
import { Stack, IconButton, Tooltip, Snackbar } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

// Share controls. Plain links to each network's share endpoint rather than
// their embedded widgets, so no third-party script loads on a page a reader
// may have arrived at from a news story.
const SharePost = ({ url, title }) => {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const targets = [
    { label: 'Share on X', icon: <XIcon />, href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
    { label: 'Share on Facebook', icon: <FacebookIcon />, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: 'Share on WhatsApp', icon: <WhatsAppIcon />, href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { label: 'Share by email', icon: <EmailIcon />, href: `mailto:?subject=${enc(title)}&body=${enc(url)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard access can be refused (insecure context, permissions).
      // The share links still work, so fail quietly rather than alarm anyone.
    }
  };

  return (
    <>
      <Stack direction="row" spacing={0.5}>
        {targets.map((t) => (
          <Tooltip key={t.label} title={t.label}>
            <IconButton
              component="a"
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              aria-label={t.label}
            >
              {t.icon}
            </IconButton>
          </Tooltip>
        ))}
        <Tooltip title="Copy link">
          <IconButton onClick={copy} size="small" aria-label="Copy link">
            <LinkIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={() => setCopied(false)}
        message="Link copied"
      />
    </>
  );
};

export default SharePost;
