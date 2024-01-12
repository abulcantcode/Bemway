export type TProfileColor =
  | "BLUE"
  | "NAVY"
  | "MAROON"
  | "RED"
  | "GREEN"
  | "ORANGE"
  | "PINK"
  | "SILVER"
  | "PURPLE"
  | "LIGHTGRAY";

export const ProfileColor: TProfileColor[] = [
  "BLUE",
  "NAVY",
  "MAROON",
  "RED",
  "GREEN",
  "ORANGE",
  "PINK",
  "SILVER",
  "PURPLE",
  "LIGHTGRAY",
];

// export const profileClassNames = (profile?: TProfileColor | null) => {
//   return {
//     "bg-[#209CEE] text-white": profile === "BLUE",
//     "bg-[#05A] text-white": profile === "NAVY",
//     "bg-[#A00] text-white": profile === "MAROON",
//     "bg-[#F00] text-white": profile === "RED",
//     "bg-[#0A0] text-white": profile === "GREEN",
//     "bg-[#FA5] text-black": profile === "ORANGE",
//     "bg-[#F0F] text-black": profile === "PINK",
//     "bg-[#888] text-white": profile === "SILVER",
//     "bg-[#80F] text-white": profile === "PURPLE",
//     "bg-[#DDD] text-black": profile === "LIGHTGRAY",
//   };
// };

export const profileClassNames = (userProfile?: TProfileColor | null) => {
  const colors: {
    backgroundColor: string;
    color: string;
    profileMatch: TProfileColor;
  }[] = [
    { backgroundColor: "#209CEE", color: "#fff", profileMatch: "BLUE" },
    { backgroundColor: "#05A", color: "#fff", profileMatch: "NAVY" },
    { backgroundColor: "#A00", color: "#fff", profileMatch: "MAROON" },
    { backgroundColor: "#F00", color: "#fff", profileMatch: "RED" },
    { backgroundColor: "#0A0", color: "#fff", profileMatch: "GREEN" },
    { backgroundColor: "#FA5", color: "#000", profileMatch: "ORANGE" },
    { backgroundColor: "#F0F", color: "#000", profileMatch: "PINK" },
    { backgroundColor: "#888", color: "#fff", profileMatch: "SILVER" },
    { backgroundColor: "#80F", color: "#fff", profileMatch: "PURPLE" },
    { backgroundColor: "#DDD", color: "#000", profileMatch: "LIGHTGRAY" },
  ];

  return colors.find(({ profileMatch }) => userProfile === profileMatch);
};
