// Fills the local database with a few example posts so the newsroom pages can
// be seen with real content in them.
//
//   npm run seed:newsroom
//
// Development only - it writes to the LOCAL D1 database and refuses --remote.
// Every seeded post is tagged with SEED_MARKER in createdBy, and re-running the
// script replaces exactly those rows, so it can never touch anything a real
// editor wrote.

const { lit, execute, wantsRemote, newId } = require('./d1');

const SEED_MARKER = 'seed@local';

const posts = [
  {
    type: 'STATEMENT',
    title: 'MAI condemns the attack on a worshipper in Tallaght',
    slug: 'statement-attack-tallaght-worshipper',
    summary:
      'MAI condemns the assault on a member of our community outside the Tallaght Muslim Centre and calls for a full Garda investigation.',
    issuedBy: 'MAI Executive Committee',
    referenceCode: 'MAI-2026-014',
    topics: ',islamophobia,community,',
    body: `MAI condemns in the strongest terms the assault on a worshipper outside the Tallaght Muslim Centre on the evening of Friday 12 September.

## What happened

A member of our community was attacked while leaving the centre after Isha prayer. He was treated in hospital and has since been discharged. Our thoughts and prayers are with him and his family.

## Our position

An attack on a person leaving a place of worship is an attack on the freedom of everyone in this country to practise their faith without fear. We have reported the incident to An Garda Siochana and we ask that it be investigated as a hate-motivated crime.

We call on:

- **An Garda Siochana** to investigate fully and to keep the community informed of progress.
- **Public representatives** to speak clearly against the rising hostility Muslims in Ireland are experiencing.
- **Our own community** to report every incident, however minor it may seem. Incidents that go unreported do not appear in any statistic, and what is not counted is not addressed.

## Support for our community

The centre remains open as usual. Anyone who feels unsafe travelling to or from prayer should contact the centre office, and anyone affected by this incident can speak with our Imam in confidence.

We are grateful to our neighbours of all faiths and none who have contacted us in support over the past days.`,
  },
  {
    type: 'STATEMENT',
    title: 'On the announcement of Eid al-Fitr 1447',
    slug: 'statement-eid-al-fitr-1447',
    summary:
      'Eid al-Fitr will be observed on Tuesday 21 March. Prayer times and arrangements for all MAI centres are set out below.',
    issuedBy: 'MAI Executive Committee',
    referenceCode: 'MAI-2026-006',
    topics: ',ramadan-eid,mosque-news,',
    body: `Following the sighting of the new moon, MAI confirms that **Eid al-Fitr 1447 will be observed on Tuesday 21 March**.

## Prayer arrangements

Eid prayer will be held at the Tallaght Muslim Centre in two sittings:

| Sitting | Time |
| --- | --- |
| First | 7:30am |
| Second | 9:00am |

Please arrive early, bring a prayer mat where possible, and follow the directions of our volunteers in the car park.

## A note to the community

Ramadan asked a great deal of us this year, and our community gave generously in time, in charity and in patience with one another. We ask Allah to accept it from all of us.

We extend our warmest wishes to every Muslim family in Ireland, and our thanks to the neighbours, schools and local representatives who marked the month with us.

Eid Mubarak.`,
  },
  {
    type: 'ARTICLE',
    title: 'Raising children who are at home in two worlds',
    slug: 'raising-children-two-worlds',
    summary:
      'Our children are growing up Irish and Muslim at once. Treating that as a problem to be solved rather than a gift to be shaped is where many of us go wrong.',
    authorName: 'Aisha Kelly',
    authorTitle: 'Teacher, Al-Bayan School',
    isExternalSubmission: false,
    topics: ',youth,education,community,',
    body: `My daughter came home from school last spring having been asked, for the third time that term, to explain to her class what Ramadan is. She did it patiently. Then she asked me, at dinner, whether she was going to have to keep explaining herself for the rest of her life.

I did not have a good answer that evening. I have been thinking about it since.

## The question behind the question

What she was really asking is one that almost every Muslim child born in Ireland asks in some form: *where do I actually belong?* We tend to hear that as a warning sign. We rush to reassure. We tell them they are fully Irish and fully Muslim, and we move the conversation along, because the alternative frightens us.

But the discomfort in the question is not a symptom of something going wrong. It is the ordinary work of growing up with more than one inheritance.

## What helps

Three things have made a difference in our house, and in the classrooms I teach in:

1. **Name both inheritances out loud, often.** Children who only ever hear their faith discussed defensively learn to experience it as a burden.
2. **Let them see adults who hold both comfortably.** A Muslim doctor, a Muslim footballer, a Muslim county councillor - not as talking points, but as people at the dinner table.
3. **Do not outsource it entirely to the weekend school.** Two hours on a Saturday cannot carry what happens the other hundred and sixty-six.

## The part we get wrong

The mistake I made for years was treating my daughter's two worlds as a tension to be managed. She does not experience them that way. She experiences them as simply what she is, and she only learns to see a contradiction when the adults around her keep pointing at one.

She is not caught between two worlds. She is at home in both. Our job is mostly to stop telling her otherwise.`,
  },
  {
    type: 'ARTICLE',
    title: 'What the Occupied Territories Bill asks of Irish civil society',
    slug: 'occupied-territories-bill-civil-society',
    summary:
      'A guest contributor argues that the debate over the Bill is a test of whether Ireland applies its stated principles consistently.',
    authorName: 'Dr Omar Hassan',
    authorTitle: 'Lecturer in International Law',
    isExternalSubmission: true,
    topics: ',palestine,government-policy,',
    body: `Ireland has long described itself as a country that understands occupation from the inside. That self-description is about to be tested in a way it has not been for some time.

## The principle at stake

The argument over the Bill is often framed as a question of trade policy or of EU competence. Those are real questions and they deserve serious answers. But underneath them sits a simpler one: does a state that says settlements are illegal under international law then trade with those settlements as though they were not?

A principle applied only when it is cheap is not a principle. It is a preference.

## What civil society can actually do

Parliamentary arithmetic is not the only thing that moves legislation. What moves it, reliably, is sustained and specific pressure from people who are visibly not a single-issue constituency:

- Trade unions and professional bodies stating a position in their own names.
- Faith communities - all of them, not only ours - speaking jointly rather than separately.
- Constituents writing to TDs about this one Bill, by name, repeatedly.

## A word on tone

Those of us who are Muslim have a particular reason to be careful here. The case for the Bill is a case in Irish law and Irish foreign policy, made to Irish legislators. It is strongest when it is made in exactly those terms, and it is weakest when it can be dismissed as the concern of one community alone.

That is not a call to be quieter. It is a call to be harder to dismiss.`,
  },
];

(async () => {
  if (wantsRemote(process.argv)) {
    console.error('Refusing to seed the remote database. This script is for local content only.');
    process.exit(1);
  }

  const now = Date.now();
  const columns = [
    'id', 'type', 'title', 'slug', 'summary', 'body', 'status', 'publishedAt',
    'topics', 'issuedBy', 'referenceCode', 'authorName', 'authorTitle',
    'isExternalSubmission', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy',
  ];

  const rows = posts.map((post, i) => {
    // Space the dates a week apart so the newest-first ordering is visible.
    const publishedAt = now - i * 7 * 24 * 60 * 60 * 1000;
    const values = [
      newId(), post.type, post.title, post.slug, post.summary, post.body,
      'PUBLISHED', publishedAt, post.topics || '', post.issuedBy ?? null,
      post.referenceCode ?? null, post.authorName ?? null, post.authorTitle ?? null,
      post.isExternalSubmission ?? false, now, now, SEED_MARKER, SEED_MARKER,
    ];
    return `INSERT INTO "Post" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${values.map(lit).join(', ')});`;
  });

  // Every seeded post is tagged with SEED_MARKER in createdBy and re-running
  // replaces exactly those rows, so this can never touch anything a real editor
  // wrote - including a post that happens to share a slug's worth of bad luck.
  execute([`DELETE FROM "Post" WHERE createdBy = ${lit(SEED_MARKER)};`, ...rows]);

  console.log('');
  console.log('Seeded ' + posts.length + ' example posts. Visit /news');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
