type LegalConfig = {
  editor: {
    name: string;
    status: string;
    siren: string;
    siret: string;
    email: string;
    address?: string;
    phone?: string;
  };
  host: {
    name: string;
    address: string;
    contactUrl: string;
  };
  upstash: {
    name: string;
    region: string;
    country: string;
  };
};

export const legalConfig: LegalConfig = {
  editor: {
    name: 'Safouane Affane',
    status: 'Entrepreneur Individuel (EI)',
    siren: '131130833',
    siret: '13113083300018',
    email: 'contact@safouane-affane.fr',
  },
  host: {
    name: 'Vercel Inc.',
    address: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
    contactUrl: 'https://vercel.com/contact',
  },
  upstash: {
    name: 'Upstash Inc.',
    region: 'eu-west-1',
    country: 'Irlande',
  },
};
