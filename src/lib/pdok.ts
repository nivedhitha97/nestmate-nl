/**
 * Postcode lookup using the PDOK Locatieserver (Kadaster BAG open data, free, no API key).
 * Docs: https://api.pdok.nl/bzk/locatieserver/search/v3_1/ui/
 */

const PDOK_SEARCH_URL = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free';

export type Address = {
  label: string;
  postcode: string;
  city: string;
  municipality: string;
  province: string;
  latitude: number;
  longitude: number;
};

type PdokDoc = {
  weergavenaam: string;
  postcode: string;
  woonplaatsnaam: string;
  gemeentenaam: string;
  provincienaam: string;
  centroide_ll: string;
};

/** Returns the postcode as "1234AB", or null when it isn't a valid Dutch postcode. */
export function normalisePostcode(input: string): string | null {
  const compact = input.replace(/\s+/g, '').toUpperCase();
  return /^[1-9][0-9]{3}[A-Z]{2}$/.test(compact) ? compact : null;
}

/** Formats "1234AB" as "1234 AB" for display. */
export function formatPostcode(postcode: string): string {
  return `${postcode.slice(0, 4)} ${postcode.slice(4)}`;
}

export async function lookupPostcode(postcode: string, houseNumber?: string): Promise<Address | null> {
  const params = new URLSearchParams({
    rows: '1',
    fl: 'weergavenaam,postcode,woonplaatsnaam,gemeentenaam,provincienaam,centroide_ll',
  });
  params.append('fq', `postcode:${postcode}`);
  params.append('fq', 'type:adres');
  if (houseNumber && /^\d+$/.test(houseNumber)) {
    params.append('fq', `huisnummer:${houseNumber}`);
  }

  const response = await fetch(`${PDOK_SEARCH_URL}?${params.toString()}`);
  if (!response.ok) throw new Error(`PDOK lookup failed (${response.status})`);

  const data = (await response.json()) as { response: { docs: PdokDoc[] } };
  const doc = data.response.docs[0];
  if (!doc) return null;

  // centroide_ll looks like "POINT(4.8937175 52.37329259)": longitude first.
  const [longitude, latitude] = doc.centroide_ll
    .replace(/^POINT\(|\)$/g, '')
    .split(' ')
    .map(Number);

  return {
    label: doc.weergavenaam,
    postcode: doc.postcode,
    city: doc.woonplaatsnaam,
    municipality: doc.gemeentenaam,
    province: doc.provincienaam,
    latitude,
    longitude,
  };
}
