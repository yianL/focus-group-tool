const WIDTH = {
  action: 80,
  boolean: 100,
  short: 140,
  medium: 200,
  long: 260,
};

const STATES = {
  CHOSEN: 'CHOSEN',
  UNAVAILABLE: 'UNAVAILABLE',
  DEFAULT: 'DEFAULT',
};

const DEMOGRAPHIC_METRICS = {
  education: {
    style: { backgroundColor: '#dff0d8' },
    columns: [
      { name: 'education', value: 'Less than 9th grade', label: '< 9th' },
      { name: 'education', value: '9th to 12 grade, no diploma', label: '9-12' },
      { name: 'education', value: 'High school graduate (includes equivalency)', label: 'HS' },
      { name: 'education', value: 'Some college, no degree', label: 'Col' },
      { name: 'education', value: 'Associate\'s degree', label: 'AS' },
      { name: 'education', value: 'Bachelor\'s degree', label: 'BS' },
      { name: 'education', value: 'Graduate or professional degree', label: 'Grad' },
    ]
  },
  age: {
    style: { backgroundColor: '#d9edf7' },
    columns: [
      { name: 'age', value: '18-29', label: '18-29' },
      { name: 'age', value: '30-39', label: '30-39' },
      { name: 'age', value: '40-49', label: '40-49' },
      { name: 'age', value: '50-59', label: '50-59' },
      { name: 'age', value: '60-69', label: '60-69' },
      { name: 'age', value: '70-79', label: '70-79' },
      { name: 'age', value: '80 years and over', label: '80+' },
    ]
  },
  ethnicity: {
    style: { backgroundColor: '#fcf8e3' },
    columns: [
      { name: 'ethnicity', value: 'Black or African American', label: 'Bl' },
      { name: 'ethnicity', value: 'American Indian or Alaska Native', label: 'Am' },
      { name: 'ethnicity', value: 'Asian', label: 'As' },
      { name: 'ethnicity', value: 'Native Hawaiian and Other Pacific Islander', label: 'Pa' },
      { name: 'ethnicity', value: 'White (not Hispanic or Latino)', label: 'Wh' },
      { name: 'ethnicity', value: 'Hispanic or Latino', label: 'Hi' },
      { name: 'ethnicity', value: 'Some other race', label: 'Other' },
    ]
  },
  gender: {
    style: { backgroundColor: '#f2dede' },
    columns: [
      { name: 'gender', value: 'Male', label: 'M' },
      { name: 'gender', value: 'Female', label: 'F' },
    ]
  },
  married: {
    style: { backgroundColor: '#d0e9c6' },
    columns: [
    { name: 'married', value: 'Yes', label: 'Y' },
    { name: 'married', value: 'No', label: 'N' },
    ]
  },
  income: {
    style: { backgroundColor: '#bcdff1' },
    columns: [
      { name: 'income', value: 'Less than $35,000 per year', label: '< 35K' },
      { name: 'income', value: '$35,000 to $75,000 per year', label: '35-75K' },
      { name: 'income', value: '$75,000 to $100,000 per year', label: '75-100K' },
      { name: 'income', value: '$100,000 to $150,000 per year', label: '100-150K' },
      { name: 'income', value: '$150,000 to $200,000 per year', label: '150-200K' },
      { name: 'income', value: 'More than $200,000 per year', label: '200K+' },
    ]
  },
  children: {
    style: { backgroundColor: '#faf2cc' },
    columns: [
      { name: 'children', value: 'Yes', label: 'Y' },
      { name: 'children', value: 'No', label: 'N' },
    ]
  },
  employed: {
    style: { backgroundColor: '#ebcccc' },
    columns: [
      { name: 'employed', value: 'Yes - full time', label: 'Full' },
      { name: 'employed', value: 'Yes - part time', label: 'Part' },
      { name: 'employed', value: 'No', label: 'No' },
    ]
  },
};

const COLUMNS = [
  {
    header: 'Actions',
    width: WIDTH.action,
  },
  {
    header: 'ID',
    width: WIDTH.action,
    name: 'id',
  },
  {
    header: 'Full Name',
    width: WIDTH.long,
    name: 'name',
    search: true,
  },
  {
    header: 'Email',
    width: WIDTH.long,
    name: 'email',
    search: true,
  },
  {
    header: 'Participated in a focus group',
    width: WIDTH.boolean,
    name: 'participatedInFocusGroup',
    filter: 'BOOLEAN',
  },
  {
    header: 'What kind',
    width: WIDTH.short,
    name: 'focusGroupKind',
    search: true,
  },
  {
    header: 'Hear well',
    width: WIDTH.boolean,
    name: 'hear',
    filter: 'BOOLEAN',
  },
  {
    header: 'Read and write',
    width: WIDTH.boolean,
    name: 'readWrite',
    filter: 'BOOLEAN',
  },
  {
    header: 'See well enough',
    width: WIDTH.boolean,
    name: 'see',
    filter: 'BOOLEAN',
  },
  {
    header: 'Mobile phone',
    width: WIDTH.boolean,
    name: 'mobile',
    filter: 'BOOLEAN',
  },
  {
    header: 'Jury duty',
    width: WIDTH.boolean,
    name: 'juryDuty',
    filter: 'BOOLEAN',
  },
  {
    header: 'Civil lawsuit',
    width: WIDTH.boolean,
    name: 'civilLawsuit',
    filter: 'BOOLEAN',
  },
  {
    header: 'Zip code',
    width: WIDTH.short,
    name: 'zipCode',
    search: true,
  },
  {
    header: 'Registered voter',
    width: WIDTH.boolean,
    name: 'voter',
    filter: 'BOOLEAN',
  },
  {
    header: 'California driver\'s license',
    width: WIDTH.boolean,
    name: 'californiaDL',
    filter: 'BOOLEAN',
  },
  /* START demographic metrics */
  {
    header: 'Education',
    width: WIDTH.long,
    name: 'education',
    filter: true,
  },
  {
    header: 'Participated in a jury research project',
    width: WIDTH.boolean,
    name: 'participatedInJuryProject',
    filter: 'BOOLEAN',
  },
  {
    header: 'Age',
    width: WIDTH.short,
    name: 'age',
    filter: true,
  },
  {
    header: 'Ethnicity',
    width: WIDTH.medium,
    name: 'ethnicity',
    filter: true,
  },
  {
    header: 'Gender',
    width: WIDTH.boolean,
    name: 'gender',
    filter: true,
    caseSensitive: true,
  },
  {
    header: 'Married',
    width: WIDTH.boolean,
    name: 'married',
    filter: 'BOOLEAN',
  },
  {
    header: 'Income',
    width: WIDTH.medium,
    name: 'income',
    filter: true,
  },
  {
    header: 'Children',
    width: WIDTH.boolean,
    name: 'children',
    filter: 'BOOLEAN',
  },
  {
    header: 'Employed',
    width: WIDTH.short,
    name: 'employed',
    filter: true,
  },
  /* END demographic metrics */
  {
    header: 'Occupation',
    width: WIDTH.medium,
    name: 'occupation',
    search: true,
  },
  {
    header: 'Know anyone who works in the news',
    width: WIDTH.boolean,
    name: 'news',
    filter: 'BOOLEAN',
  },
  {
    header: 'Political issues',
    width: WIDTH.boolean,
    name: 'political',
  },
  {
    header: 'Economic issues',
    width: WIDTH.boolean,
    name: 'economic',
  },
  {
    header: 'Social issues',
    width: WIDTH.boolean,
    name: 'social',
  },
  {
    header: 'There are too many lawsuits',
    width: WIDTH.boolean,
    name: 'lawsuits',
  },
  {
    header: 'Jury awards are too large',
    width: WIDTH.boolean,
    name: 'juryAwards',
  },
  {
    header: 'Lawsuits cost us all too much',
    width: WIDTH.boolean,
    name: 'lawsuitsCostly',
  },
  {
    header: 'Availability',
    width: WIDTH.medium,
    name: 'availability',
    filter: true,
  },
];

const COLUMNSBYID = COLUMNS.reduce((prev, current) => {
  prev[current.name] = current;
  return prev;
}, {});

const NAME2LABEL = COLUMNS.reduce((prev, current) => {
  prev[current.name] = current.header;
  return prev;
}, {});

export default {
  STATES,
  WIDTH,
  COLUMNS,
  COLUMNSBYID,
  NAME2LABEL,
  DEMOGRAPHIC_METRICS,
};
