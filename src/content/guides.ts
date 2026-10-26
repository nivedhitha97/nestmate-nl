/**
 * Fix-It and Home Care guides. All text is original. Illustrations (SVG per step) come later.
 * Model matches the "Guide content model" in the product spec.
 */

import type { HeatingType } from '@/lib/profile';

export type StoreType = 'budget' | 'diy' | 'supermarket';

export type Guide = {
  id: string;
  title: { en: string; nl: string };
  /** Which heating systems the guide applies to; 'all' for every home. */
  heatingTypes: HeatingType[] | 'all';
  difficulty: 'easy' | 'medium';
  minutes: number;
  whoseJob: 'tenant_usually' | 'landlord_usually';
  items: { en: string; nl: string; store: StoreType }[];
  steps: { text: string }[];
  stopAndCall?: string;
  /** Set to false until someone with this setup has tested the guide at home. */
  testedAtHome: boolean;
};

export const guides: Guide[] = [
  {
    id: 'unblock-shower-drain',
    title: { en: 'Unblock a shower drain', nl: 'Doucheputje ontstoppen' },
    heatingTypes: 'all',
    difficulty: 'easy',
    minutes: 15,
    whoseJob: 'tenant_usually',
    items: [
      { en: 'Rubber gloves', nl: 'huishoudhandschoenen', store: 'budget' },
      { en: 'Drain hair catcher', nl: 'haarzeef', store: 'budget' },
      { en: 'Soda crystals', nl: 'soda', store: 'supermarket' },
    ],
    steps: [
      { text: 'Put on gloves and lift off the drain cover.' },
      { text: 'Push the hair catcher into the drain, twist and pull up slowly. Repeat until it comes out clean.' },
      { text: 'Pour in two spoons of soda, then a kettle of boiling water. Run the shower to check it drains.' },
    ],
    stopAndCall: 'Water comes up in another drain, or the blockage is back within a week.',
    testedAtHome: false,
  },
  {
    id: 'bleed-radiator',
    title: { en: 'Bleed a radiator', nl: 'Radiator ontluchten' },
    heatingTypes: ['gas_boiler', 'district_heating'],
    difficulty: 'easy',
    minutes: 20,
    whoseJob: 'tenant_usually',
    items: [
      { en: 'Radiator key', nl: 'ontluchtingssleutel', store: 'diy' },
      { en: 'Old cloth', nl: 'oude doek', store: 'budget' },
    ],
    steps: [
      { text: 'Turn the heating off and wait until the radiators are cool.' },
      { text: 'Hold the cloth under the small valve at the top corner of the radiator.' },
      { text: 'Turn the key a quarter turn. You will hear air hiss out.' },
      { text: 'Close the valve as soon as water drips out. Do the other radiators too.' },
      { text: 'Gas boiler: check the pressure gauge and top up if it is below the range in your boiler manual.' },
    ],
    stopAndCall: 'The valve will not close, or the boiler keeps losing pressure.',
    testedAtHome: false,
  },
  {
    id: 'descale-kettle',
    title: { en: 'Descale a kettle', nl: 'Waterkoker ontkalken' },
    heatingTypes: 'all',
    difficulty: 'easy',
    minutes: 45,
    whoseJob: 'tenant_usually',
    items: [{ en: 'Cleaning vinegar or citric acid', nl: 'schoonmaakazijn of citroenzuur', store: 'supermarket' }],
    steps: [
      { text: 'Fill the kettle halfway with equal parts water and cleaning vinegar.' },
      { text: 'Boil it, switch off and leave it for 30 minutes.' },
      { text: 'Pour it out, rinse well, then boil fresh water once and throw it away.' },
    ],
    testedAtHome: false,
  },
];

export function guideById(id: string): Guide | undefined {
  return guides.find((guide) => guide.id === id);
}

export function guidesFor(heatingType: HeatingType | undefined): Guide[] {
  return guides.filter(
    (guide) =>
      guide.heatingTypes === 'all' ||
      heatingType === undefined ||
      heatingType === 'unsure' ||
      guide.heatingTypes.includes(heatingType),
  );
}

export const storeLabels: Record<StoreType, string> = {
  budget: 'Budget store',
  diy: 'DIY store',
  supermarket: 'Supermarket',
};
