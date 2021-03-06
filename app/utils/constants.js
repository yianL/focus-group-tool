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
      { name: 'ethnicity', value: 'White (not Hispanic or Latino)', matchValue: 'White', label: 'Wh' },
      { name: 'ethnicity', value: 'Hispanic or Latino', label: 'Hi' },
      { name: 'ethnicity', value: 'Black or African American', label: 'Bl' },
      { name: 'ethnicity', value: 'American Indian or Alaska Native', label: 'Am' },
      { name: 'ethnicity', value: 'Asian', label: 'As' },
      { name: 'ethnicity', value: 'Native Hawaiian and Other Pacific Islander', label: 'Pa' },
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

const DEFAULT_CONSTRAINTS = {
  custom: {
    name: 'custom',
    label: '-- Custom --',
    constraints: {
      education: ['', '', '', '', '', '', ''],
      age: ['', '', '', '', '', '', ''],
      ethnicity: ['', '', '', '', '', '', ''],
      gender: ['', ''],
      married: ['', ''],
      income: ['', '', '', '', '', ''],
      children: ['', ''],
      employed: ['', '', ''],
    },
  },
  sanMateo: {
    name: 'sanMateo',
    label: 'San Mateo',
    zipCodes: ['94002', '94005', '94010', '94011', '94013', '94014', '94015', '94016', '94017', '94018', '94019', '94020', '94021', '94025', '94026', '94027', '94028', '94030', '94037', '94038', '94044', '94060', '94061', '94062', '94063', '94064', '94065', '94066', '94070', '94074', '94080', '94083', '94096', '94098', '94128', '94401', '94402', '94403', '94404', '94497'],
    constraints: {
      education: [6.6, 5.1, 16.5, 18.7, 7.5, 27.1, 18.5],
      age: [16.1, 19.3, 19.2, 18.8, 13.7, 7.6, 5.2],
      ethnicity: [40.8, 25.3, 2.5, 0.1, 26.2, 1.4, 0.4],
      gender: [49.2, 50.8],
      married: [51.9, 48.1],
      income: [17.1, 23.6, 11.9, 18.5, 10.5, 18.4],
      children: ['', 33.6],
      employed: [6.3, 75.5, 18.2],
    },
  },
  marin: {
    name: 'marin',
    label: 'Marin',
    zipCodes: ['94901', '94903', '94904', '94912', '94913', '94914', '94915', '94920', '94924', '94925', '94929', '94930', '94933', '94937', '94938', '94939', '94940', '94941', '94942', '94945', '94946', '94947', '94948', '94949', '94950', '94956', '94957', '94960', '94963', '94964', '94965', '94966', '94970', '94971', '94973', '94974', '94976', '94977', '94978', '94979', '94998'],
    constraints: {
      education: [3.8, 3.3, 11.8, 18.8, 6.5, 31.4, 24.4],
      age: [11.0, 14.1, 19.9, 20.7, 18.2, 9.8, 6.3],
      ethnicity: [42.4, 34.2, 1.5, 0.2, 18.8, 0.3, 0.2],
      gender: [48.9, 51.1],
      married: [51.8, 48.2],
      income: [19.3, 21.8, 11.1, 17.1, 10.2, 20.4],
      children: ['', 35.1],
      employed: [5.4, 76.3, 18.4],
    },
  },
  sf: {
    name: 'sf',
    label: 'San Francisco',
    zipCodes: ['94101', '94102', '94103', '94104', '94105', '94106', '94107', '94108', '94109', '94110', '94111', '94112', '94114', '94115', '94116', '94117', '94118', '94119', '94120', '94121', '94122', '94123', '94124', '94125', '94126', '94127', '94129', '94130', '94131', '94132', '94133', '94134', '94135', '94136', '94137', '94138', '94139', '94140', '94141', '94142', '94143', '94144', '94145', '94146', '94147', '94150', '94151', '94152', '94153', '94154', '94155', '94156', '94157', '94158', '94159', '94160', '94161', '94162', '94163', '94164', '94165', '94166', '94167', '94168', '94169', '94170', '94171', '94172', '94175', '94177', '94188', '94199'],
    constraints: {
      education: [8.1, 4.8, 12.7, 14.9, 5.5, 32.6, 21.2],
      age: [21.1, 22.8, 17.4, 15.0, 12.3, 6.5, 5.0],
      ethnicity: [41.2, 15.3, 5.3, 0.2, 33.5, 0.4, 0.5],
      gender: [50.9, 49.1],
      married: [38.8, 61.2],
      income: [19.3, 21.4, 10.7, 17.2, 10.8, 20.6],
      children: ['', 40.9],
      employed: [6.4, 75.5, 18.2],
    },
  },
  sonoma: {
    name: 'sonoma',
    label: 'Sonoma',
    zipCodes: ['94922', '94923', '94926', '94927', '94928', '94931', '94951', '94952', '94953', '94954', '94955', '94972', '94975', '94999', '95401', '95402', '95403', '95404', '95405', '95406', '95407', '95408', '95409', '95412', '95416', '95419', '95421', '95425', '95430', '95431', '95433', '95436', '95439', '95441', '95442', '95444', '95446', '95448', '95450', '95452', '95462', '95465', '95471', '95472', '95473', '95476', '95480', '95486', '95487', '95492', '95497'],
    constraints: {
      education: [6.7, 6.2, 19.9, 25.1, 9.2, 21.4, 11.5],
      age: [17.0, 16.2, 17.0, 19.5, 16.7, 8.1, 5.5],
      ethnicity: [64.7, 25.8, 1.4, 0.5, 3.8, 0.3, 0.3],
      gender: [48.5, 51.5],
      married: [47.2, 52.8],
      income: [25.6, 31.1, 13.4, 15.9, 7.2, 6.9],
      children: ['', 35.5],
      employed: [7.5, 74.6, 17.9],
    },
  },
  contraCosta: {
    name: 'contraCosta',
    label: 'Contra Costa',
    zipCodes: ['94506', '94507', '94509', '94511', '94513', '94514', '94516', '94517', '94518', '94519', '94520', '94521', '94522', '94523', '94524', '94525', '94526', '94527', '94528', '94529', '94530', '94531', '94547', '94548', '94549', '94553', '94556', '94561', '94563', '94564', '94565', '94569', '94570', '94572', '94575', '94582', '94583', '94595', '94596', '94597', '94598', '94801', '94802', '94803', '94804', '94805', '94806', '94807', '94808', '94820', '94850'],
    constraints: {
      education: [5.8, 5.3, 18.7, 22.4, 8.2, 25.2, 14.4],
      age: [16.3, 17.5, 19.1, 19.4, 15.4, 7.5, 4.7],
      ethnicity: [46.0, 24.9, 8.6, 0.3, 15.1, 0.5, 0.3],
      gender: [48.8, 51.2],
      married: [51.5, 48.5],
      income: [21.5, 25.6, 12.3, 18.3, 9.9, 12.4],
      children: ['', 32.0],
      employed: [8.1, 74.1, 17.8],
    },
  },
  alameda: {
    name: 'alameda',
    label: 'Alameda',
    zipCodes: ['94501', '94502', '94536', '94537', '94538', '94539', '94540', '94541', '94542', '94543', '94544', '94545', '94546', '94550', '94551', '94552', '94555', '94557', '94560', '94566', '94568', '94577', '94578', '94579', '94580', '94586', '94587', '94588', '94601', '94602', '94603', '94604', '94605', '94606', '94607', '94608', '94609', '94610', '94611', '94612', '94613', '94614', '94615', '94617', '94618', '94619', '94620', '94621', '94622', '94623', '94624', '94625', '94649', '94659', '94660', '94661', '94662', '94666', '94701', '94702', '94703', '94704', '94705', '94706', '94707', '94708', '94709', '94710', '94712', '94720'],
    constraints: {
      education: [7.2, 5.9, 18.5, 18.8, 6.7, 25.0, 18.0],
      age: [19.4, 20.1, 19.3, 18.0, 12.7, 6.3, 4.2],
      ethnicity: [33.0, 22.6, 11.3, 0.3, 27.5, 0.8, 0.3],
      gender: [49.0, 51.0],
      married: [47.8, 52.2],
      income: [24.5, 25.2, 11.9, 17.5, 9.4, 11.5],
      children: ['', 32.9],
      employed: [7.7, 74.4, 17.9],
    },
  },
  sanJoanquin: {
    name: 'sanJoanquin',
    label: 'San Joanquin',
    zipCodes: ['95201', '95202', '95203', '95204', '95205', '95206', '95207', '95208', '95209', '95210', '95211', '95212', '95213', '95215', '95219', '95220', '95227', '95230', '95231', '95234', '95236', '95237', '95240', '95241', '95242', '95253', '95258', '95267', '95269', '95296', '95297', '95304', '95320', '95330', '95336', '95337', '95366', '95376', '95377', '95378', '95385', '95391', '95686'],
    constraints: {
      education: [11.7, 10.3, 26.4, 23.9, 9.3, 12.5, 5.9],
      age: [20.6, 19.0, 18.9, 18.0, 12.5, 6.7, 4.2],
      ethnicity: [34.3, 40.1, 6.7, 0.3, 14.5, 0.5, 0.1],
      gender: [49.7, 50.3],
      married: [47.9, 52.1],
      income: [33.4, 31.6, 12.0, 13.9, 5.5, 3.5],
      children: ['', 28.6],
      employed: [12.0, 70.9, 17.1],
    },
  },
  stanislaus: {
    name: 'stanislaus',
    label: 'Stanislaus',
    zipCodes: ['95307', '95313', '95316', '95319', '95323', '95326', '95328', '95329', '95350', '95351', '95352', '95353', '95354', '95355', '95356', '95357', '95358', '95360', '95361', '95363', '95367', '95368', '95380', '95381', '95382', '95386', '95387', '95397'],
    constraints: {
      education: [12.5, 10.3, 28.3, 24.9, 7.5, 11.0, 5.5],
      age: [21.0, 18.5, 18.5, 18.0, 12.6, 6.9, 4.5],
      ethnicity: [44.7, 43.6, 2.4, 0.5, 5.2, 0.7, 0.2],
      gender: [49.5, 50.5],
      married: [47.9, 52.1],
      income: [30.5, 34.4, 12.7, 14.0, 4.7, 3.7],
      children: ['', 29.5],
      employed: [13.2, 70.0, 16.8],
    },
  },
  fresno: {
    name: 'fresno',
    label: 'Fresno',
    zipCodes: ['93210', '93234', '93242', '93602', '93605', '93606', '93607', '93608', '93609', '93611', '93612', '93613', '93616', '93619', '93621', '93622', '93624', '93625', '93626', '93627', '93628', '93630', '93631', '93634', '93640', '93641', '93642', '93646', '93648', '93649', '93650', '93651', '93652', '93654', '93656', '93657', '93660', '93662', '93664', '93667', '93668', '93675', '93701', '93702', '93703', '93704', '93705', '93706', '93707', '93708', '93709', '93710', '93711', '93712', '93714', '93715', '93716', '93717', '93718', '93720', '93721', '93722', '93723', '93724', '93725', '93726', '93727', '93728', '93729', '93730', '93740', '93741', '93744', '93745', '93747', '93750', '93755', '93760', '93761', '93764', '93765', '93771', '93772', '93773', '93774', '93775', '93776', '93777', '93778', '93779', '93780', '93784', '93786', '93790', '93791', '93792', '93793', '93794', '93844', '93888'],
    constraints: {
      education: [15.5, 11.0, 22.8, 23.4, 8.0, 13.0, 6.4],
      age: [23.8, 19.9, 17.5, 15.6, 12.1, 6.6, 4.5],
      ethnicity: [31.2, 51.6, 4.7, 0.5, 9.6, 0.1, 0.2],
      gender: [49.9, 50.1],
      married: [44.2, 55.8],
      income: [40.3, 30.9, 10.5, 11.0, 4.0, 3.2],
      children: ['', 28.9],
      employed: [11.7, 71.2, 17.1],
    },
  },
  monterey: {
    name: 'monterey',
    label: 'Monterey',
    zipCodes: ['93426', '93450', '93901', '93902', '93905', '93906', '93907', '93908', '93912', '93915', '93920', '93921', '93922', '93923', '93924', '93925', '93926', '93927', '93928', '93930', '93932', '93933', '93940', '93942', '93943', '93944', '93950', '93953', '93954', '93955', '93960', '93962', '95004', '95012', '95039'],
    constraints: {
      education: [19.3, 10.0, 20.8, 19.0, 7.8, 14.2, 8.9],
      age: [21.7, 20.0, 17.7, 16.9, 12.6, 6.2, 4.8],
      ethnicity: [31.5, 56.9, 2.6, 0.3, 5.9, 0.5, 0.1],
      gender: [44.7, 55.3],
      married: [46.3, 53.7],
      income: [28.0, 33.3, 12.9, 14.2, 5.9, 5.5],
      children: ['', 29.8],
      employed: [7.7, 74.4, 17.9],
    },
  },
  santaCruz: {
    name: 'santaCruz',
    label: 'Santa Cruz',
    zipCodes: ['95001', '95003', '95005', '95006', '95007', '95010', '95017', '95018', '95019', '95033', '95041', '95060', '95061', '95062', '95063', '95064', '95065', '95066', '95067', '95073', '95076', '95077'],
    constraints: {
      education: [9.0, 5.4, 15.5, 22.7, 9.2, 23.2, 15.0],
      age: [21.8, 15.9, 17.0, 19.2, 15.5, 6.3, 4.4],
      ethnicity: [58.3, 32.9, 0.9, 0.2, 4.2, 0.2, 0.2],
      gender: [49.7, 50.3],
      married: [44.9, 55.1],
      income: [18.6, 27.7, 12.7, 19.3, 10.2, 11.6],
      children: ['', 35.4],
      employed: [7.1, 74.9, 18.0],
    },
  },
  sanDiego: {
    name: 'sanDiego',
    label: 'San Diego',
    zipCodes: ['91901', '91902', '91903', '91905', '91906', '91908', '91909', '91910', '91911', '91912', '91913', '91914', '91915', '91916', '91917', '91921', '91931', '91932', '91933', '91934', '91935', '91941', '91942', '91943', '91944', '91945', '91946', '91947', '91948', '91950', '91951', '91962', '91963', '91976', '91977', '91978', '91979', '91980', '91987', '91990', '92003', '92004', '92007', '92008', '92009', '92010', '92011', '92013', '92014', '92018', '92019', '92020', '92021', '92022', '92023', '92024', '92025', '92026', '92027', '92028', '92029', '92030', '92033', '92036', '92037', '92038', '92039', '92040', '92046', '92049', '92051', '92052', '92054', '92055', '92056', '92057', '92059', '92060', '92061', '92064', '92065', '92066', '92067', '92068', '92069', '92070', '92071', '92072', '92074', '92075', '92078', '92079', '92081', '92082', '92083', '92084', '92085', '92086', '92088', '92090', '92091', '92092', '92093', '92096', '92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108', '92109', '92110', '92111', '92112', '92113', '92114', '92115', '92116', '92117', '92118', '92119', '92120', '92121', '92122', '92123', '92124', '92126', '92127', '92128', '92129', '92130', '92131', '92132', '92133', '92134', '92135', '92136', '92137', '92138', '92139', '92140', '92142', '92143', '92145', '92147', '92149', '92150', '92152', '92153', '92154', '92155', '92158', '92159', '92160', '92161', '92162', '92163', '92164', '92165', '92166', '92167', '92168', '92169', '92170', '92171', '92172', '92173', '92174', '92175', '92176', '92177', '92178', '92179', '92182', '92184', '92186', '92187', '92190', '92191', '92192', '92193', '92194', '92195', '92196', '92197', '92198', '92199'],
    constraints: {
      education: [7.2, 6.8, 19.0, 22.4, 8.9, 22.1, 13.6],
      age: [22.6, 19.0, 17.8, 17.1, 12.4, 6.5, 4.7],
      ethnicity: [47.0, 32.9, 4.7, 0.4, 11.2, 0.4, 0.2],
      gender: [50.2, 49.8],
      married: [47.2, 52.8],
      income: [27.3, 29.2, 12.9, 15.9, 7.3, 7.4],
      children: ['', 33.2],
      employed: [8.0, 74.1, 17.8],
    },
  },
  mendocino: {
    name: 'mendocino',
    label: 'Mendocino',
    zipCodes: ['95410', '95415', '95417', '95418', '95420', '95427', '95428', '95429', '95432', '95437', '95445', '95449', '95454', '95456', '95459', '95460', '95463', '95466', '95468', '95469', '95470', '95481', '95482', '95488', '95490', '95494', '95585', '95587'],
    constraints: {
      education: [6.1, 7.1, 26.5, 28.9, 7.7, 15.7, 7.9],
      age: [14.6, 15.6, 15.3, 19.5, 20.1, 9.2, 5.7],
      ethnicity: [66.7, 23.6, 0.6, 3.4, 1.9, 0.2, 0.4],
      gender: [50.1, 49.9],
      married: [45.1, 54.9],
      income: [43.3, 31.3, 10.1, 10.4, 2.6, 2.3],
      children: ['', 36.6],
      employed: [10.9, 71.8, 17.3],
    },
  },
  orange: {
    name: 'orange',
    label: 'Orange',
    zipCodes: ['90620', '90621', '90622', '90623', '90624', '90630', '90631', '90632', '90633', '90680', '90720', '90721', '90740', '90742', '90743', '92602', '92603', '92604', '92605', '92606', '92607', '92609', '92610', '92612', '92614', '92615', '92616', '92617', '92618', '92619', '92620', '92623', '92624', '92625', '92626', '92627', '92628', '92629', '92630', '92637', '92646', '92647', '92648', '92649', '92650', '92651', '92652', '92653', '92654', '92655', '92656', '92657', '92658', '92659', '92660', '92661', '92662', '92663', '92672', '92673', '92674', '92675', '92676', '92677', '92678', '92679', '92683', '92684', '92685', '92688', '92690', '92691', '92692', '92693', '92694', '92697', '92698', '92701', '92702', '92703', '92704', '92705', '92706', '92707', '92708', '92709', '92710', '92711', '92712', '92725', '92728', '92735', '92780', '92781', '92782', '92799', '92801', '92802', '92803', '92804', '92805', '92806', '92807', '92808', '92809', '92811', '92812', '92814', '92815', '92816', '92817', '92821', '92822', '92823', '92825', '92831', '92832', '92833', '92834', '92835', '92836', '92837', '92838', '92840', '92841', '92842', '92843', '92844', '92845', '92846', '92850', '92856', '92857', '92859', '92861', '92862', '92863', '92864', '92865', '92866', '92867', '92868', '92869', '92870', '92871', '92885', '92886', '92887', '92899'],
    constraints: {
      education: [8.8, 6.9, 17.7, 21.0, 7.8, 24.4, 13.3],
      age: [19.6, 17.9, 19.7, 18.5, 12.6, 7.0, 4.7],
      ethnicity: [42.4, 34.2, 1.5, 0.2, 18.8, 0.3, 0.2],
      gender: [49.4, 50.6],
      married: [50.1, 49.9],
      income: [22.5, 26.6, 13.0, 17.7, 9.2, 11.1],
      children: ['', 31.9],
      employed: [7.1, 74.9, 18.0],
    },
  },
  la: {
    name: 'la',
    label: 'LA',
    zipCodes: ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010', '90011', '90012', '90013', '90014', '90015', '90016', '90017', '90018', '90019', '90020', '90021', '90022', '90023', '90024', '90025', '90026', '90027', '90028', '90029', '90030', '90031', '90032', '90033', '90034', '90035', '90036', '90037', '90038', '90039', '90040', '90041', '90042', '90043', '90044', '90045', '90046', '90047', '90048', '90049', '90050', '90051', '90052', '90053', '90054', '90055', '90056', '90057', '90058', '90059', '90060', '90061', '90062', '90063', '90064', '90065', '90066', '90067', '90068', '90069', '90070', '90071', '90072', '90073', '90074', '90075', '90076', '90077', '90078', '90079', '90080', '90081', '90082', '90083', '90084', '90086', '90087', '90088', '90089', '90091', '90093', '90094', '90095', '90096', '90099', '90101', '90102', '90103', '90189', '90201', '90202', '90209', '90210', '90211', '90212', '90213', '90220', '90221', '90222', '90223', '90224', '90230', '90231', '90232', '90233', '90239', '90240', '90241', '90242', '90245', '90247', '90248', '90249', '90250', '90251', '90254', '90255', '90260', '90261', '90262', '90263', '90264', '90265', '90266', '90267', '90270', '90272', '90274', '90275', '90277', '90278', '90280', '90290', '90291', '90292', '90293', '90294', '90295', '90296', '90301', '90302', '90303', '90304', '90305', '90306', '90307', '90308', '90309', '90310', '90311', '90312', '90313', '90397', '90398', '90401', '90402', '90403', '90404', '90405', '90406', '90407', '90408', '90409', '90410', '90411', '90501', '90502', '90503', '90504', '90505', '90506', '90507', '90508', '90509', '90510', '90601', '90602', '90603', '90604', '90605', '90606', '90607', '90608', '90609', '90610', '90612', '90637', '90638', '90639', '90640', '90650', '90651', '90652', '90659', '90660', '90661', '90662', '90670', '90671', '90701', '90702', '90703', '90704', '90706', '90707', '90710', '90711', '90712', '90713', '90714', '90715', '90716', '90717', '90723', '90731', '90732', '90733', '90734', '90744', '90745', '90746', '90747', '90748', '90749', '90755', '90801', '90802', '90803', '90804', '90805', '90806', '90807', '90808', '90809', '90810', '90813', '90814', '90815', '90822', '90831', '90832', '90833', '90834', '90835', '90840', '90842', '90844', '90845', '90846', '90847', '90848', '90853', '90888', '90895', '90899', '91001', '91003', '91006', '91007', '91009', '91010', '91011', '91012', '91016', '91017', '91020', '91021', '91023', '91024', '91025', '91030', '91031', '91040', '91041', '91042', '91043', '91046', '91066', '91077', '91101', '91102', '91103', '91104', '91105', '91106', '91107', '91108', '91109', '91110', '91114', '91115', '91116', '91117', '91118', '91121', '91123', '91124', '91125', '91126', '91129', '91131', '91182', '91184', '91185', '91188', '91189', '91191', '91199', '91201', '91202', '91203', '91204', '91205', '91206', '91207', '91208', '91209', '91210', '91214', '91221', '91222', '91224', '91225', '91226', '91301', '91302', '91303', '91304', '91305', '91306', '91307', '91308', '91309', '91310', '91311', '91313', '91316', '91321', '91322', '91324', '91325', '91326', '91327', '91328', '91329', '91330', '91331', '91333', '91334', '91335', '91337', '91340', '91341', '91342', '91343', '91344', '91345', '91346', '91350', '91351', '91352', '91353', '91354', '91355', '91356', '91357', '91363', '91364', '91365', '91367', '91371', '91372', '91376', '91380', '91381', '91382', '91383', '91384', '91385', '91386', '91387', '91388', '91390', '91392', '91393', '91394', '91395', '91396', '91399', '91401', '91402', '91403', '91404', '91405', '91406', '91407', '91408', '91409', '91410', '91411', '91412', '91413', '91416', '91423', '91426', '91436', '91470', '91482', '91495', '91496', '91497', '91499', '91501', '91502', '91503', '91504', '91505', '91506', '91507', '91508', '91510', '91521', '91522', '91523', '91526', '91601', '91602', '91603', '91604', '91605', '91606', '91607', '91608', '91609', '91610', '91611', '91612', '91614', '91615', '91616', '91617', '91618', '91702', '91706', '91711', '91714', '91715', '91716', '91722', '91723', '91724', '91731', '91732', '91733', '91734', '91735', '91740', '91741', '91744', '91745', '91746', '91747', '91748', '91749', '91750', '91754', '91755', '91756', '91759', '91765', '91766', '91767', '91768', '91769', '91770', '91771', '91772', '91773', '91775', '91776', '91778', '91780', '91788', '91789', '91790', '91791', '91792', '91793', '91795', '91797', '91799', '91801', '91802', '91803', '91804', '91841', '91896', '91899', '93510', '93532', '93534', '93535', '93536', '93539', '93543', '93544', '93550', '93551', '93552', '93553', '93563', '93584', '93586', '93590', '93591', '93599'],
    constraints: {
      education: [13.3, 9.4, 20.7, 19.5, 6.9, 19.8, 10.5],
      age: [21.2, 19.4, 19.2, 17.5, 11.9, 6.4, 4.5],
      ethnicity: [26.9, 48.2, 8.0, 0.2, 14.0, 0.2, 0.3],
      gender: [49.3, 50.7],
      married: [42.4, 57.6],
      income: [32.6, 29.1, 11.6, 13.6, 6.0, 7.0],
      children: ['', 32.5],
      employed: [9.1, 73.3, 17.6],
    },
  },
  santaClara: {
    name: 'santaClara',
    label: 'Santa Clara',
    zipCodes: ['94022', '94023', '94024', '94035', '94039', '94040', '94041', '94042', '94043', '94085', '94086', '94087', '94088', '94089', '94301', '94302', '94303', '94304', '94305', '94306', '94309', '95002', '95008', '95009', '95011', '95013', '95014', '95015', '95020', '95021', '95026', '95030', '95031', '95032', '95035', '95036', '95037', '95038', '95042', '95044', '95046', '95050', '95051', '95052', '95053', '95054', '95055', '95056', '95070', '95071', '95101', '95103', '95106', '95108', '95109', '95110', '95111', '95112', '95113', '95115', '95116', '95117', '95118', '95119', '95120', '95121', '95122', '95123', '95124', '95125', '95126', '95127', '95128', '95129', '95130', '95131', '95132', '95133', '95134', '95135', '95136', '95138', '95139', '95140', '95141', '95148', '95150', '95151', '95152', '95153', '95154', '95155', '95156', '95157', '95158', '95159', '95160', '95161', '95164', '95170', '95172', '95173', '95190', '95191', '95192', '95193', '95194', '95196'],
    constraints: {
      education: [7.1, 5.9, 15.2, 16.7, 7.1, 26.1, 21.9],
      age: [7.1, 5.9, 15.2, 16.7, 7.1, 26.1, 21.9],
      ethnicity: [33.6, 26.6, 2.4, 0.2, 33.5, 0.3, 0.2],
      gender: [50.3, 49.7],
      married: [53.2, 46.8],
      income: [18.5, 21.5, 11.5, 18.5, 11.7, 18.2],
      children: ['', 30.9],
      employed: [7.1, 74.8, 18.0],
    },
  },
  sacramento: {
    name: 'sacramento',
    label: 'Sacramento',
    zipCodes: ['94203', '94204', '94205', '94206', '94207', '94208', '94209', '94211', '94229', '94230', '94232', '94234', '94235', '94236', '94237', '94239', '94240', '94244', '94245', '94246', '94247', '94248', '94249', '94250', '94252', '94254', '94256', '94257', '94258', '94259', '94261', '94262', '94263', '94267', '94268', '94269', '94271', '94273', '94274', '94277', '94278', '94279', '94280', '94282', '94283', '94284', '94285', '94286', '94287', '94288', '94289', '94290', '94291', '94293', '94294', '94295', '94296', '94297', '94298', '94299', '95608', '95609', '95610', '95611', '95615', '95621', '95624', '95626', '95628', '95630', '95632', '95638', '95639', '95641', '95652', '95655', '95660', '95662', '95670', '95671', '95673', '95680', '95683', '95690', '95693', '95741', '95742', '95757', '95758', '95759', '95763', '95812', '95813', '95814', '95815', '95816', '95817', '95818', '95819', '95820', '95821', '95822', '95823', '95824', '95825', '95826', '95827', '95828', '95829', '95830', '95831', '95832', '95833', '95834', '95835', '95836', '95837', '95838', '95840', '95841', '95842', '95843', '95851', '95852', '95853', '95860', '95864', '95865', '95866', '95867', '95887', '95894', '95899'],
    constraints: {
      education: [6.7, 6.7, 22.3, 25.9, 9.7, 19.1, 9.7],
      age: [20.5, 19.0, 18.1, 18.3, 12.9, 6.7, 4.5],
      ethnicity: [46.8, 22.3, 9.6, 0.4, 14.8, 1.0, 0.3],
      gender: [48.9, 51.1],
      married: [45.0, 55.0],
      income: [31.9, 31.0, 12.6, 14.1, 5.9, 4.3],
      children: ['', 32.7],
      employed: [10.6, 72.1, 17.4],
    },
  },
  kern: {
    name: 'kern',
    label: 'Kern',
    zipCodes: ['93203', '93205', '93206', '93215', '93216', '93220', '93222', '93224', '93225', '93226', '93238', '93240', '93241', '93243', '93249', '93250', '93251', '93252', '93255', '93263', '93268', '93276', '93280', '93283', '93285', '93287', '93301', '93302', '93303', '93304', '93305', '93306', '93307', '93308', '93309', '93311', '93312', '93313', '93314', '93380', '93381', '93382', '93383', '93384', '93385', '93386', '93387', '93388', '93389', '93390', '93501', '93502', '93504', '93505', '93516', '93518', '93519', '93523', '93524', '93527', '93528', '93531', '93554', '93555', '93556', '93560', '93561', '93581', '93596'],
    constraints: {
      education: [14.3, 12.2, 27.3, 23.6, 7.2, 10.3, 5.1],
      age: [23.6, 20.3, 18.1, 17.2, 11.6, 6.2, 3.1],
      ethnicity: [36.6, 51.0, 5.3, 0.6, 4.4, 0.1, 0.1],
      gender: [51.3, 48.7],
      married: [46.5, 53.5],
      income: [37.3, 31.2, 11.7, 11.9, 4.7, 3.2],
      children: ['', 27.8],
      employed: [11.3, 71.5, 17.2],
    },
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
    multipleChoice: true,
  },
];

const COLUMNSBYID = COLUMNS.reduce((prev, current, index) => {
  prev[current.name] = {
    ...current,
    index,
  };
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
  DEFAULT_CONSTRAINTS,
  DEMOGRAPHIC_METRICS,
};
