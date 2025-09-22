export interface InvestorRegistration {
  brokerName: string;
  requestType: string;
  numberOfInvestors?: number;
  investors?: Array<{
    passportNumber: string;
    address: string;
    countryOfResidence: string;
    investorId: string;
    briefExplanation: string;
    balance: string;
    firstDeposit: string;
    clientCategory: 'retail' | 'professional';
    fullName: string;
    email: string;
    phone: string;
  }>;
  verification?: {
    documentType: 'emirates_id' | 'passport';
    documentNumber: string;
  };
}

export interface Broker {
  id: string;
  name: string;
  regulator: 'SINRAC' | 'CEC';
}

export interface RequestType {
  id: string;
  name: string;
  description: string;
  requiresClientCategory: boolean;
}

export const BROKERS: Broker[] = [
  { id: 'ib', name: 'Interactive Brokers', regulator: 'SINRAC' },
  { id: 'emirates_nbd', name: 'Emirates NBD Securities', regulator: 'SINRAC' },
  { id: 'adcb_securities', name: 'ADCB Securities', regulator: 'SINRAC' },
  { id: 'fal_securities', name: 'FAL Securities', regulator: 'CEC' },
  { id: 'arqaam_capital', name: 'Arqaam Capital', regulator: 'CEC' },
  { id: 'shuaa_capital', name: 'Shuaa Capital', regulator: 'CEC' },
  { id: 'menacorp', name: 'Menacorp', regulator: 'SINRAC' },
  { id: 'al_ramz_securities', name: 'Al Ramz Securities', regulator: 'CEC' },
  { id: 'mashreq_securities', name: 'Mashreq Securities', regulator: 'SINRAC' },
  { id: 'nbad_securities', name: 'NBAD Securities', regulator: 'SINRAC' }
];

export const REQUEST_TYPES: RequestType[] = [
  {
    id: 'register_new',
    name: 'Register New Investor',
    description: 'Register a new investor profile with DFSA',
    requiresClientCategory: false
  },
  {
    id: 'renew_license',
    name: 'Renew License',
    description: 'Renew existing investment license',
    requiresClientCategory: false
  },
  {
    id: 'suspend_license',
    name: 'Suspend License',
    description: 'Temporarily suspend investment license',
    requiresClientCategory: false
  },
  {
    id: 'request_info',
    name: 'Request Account Information',
    description: 'Request detailed account information',
    requiresClientCategory: false
  },
  {
    id: 'categorize_clients',
    name: 'Categorize Clients',
    description: 'Categorize clients as retail or professional investors',
    requiresClientCategory: true
  },
  {
    id: 'fund_raising_permission',
    name: 'Request Fund Raising Permission',
    description: 'Request permission for fund raising activities',
    requiresClientCategory: false
  },
  {
    id: 'hedge_fund_registration',
    name: 'Hedge Fund Registration',
    description: 'Register hedge fund with DFSA',
    requiresClientCategory: false
  },
  {
    id: 'private_equity_registration',
    name: 'Private Equity Registration',
    description: 'Register private equity fund with DFSA',
    requiresClientCategory: false
  }
];

export const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'United Arab Emirates',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo (Democratic Republic)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea (North)',
  'Korea (South)',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Saudi Arabia',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United States',
  'United Kingdom',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];