export interface MoMoCountry {
  name: string;
  code: string;
  flag: string;
  iso: string;
}

export const momoCountries: MoMoCountry[] = [
  { name: 'Botswana', code: '+267', flag: '🇧🇼', iso: 'bw' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦', iso: 'za' },
  { name: 'Namibia', code: '+264', flag: '🇳🇦', iso: 'na' },
  { name: 'Zambia', code: '+260', flag: '🇿🇲', iso: 'zm' },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼', iso: 'zw' },
  { name: 'Uganda', code: '+256', flag: '🇺🇬', iso: 'ug' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭', iso: 'gh' },
  { name: 'Rwanda', code: '+250', flag: '🇷🇼', iso: 'rw' },
  { name: 'Cameroon', code: '+237', flag: '🇨🇲', iso: 'cm' },
  { name: "Côte d'Ivoire", code: '+225', flag: '🇨🇮', iso: 'ci' },
  { name: 'Liberia', code: '+231', flag: '🇱🇷', iso: 'lr' },
];
