export interface Version {
  version: string;
  date: string;
  changes: string[];
  author: string;
}

export const versionHistory: Version[] = [
  {
    version: '2.0.0',
    date: '2024-02-21',
    changes: [
      'Launched new premium website with dark mode',
      'Added 10-language support',
      'Integrated AI chatbot',
      'Added advanced admin dashboard'
    ],
    author: 'SAVIMAN Team'
  },
  {
    version: '1.5.0',
    date: '2023-06-15',
    changes: [
      'Added product catalog',
      'Implemented contact forms',
      'Added SEO optimization'
    ],
    author: 'SAVIMAN Team'
  },
  {
    version: '1.0.0',
    date: '2020-01-01',
    changes: [
      'Initial website launch'
    ],
    author: 'SAVIMAN Team'
  }
];

export const getVersion = () => versionHistory[0].version;
