export type NavItem = { label: string; href: string; index: string };

export const sections: NavItem[] = [
  { label: 'Home', href: '#home', index: '00' },
  { label: 'About', href: '#about', index: '01' },
  { label: 'Projects', href: '#projects', index: '02' },
  { label: 'Status', href: '#status', index: '03' },
  { label: 'Notes', href: '/notes', index: '04' },
  { label: 'Contact', href: '#contact', index: '05' },
];

export const social = {
  github: 'https://github.com/WarquahF',
  email: 'warquah.dev@proton.me',
  x: 'https://x.com/warquah35',
};
