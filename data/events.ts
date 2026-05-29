export type EventItem = {
  id: string;
  title: string;
  date: string;
  place: string;
  city: string;
  lineup: string[];
  description: string;
  image: string;
  ticketUrl: string;
  status: "a-venir" | "sold-out" | "archive";
};

export const events: EventItem[] = [
  {
    id: "event-01",
    title: "CRANEURBOYS INVITE",
    date: "26 juin 2026 / 23h-6h",
    place: "Yoyo Palais de Tokyo",
    city: "Paris",
    lineup: ["DJ Falcon", "Les Craneurs", "Edgar de Sacy", "Vadim"],
    description:
      "DJ Falcon se produira pour la premiere fois au Yoyo depuis plusieurs annees, pour une soiree live et french touch aux cotes des Craneurs et d'Edgar de Sacy, du duo Les Nuits Blonde. Il jouera pour la premiere fois son tout premier album en live, accompagne de synthetiseurs. Les Craneurs seront eux aussi accompagnes par Vadim a la guitare electrique. Venez plonger dans un nouvel univers melant french touch et live music, aux cotes de grands noms de la scene francaise.",
    image: "/da/export-insta-v5.png",
    ticketUrl: "https://shotgun.live/fr/venues/craneurboys",
    status: "a-venir"
  }
];
