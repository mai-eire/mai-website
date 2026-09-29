import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CircleIcon from '@mui/icons-material/Circle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RichTextEditor from './RichTextEditor';
import { POST_TYPES, TOPICS, getPostType } from '../../data/posts';
import { excerptFromBody } from '../../lib/excerpt';
import { draftPreviewUrl, postUrl } from '../news/postFormatting';

const emptyPost = {
  type: 'STATEMENT',
  title: '',
  slug: '',
  summary: '',
  body: '',
  status: 'DRAFT',
  publishedAt: '',
  topics: [],
  coverImageUrl: '',
  authorName: '',
  authorTitle: '',
  authorPhotoUrl: '',
  isExternalSubmission: false,
  issuedBy: '',
  referenceCode: '',
  pdfUrl: '',
};

// Turns the API's shape into the shape the form fields want: nulls become
// empty strings (a controlled TextField cannot take null) and the ISO
// timestamp becomes the yyyy-mm-ddThh:mm a datetime-local input expects.
const toForm = (post) => {
  if (!post) return emptyPost;
  const out = { ...emptyPost, ...post };
  Object.keys(out).forEach((k) => {
    if (out[k] === null) out[k] = '';
  });
  out.publishedAt = post.publishedAt ? post.publishedAt.slice(0, 16) : '';
  out.topics = post.topics || [];
  return out;
};

// A labelled group in the sidebar. Flat headings rather than nested cards -
// the editor used to stack three bordered panels down the right-hand side,
// which made every option look equally important.
const Group = ({ label, children }) => (
  <Box sx={{ mb: 3.5 }}>
    <Typography
      sx={{
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'text.secondary',
        mb: 1.5,
      }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

// A group you can fold away. Everything that describes the post rather than
// being the post is in one of these, and they all start shut: an editor should
// meet a short list of headings, not every field the schema has.
//
// `hint` is what stops that from hiding things. A closed section still says
// what is in it - the author's name, how many topics are on - so you can see
// the state of the whole post without opening anything.
const Foldaway = ({ label, hint, children }) => (
  <Accordion
    elevation={0}
    disableGutters
    sx={{
      mb: 1.5,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      backgroundColor: 'transparent',
      '&::before': { display: 'none' },
      '&:first-of-type, &:last-of-type': { borderRadius: 2 },
    }}
  >
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="baseline"
        sx={{ width: '100%', minWidth: 0, pr: 1 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>
          {label}
        </Typography>
        {hint && (
          <Typography
            variant="caption"
            // Sits next to its label, reading as "Topics: Community, Education",
            // and truncates rather than pushing the chevron off the row.
            sx={{
              color: 'text.secondary',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {hint}
          </Typography>
        )}
      </Stack>
    </AccordionSummary>
    <AccordionDetails sx={{ pt: 0 }}>{children}</AccordionDetails>
  </Accordion>
);

const PostEditor = ({ post: initialPost }) => {
  const router = useRouter();
  const isNew = !initialPost;

  const [form, setForm] = useState(() => toForm(initialPost));
  const [errors, setErrors] = useState([]);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [menuEl, setMenuEl] = useState(null);

  const isStatement = form.type === 'STATEMENT';
  const isLive = form.status === 'PUBLISHED';
  const typeMeta = useMemo(() => getPostType(form.type), [form.type]);

  // Exactly what the newsroom will show if the summary is left blank. Computed
  // from the same helper the server uses, so the greyed hint in the field is
  // the real thing rather than an approximation of it.
  const fallbackSummary = useMemo(() => excerptFromBody(form.body), [form.body]);

  const selectedTopics = useMemo(
    () => TOPICS.filter((t) => form.topics.includes(t.id)),
    [form.topics]
  );

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // `status` is passed explicitly rather than read from form state, so the
  // Publish button always publishes even if React has not flushed a state
  // update from a field the editor just typed in.
  //
  // Returns the saved post, or null if it did not save - which is what lets
  // Preview save first and only then go and look at the result.
  const save = async (status, { goToPreview = false } = {}) => {
    setBusy(true);
    setErrors([]);
    setNotice('');

    const payload = {
      ...form,
      status,
      publishedAt: form.publishedAt || null,
      // Leave the slug to the server on a new post - it derives one from the
      // title and guarantees uniqueness.
      slug: isNew ? '' : form.slug,
    };

    try {
      const res = await fetch(
        isNew ? '/api/admin/posts' : `/api/admin/posts/${initialPost.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || [data.error || 'Could not save this post.']);
        return null;
      }

      if (goToPreview) {
        router.push(draftPreviewUrl(data.post));
        return data.post;
      }

      if (isNew) {
        router.push(`/admin/posts/${data.post.id}`);
        return data.post;
      }

      setForm(toForm(data.post));
      setNotice(
        status === 'PUBLISHED' ? 'Published. It is live now.' : 'Saved as a draft.'
      );
      return data.post;
    } catch {
      setErrors(['Could not reach the server. Your changes are not saved.']);
      return null;
    } finally {
      setBusy(false);
    }
  };

  // Preview saves the draft on the way. Showing an editor the last saved
  // version of a post they have just been typing into would be worse than
  // offering no preview at all. It is only offered while a post is a draft -
  // saving a live one as a draft would take it off the site.
  const preview = () => save('DRAFT', { goToPreview: true });

  const remove = async () => {
    setMenuEl(null);
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this draft permanently?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/posts/${initialPost.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || ['Could not delete this post.']);
        return;
      }
      router.push('/admin/posts');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      {/* Actions live in one bar that follows you down a long body, rather than
          in a sidebar card competing with the options below it. */}
      <Paper
        elevation={0}
        sx={{
          position: 'sticky',
          top: { xs: 56, sm: 60 },
          zIndex: 3,
          mb: 3,
          px: { xs: 2, sm: 2.5 },
          py: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <Stack direction="row" spacing={0.75} alignItems="center">
            <CircleIcon
              sx={{ fontSize: 10, color: isLive ? 'primary.main' : 'text.disabled' }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {isNew ? 'New post' : isLive ? 'Live' : 'Draft'}
            </Typography>
          </Stack>

          {isLive && !isNew && (
            <Button
              size="small"
              component={Link}
              href={postUrl(form)}
              target="_blank"
              endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
              sx={{ color: 'text.secondary' }}
            >
              View
            </Button>
          )}

          {!isLive && (
            <Tooltip title="Save and look at the post as a reader would">
              <span>
                <Button
                  size="small"
                  disabled={busy}
                  onClick={preview}
                  startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                  sx={{ color: 'text.secondary' }}
                >
                  Preview
                </Button>
              </span>
            </Tooltip>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Button variant="outlined" disabled={busy} onClick={() => save('DRAFT')}>
            {isLive ? 'Unpublish' : 'Save draft'}
          </Button>
          <Button variant="contained" disabled={busy} onClick={() => save('PUBLISHED')}>
            {isLive ? 'Save changes' : 'Publish'}
          </Button>

          {!isNew && (
            <>
              <Tooltip title="More">
                <IconButton size="small" onClick={(e) => setMenuEl(e.currentTarget)}>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={menuEl}
                open={Boolean(menuEl)}
                onClose={() => setMenuEl(null)}
              >
                <MenuItem
                  onClick={remove}
                  // A published post is part of the public record and every
                  // link to it would break, so it must be unpublished first.
                  disabled={isLive}
                  sx={{ color: 'error.main' }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
      </Paper>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </Alert>
      )}
      {notice && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setNotice('')}>
          {notice}
          {isLive && (
            <>
              {' '}
              <Link href={postUrl(form)} target="_blank">
                View it
              </Link>
            </>
          )}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left: the writing, and nothing else. Title, summary, body, in the
            order they are read. Everything that describes the post rather than
            being the post lives in the column on the right. */}
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            required
            multiline
            variant="standard"
            placeholder="Title"
            value={form.title}
            onChange={set('title')}
            InputProps={{
              sx: {
                fontFamily: '"Lora", serif',
                fontSize: '1.75rem',
                fontWeight: 600,
                lineHeight: 1.25,
                // A long title wraps onto as many lines as it needs. Scrolling
                // a one-line box to read your own headline is no way to check
                // it, and headlines here do run long.
                py: 1,
              },
            }}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Summary"
            placeholder={
              fallbackSummary ||
              'One or two sentences for the newsroom list and for shared links.'
            }
            helperText={
              form.summary
                ? 'Shown on the newsroom list and as the preview when the link is shared.'
                : 'Optional. Left blank, the greyed text is what the newsroom will show — the opening of the post, kept in step with it as you write.'
            }
            value={form.summary}
            onChange={set('summary')}
            // The label has to float out of the way from the start, or MUI
            // holds the placeholder back until the field is focused - and the
            // placeholder is the whole point here: it is the fallback itself.
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: { backgroundColor: 'background.paper' } }}
            sx={{ mb: 3 }}
          />

          <RichTextEditor
            value={form.body}
            onChange={(markdown) => setForm((prev) => ({ ...prev, body: markdown }))}
            placeholder="Write the post…"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          {/* The type decides what the rest of this column even asks for, so it
              comes first in it. */}
          <Group label="Type">
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={form.type}
              onChange={(_, v) => v && setForm((prev) => ({ ...prev, type: v }))}
            >
              {POST_TYPES.map((t) => (
                <ToggleButton key={t.id} value={t.id}>
                  {t.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Group>

          <Foldaway
            label="Topics"
            hint={
              selectedTopics.length
                ? selectedTopics.map((t) => t.label).join(', ')
                : 'None'
            }
          >
            <Autocomplete
              multiple
              disableCloseOnSelect
              disableClearable
              size="small"
              options={TOPICS}
              value={selectedTopics}
              getOptionLabel={(t) => t.label}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              onChange={(_, chosen) =>
                setForm((prev) => ({ ...prev, topics: chosen.map((t) => t.id) }))
              }
              // A tick beside every option, on or off. Highlighting alone asks
              // you to work out which of nine rows is shaded differently.
              renderOption={(props, option, { selected }) => {
                const { key, ...rest } = props;
                return (
                  <Box component="li" key={key} {...rest}>
                    <Checkbox
                      size="small"
                      checked={selected}
                      tabIndex={-1}
                      disableRipple
                      sx={{ mr: 1, p: 0.5 }}
                    />
                    {option.label}
                  </Box>
                );
              }}
              // Nothing inside the box. The input stays one line you can type
              // into, and the choices are listed below it where they read as a
              // set rather than as a growing pile shoving the cursor along.
              renderTags={() => null}
              renderInput={(params) => (
                <TextField {...params} placeholder="Search topics" />
              )}
            />

            {selectedTopics.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mt: 1.5 }}
              >
                {selectedTopics.map((t) => (
                  <Chip
                    key={t.id}
                    size="small"
                    label={t.label}
                    onDelete={() =>
                      setForm((prev) => ({
                        ...prev,
                        topics: prev.topics.filter((id) => id !== t.id),
                      }))
                    }
                  />
                ))}
              </Stack>
            )}
          </Foldaway>

          {/* The server clears whichever group does not belong to the chosen
              type on save, so a statement can never keep a stale byline. */}
          {isStatement ? (
            <Foldaway
              label="Statement details"
              hint={form.issuedBy || typeMeta.defaultIssuedBy || 'Not set'}
            >
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Issued by"
                  placeholder={typeMeta.defaultIssuedBy || ''}
                  helperText="Appears in place of a byline."
                  value={form.issuedBy}
                  onChange={set('issuedBy')}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Reference code"
                  placeholder="MAI-2026-014"
                  helperText="Optional. Gives press a stable reference to cite."
                  value={form.referenceCode}
                  onChange={set('referenceCode')}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="PDF URL"
                  helperText="Optional. A letterheaded version for press."
                  value={form.pdfUrl}
                  onChange={set('pdfUrl')}
                />
              </Stack>
            </Foldaway>
          ) : (
            <>
              <Foldaway
                label="Author details"
                hint={form.authorName || 'No byline'}
              >
                <Stack spacing={2.5} sx={{ pt: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Name"
                    value={form.authorName}
                    onChange={set('authorName')}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Title"
                    placeholder="Youth Coordinator, MAI"
                    value={form.authorTitle}
                    onChange={set('authorTitle')}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Photo URL"
                    value={form.authorPhotoUrl}
                    onChange={set('authorPhotoUrl')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(form.isExternalSubmission)}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            isExternalSubmission: e.target.checked,
                          }))
                        }
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Outside submission</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Adds the note that the views are the author&apos;s own, not
                          an MAI position.
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', ml: 0 }}
                  />
                </Stack>
              </Foldaway>

              <Foldaway label="Cover image" hint={form.coverImageUrl ? 'Set' : 'None'}>
                <TextField
                  fullWidth
                  size="small"
                  label="Image URL"
                  helperText="Optional. Shown on the newsroom card and at the top of the article. Without one, a designed tile is used."
                  value={form.coverImageUrl}
                  onChange={set('coverImageUrl')}
                  sx={{ mt: 1 }}
                />
              </Foldaway>
            </>
          )}

          {/* The two fields that can break existing links are the two nobody
              needs most of the time, so they sit behind a disclosure rather
              than in easy reach. */}
          {!isNew && (
            <Foldaway label="Advanced">
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="URL slug"
                  helperText={`${typeMeta.basePath}/${form.slug || '...'} — changing this breaks every link already shared.`}
                  value={form.slug}
                  onChange={set('slug')}
                />
                <Divider />
                <TextField
                  fullWidth
                  size="small"
                  type="datetime-local"
                  label="Publication date"
                  helperText="Set once when first published. Change it only to correct the record."
                  InputLabelProps={{ shrink: true }}
                  value={form.publishedAt}
                  onChange={set('publishedAt')}
                />
              </Stack>
            </Foldaway>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostEditor;
