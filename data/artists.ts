export type Artist = {
  id: string;
  name: string;
  role: string;
  portrait: string;
  soundcloudUrl: string;
};

export const artists: Artist[] = [
  {
    id: "patxi",
    name: "Patxi",
    role: "DJ",
    portrait: "/da/artist-patxi.jpg",
    soundcloudUrl: "https://soundcloud.com/the-guss-76099411"
  },
  {
    id: "crapule",
    name: "Crapule",
    role: "DJ",
    portrait: "/da/artist-crapule.jpg",
    soundcloudUrl: "https://soundcloud.com/user-882500003"
  },
  {
    id: "saurel",
    name: "Saurel",
    role: "DJ",
    portrait: "/da/artist-saurel.jpg",
    soundcloudUrl: "https://soundcloud.com/aurelien-levet-899210912"
  },
  {
    id: "gruzman",
    name: "Gruzman",
    role: "DJ",
    portrait: "/da/artist-gruzman.jpg",
    soundcloudUrl: "https://soundcloud.com/user-173704289"
  }
];
