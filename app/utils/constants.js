const WIDTH = {
  action: 60,
  boolean: 80,
  short: 120,
  medium: 180,
  long: 240,
};

const STATES = {
  CHOSEN: 'CHOSEN',
  UNAVAILABLE: 'UNAVAILABLE',
  DEFAULT: 'DEFAULT',
};

const COLUMNS = [
  { header: 'Actions', width: WIDTH.action },
  { header: 'Full Name', width: WIDTH.long, name: 'name' },
  { header: 'Email', width: WIDTH.long, name: 'email' },
  { header: 'Participated in a focus group', width: WIDTH.boolean, name: 'participatedInFocusGroup' },
  { header: 'What kind', width: WIDTH.short, name: 'focusGroupKind' },
  { header: 'Participated in a jury research project', width: WIDTH.boolean, name: 'participatedInJuryProject' },
  { header: 'Availability', width: WIDTH.medium, name: 'availability' },
  { header: 'Hear well', width: WIDTH.boolean, name: 'hear' },
  { header: 'Read and write', width: WIDTH.boolean, name: 'readWrite' },
  { header: 'See well enough', width: WIDTH.boolean, name: 'see' },
  { header: 'Mobile phone', width: WIDTH.boolean, name: 'mobile' },
  { header: 'Jury duty', width: WIDTH.boolean, name: 'juryDuty' },
  { header: 'Civil lawsuit', width: WIDTH.boolean, name: 'civilLawsuit' },
  { header: 'Zip code', width: WIDTH.short, name: 'zipCode' },
  { header: 'Registered voter', width: WIDTH.boolean, name: 'voter' },
  { header: 'California driver\'s license', width: WIDTH.boolean, name: 'californiaDL' },
  /* START demographic metrics */
  { header: 'Education', width: WIDTH.long, name: 'education' },
  { header: 'Age', width: WIDTH.short, name: 'age' },
  { header: 'Ethnicity', width: WIDTH.medium, name: 'ethnicity' },
  { header: 'Gender', width: WIDTH.boolean, name: 'gender' },
  { header: 'Married', width: WIDTH.boolean, name: 'married' },
  { header: 'Income', width: WIDTH.medium, name: 'income' },
  { header: 'Children', width: WIDTH.boolean, name: 'children' },
  { header: 'Employed', width: WIDTH.short, name: 'employed' },
  /* END demographic metrics */
  { header: 'Occupation', width: WIDTH.medium, name: 'occupation' },
  { header: 'Know anyone who works in the news', width: WIDTH.boolean, name: 'news' },
  { header: 'Political issues', width: WIDTH.boolean, name: 'political' },
  { header: 'Economic issues', width: WIDTH.boolean, name: 'economic' },
  { header: 'Social issues', width: WIDTH.boolean, name: 'social' },
  { header: 'There are too many lawsuits', width: WIDTH.boolean, name: 'lawsuits' },
  { header: 'Jury awards are too large', width: WIDTH.boolean, name: 'juryAwards' },
  { header: 'Lawsuits cost us all too much', width: WIDTH.boolean, name: 'lawsuitsCostly' },
];

export default {
  STATES,
  WIDTH,
  COLUMNS,
};
