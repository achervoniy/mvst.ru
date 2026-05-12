export type Boutique = {
  id: string;
  slug: string;
  title: string;
  city: string;
  address: string;
  phone: string | null;
  schedule: string | null;
  routeUrl: string | null;
  photoUrl: string | null;
  priority: number;
};

export function getBoutiqueById(
  list: Boutique[] | undefined,
  id: string | null | undefined,
): Boutique | undefined {
  if (!id || !list) return undefined;
  return list.find(b => b.id === id || b.slug === id);
}
