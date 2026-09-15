// Single source of truth for who handles what at MAI. Shared by the contact
// page (department pills + the "Departments" directory) and the /api/contact route
// (which picks the destination inbox from `id`, never from a client-supplied
// address, so the endpoint can't be used to relay mail elsewhere).
//
// `id`         is sent by the form and used in ?department= links — keep it stable.
// `label`      is display text only, safe to reword.
// `head`       name of the person heading the department; leave '' to hide the
//              line on the contact page until it's known.
// `intro`      short blurb shown above that department's form.
// `categories` options for the form's "What is this about?" dropdown.
export const DEFAULT_DEPARTMENT_ID = 'admin';

export const DEPARTMENTS = [
  {
    id: 'admin',
    label: 'Administration',
    email: 'info@mai.ie',
    head: 'MAI Secretary',
    intro:
      'General enquiries, donations, volunteering, hall bookings and anything not covered by another department.',
    categories: [
      'Official Correspondence',
      'General Inquiry',
      'Events & Programs',
      "Women's Activities",
      'New Muslims & Dawah',
      'Donations',
      'Volunteering',
      'Feedback & Complaints',
      'Other',
    ],
  },
  {
    id: 'imam',
    label: 'Imam',
    email: 'imam@mai.ie',
    head: 'Sh. Ayman Eesa',
    intro:
      'Religious questions, marriage (nikah), funerals, counselling and shahada.',
    categories: [
      'Religious Question',
      'Funeral Consolation',
      'Personal Advice',
      'Shahada / New Muslims',
      'Prayer Times & Facilities',
      'Other',
    ],
  },
  {
    id: 'tallaght',
    label: 'Tallaght Center',
    email: 'tallaght@mai.ie',
    head: 'Safwan Abdulkader',
    intro: 'Enquiries about the MAI Muslim Center in Tallaght and Muslim Centre.',
    categories: [
      'General Inquiry',
      'Marriage (Nikah) Services',
      'Events & Programs',
      'Hall & Facility Booking',
      'Prayer Times & Facilities',
      'Sports Center & MMA Gym',
      'Feedback & Complaints',
      'Other',
    ],
  },
  {
    id: 'albayan',
    label: 'Al-Bayan School',
    email: 'albayan@mai.ie',
    head: 'Naima Manna',
    intro: 'Admissions, classes, fees and everything to do with Al-Bayan School.',
    categories: [
      'Admissions & Enrolment',
      'Classes & Timetable',
      'Fees',
      'Feedback & Complaints',
      'Other',
    ],
  },
  {
    id: 'youth',
    label: 'Youth',
    email: 'youth@mai.ie',
    head: 'Osama Aburideh',
    intro: 'Youth programmes, activities, trips and volunteering with the youth team.',
    categories: [
      'Youth Programs & Activities',
      'Sports Center & MMA Gym',
      'Al-Kahf Camp',
      'Volunteering',
      'Feedback & Complaints',
      'Other',
    ],
  },
  {
    id: 'media',
    label: 'Media',
    email: 'media@mai.ie',
    head: 'Comms Team',
    intro:
      'Press and interview requests, photography and filming, social media and website content.',
    categories: [
      'Press & Interview Request',
      'Social Media',
      'Website',
      'Other',
    ],
  },
];

export const getDepartment = (id) =>
  DEPARTMENTS.find((department) => department.id === id) || null;
