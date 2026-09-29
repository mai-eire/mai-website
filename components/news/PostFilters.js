import React from 'react';
import { useRouter } from 'next/router';
import { Box, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import { POST_TYPES, TOPICS } from '../../data/posts';

// Filters for the newsroom.
//
// There is one newsroom page; "Statements" and "Articles" are this control
// setting ?type= on it, not separate pages. Keeping the state in the URL means
// a filtered view can be bookmarked, sent to a journalist or linked from a
// newsletter, and the back button behaves the way a reader expects.
const PostFilters = ({ activeType, activeTopic, topicOptions }) => {
  const router = useRouter();

  const go = (nextQuery) => {
    const query = { ...nextQuery };
    // `page` is meaningless once the filter changes - always restart the list.
    delete query.page;
    Object.keys(query).forEach((k) => {
      if (!query[k]) delete query[k];
    });
    router.push({ pathname: '/news', query }, undefined, { scroll: false });
  };

  return (
    <Box sx={{ mb: { xs: 3, md: 4 } }}>
      <Tabs
        value={activeType || 'ALL'}
        onChange={(_, v) => go({ type: v === 'ALL' ? null : v, topic: activeTopic })}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 44,
          '& .MuiTab-root': {
            minHeight: 44,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            px: 0,
            mr: 4,
            minWidth: 'auto',
          },
        }}
      >
        <Tab value="ALL" label="All" />
        {POST_TYPES.map((type) => (
          <Tab key={type.id} value={type.id} label={type.pluralLabel} />
        ))}
      </Tabs>

      {topicOptions.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          alignItems="center"
          sx={{ mt: 2.5 }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mr: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}
          >
            Topic
          </Typography>

          {topicOptions.map(({ id, enabled }) => {
            const selected = activeTopic === id;
            return (
              <Chip
                key={id}
                size="small"
                label={TOPICS.find((t) => t.id === id)?.label || id}
                // Nothing under the current tab carries this topic, so the chip
                // stays in place (the row keeps its shape between tabs) but
                // cannot be clicked into an empty list.
                disabled={!enabled && !selected}
                // Clicking the active topic clears it, so a filter is never a
                // one-way trip that needs the back button to undo.
                onClick={
                  enabled || selected
                    ? () => go({ type: activeType, topic: selected ? null : id })
                    : undefined
                }
                variant={selected ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 600,
                  borderRadius: 1,
                  ...(selected
                    ? { backgroundColor: 'primary.main', color: 'primary.contrastText' }
                    : { color: 'text.secondary' }),
                }}
              />
            );
          })}

          {activeTopic && (
            <Chip
              size="small"
              label="Clear"
              variant="outlined"
              onClick={() => go({ type: activeType })}
              sx={{ borderStyle: 'dashed', color: 'text.secondary' }}
            />
          )}
        </Stack>
      )}
    </Box>
  );
};

export default PostFilters;
