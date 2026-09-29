import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Box, Container, Stack, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DISCOVER_ISLAM_IRELAND } from '../data/partners';
import { ORG_NAME, ORG_SEO_NAME } from '../data/posts';

// Discover Islam.
//
// We do not run this work ourselves, and there is a charity in Dublin that
// does it properly. So this page is a signpost rather than a thin copy of
// their material: one card, their own words, and a link that makes it plain
// it is taking you to somebody else's site.
export default function DiscoverIslamPage() {
  const partner = DISCOVER_ISLAM_IRELAND;

  return (
    <>
      <Head>
        <title key="title">Discover Islam | MAI Muslim Center</title>
        <meta
          key="description"
          name="description"
          content={`Learning about Islam in Ireland: ${ORG_SEO_NAME} (${ORG_NAME}) recommends Discover Islam Ireland, a registered charity running exhibitions, school visits and information booths.`}
        />
      </Head>

      <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh' }}>
        <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography variant="h2" component="h1" sx={{ mb: 1.5 }}>
              Discover Islam
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: '58ch' }}
            >
              Whether you are curious, researching, or thinking about Islam for
              yourself, the charity below specialises in exactly this, right
              across Ireland.
            </Typography>
          </Box>

          {/* The whole card is the link. An outbound destination should be
              obvious before the click, so the domain is on the face of it and
              the card is marked as opening in a new tab. */}
          <Box
            component="a"
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${partner.name} — opens ${partner.domain} in a new tab`}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0, sm: 3 },
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: 'background.paper',
              transition: 'border-color 150ms ease, box-shadow 150ms ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.06)',
              },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            }}
          >
            {/* Their logo sits on a white tile inside a tinted panel. The file
                they publish is a JPEG, so it carries its own near-white
                background - on a tinted panel that showed up as a pale square
                around the mark. The tile turns that into something deliberate
                instead of trying to blend it away. */}
            <Box
              sx={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: '100%', sm: 200 },
                p: { xs: 3, sm: 3 },
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderBottom: { xs: '1px solid', sm: 'none' },
                borderRight: { xs: 'none', sm: '1px solid' },
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'common.white',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={120}
                  height={120}
                  style={{ width: 120, height: 'auto', display: 'block' }}
                />
              </Box>
            </Box>

            <Box sx={{ p: { xs: 3, sm: 3 }, pl: { sm: 0 }, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                {partner.standing}
              </Typography>

              <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>
                {partner.name}
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.7 }}
              >
                {partner.description}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 2.5 }}
              >
                {partner.offerings.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      fontSize: '0.8125rem',
                      color: 'text.secondary',
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Stack>

              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {partner.domain}
                </Typography>
                <OpenInNewIcon sx={{ fontSize: 15 }} />
              </Stack>
            </Box>
          </Box>

          {/* Said plainly rather than left to be inferred from the icon: they
              are not us, and we are not speaking for them. */}
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 2.5, maxWidth: '58ch' }}
          >
            Discover Islam Ireland is an independent charity, not part of {ORG_NAME}. The link above leaves this site.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
