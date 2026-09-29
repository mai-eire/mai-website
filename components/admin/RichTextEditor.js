import React, { useCallback, useEffect } from 'react';
import { Box, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Markdown } from 'tiptap-markdown';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

// A what-you-see editor that stores Markdown.
//
// The database column, the RSS feed and the public page all still hold and
// render Markdown - nothing downstream changed. This component is only a
// different way of typing it, so an editor who has never written Markdown can
// make a heading without knowing that "##" means one.
//
// Two things matter for not losing anyone's writing:
//  - Tables are loaded even though the toolbar cannot insert one. Without the
//    extension, opening a post that already contains a table would silently
//    drop it on the next save.
//  - onChange fires only when the document actually changes. Simply opening a
//    post never rewrites its stored Markdown, so existing posts are not
//    quietly reformatted by being looked at.

const ToolbarButton = ({ title, onClick, active, disabled, children }) => (
  <Tooltip title={title}>
    {/* A disabled button cannot be the direct child of a Tooltip. */}
    <span>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        aria-label={title}
        aria-pressed={Boolean(active)}
        sx={{
          borderRadius: 1,
          color: active ? 'primary.main' : 'text.secondary',
          backgroundColor: active ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
        }}
      >
        {children}
      </IconButton>
    </span>
  </Tooltip>
);

const HeadingButton = ({ editor, level }) => {
  const active = editor.isActive('heading', { level });
  return (
    <Tooltip title={level === 2 ? 'Heading' : 'Sub-heading'}>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        aria-label={level === 2 ? 'Heading' : 'Sub-heading'}
        aria-pressed={active}
        sx={{
          borderRadius: 1,
          width: 32,
          fontSize: '0.8rem',
          fontWeight: 700,
          color: active ? 'primary.main' : 'text.secondary',
          backgroundColor: active ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
        }}
      >
        H{level}
      </IconButton>
    </Tooltip>
  );
};

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    // Next renders this page on the server first; letting Tiptap paint
    // immediately there would hydrate against a different DOM.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder || 'Write the post…' }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown.configure({ transformPastedText: true, linkify: true }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => onChange(ed.storage.markdown.getMarkdown()),
  });

  // Keep in step with the form without fighting the cursor. After a save the
  // server echoes the body back, which is byte-identical to what we sent, so
  // this comparison means nothing is reset and the caret stays put.
  useEffect(() => {
    if (!editor) return;
    const current = editor.storage.markdown.getMarkdown();
    if ((value || '') !== current) {
      editor.commands.setContent(value || '', false);
    }
    // Only react to an external value change, never to our own keystrokes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const existing = editor.getAttributes('link').href || '';
    // eslint-disable-next-line no-alert
    const url = window.prompt('Link address', existing);
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: /^https?:/.test(url) ? '_blank' : null })
      .run();
  }, [editor]);

  if (!editor) {
    // The server pass and the first client frame. Reserves the same height so
    // the sticky action bar above does not jump when the editor appears.
    return (
      <Box
        sx={{
          minHeight: 520,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          backgroundColor: 'background.paper',
        }}
      />
    );
  }

  return (
    <Box
      // Deliberately not `overflow: hidden`. That would make this box the
      // toolbar's scrollport, and a sticky element inside a box that never
      // scrolls is pushed down by its own `top` offset - the toolbar landed
      // 126px into the first paragraph. The corners below are rounded
      // individually instead.
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.paper',
        '&:focus-within': { borderColor: 'primary.main' },
      }}
    >
      <Stack
        direction="row"
        spacing={0.25}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        sx={{
          position: 'sticky',
          // Clears the admin bar and the editor's own action bar above it.
          top: { xs: 118, sm: 126 },
          zIndex: 1,
          px: 1,
          py: 0.5,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      >
        <ToolbarButton
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBoldIcon sx={{ fontSize: 18 }} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalicIcon sx={{ fontSize: 18 }} />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

        <HeadingButton editor={editor} level={2} />
        <HeadingButton editor={editor} level={3} />

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

        <ToolbarButton
          title="Bulleted list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon sx={{ fontSize: 18 }} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumberedIcon sx={{ fontSize: 18 }} />
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FormatQuoteIcon sx={{ fontSize: 18 }} />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

        <ToolbarButton title="Add link" active={editor.isActive('link')} onClick={setLink}>
          <LinkIcon sx={{ fontSize: 18 }} />
        </ToolbarButton>
        <ToolbarButton
          title="Remove link"
          disabled={!editor.isActive('link')}
          onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
        >
          <LinkOffIcon sx={{ fontSize: 18 }} />
        </ToolbarButton>

        {/* Undo and redo sit apart from the formatting on a wide toolbar. On a
            phone the gap would push them onto a row of their own, so there it
            closes up and the buttons wrap where they fall. */}
        <Box sx={{ flexGrow: { xs: 0, sm: 1 } }} />

        <ToolbarButton
          title="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <UndoIcon sx={{ fontSize: 18 }} />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <RedoIcon sx={{ fontSize: 18 }} />
        </ToolbarButton>
      </Stack>

      {/* The writing area is styled to read roughly as the published page
          does, so what an editor sees here is what a reader will get. */}
      <Box
        onClick={() => editor.chain().focus().run()}
        sx={{
          px: { xs: 2, sm: 3 },
          py: 3,
          cursor: 'text',
          '& .ProseMirror': {
            outline: 'none',
            minHeight: 440,
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            '& > *:first-of-type': { mt: 0 },
            '& p': { my: 0, mb: 2.5 },
            '& h2': {
              fontFamily: '"Lora", serif',
              fontSize: '1.5rem',
              fontWeight: 600,
              mt: 4,
              mb: 1.5,
            },
            '& h3': {
              fontFamily: '"Lora", serif',
              fontSize: '1.2rem',
              fontWeight: 600,
              mt: 3,
              mb: 1,
            },
            '& ul, & ol': { pl: 3, mb: 2.5 },
            '& li': { mb: 0.75 },
            '& li p': { mb: 0 },
            '& blockquote': {
              m: 0,
              my: 3,
              pl: 3,
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              fontStyle: 'italic',
              color: 'text.secondary',
            },
            '& a': { color: 'primary.main' },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              my: 3,
              '& th, & td': {
                border: '1px solid',
                borderColor: 'divider',
                p: 1.5,
                textAlign: 'left',
              },
              '& th': { backgroundColor: 'background.default', fontWeight: 700 },
            },
            // Tiptap marks the first empty paragraph so a hint can be drawn
            // over it; a real element would be part of the document.
            '& p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              float: 'left',
              height: 0,
              pointerEvents: 'none',
              color: 'text.disabled',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          px: 2,
          py: 1,
          color: 'text.secondary',
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        Formatting is saved as Markdown. Markdown shortcuts work as you type:
        <b> ## </b> for a heading, <b> - </b> for a bullet, <b> &gt; </b> for a quote.
      </Typography>
    </Box>
  );
};

export default RichTextEditor;
