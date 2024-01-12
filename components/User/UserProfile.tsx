import { TProfileColor, profileClassNames } from "@/utils/profileColor";
import classNames from "classnames";

export default function UserProfile({
  firstName,
  lastName,
  size = "md",
  profile,
  baseSize,
}: {
  firstName?: string;
  lastName?: string;
  profile?: TProfileColor | null;
  size?: "sm" | "md" | "lg";
  baseSize?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={classNames(
        "rounded-full text-center flex items-center justify-center",
        {
          "h-10 w-10": size === "md",
          "h-8 w-8 text-sm": size === "sm",
          "h-12 w-12 text-xl": size === "lg",
          "md:h-10 md:w-10": baseSize === "md",
          "md:h-8 md:w-8 md:text-sm": baseSize === "sm",
          "md:h-12 md:w-12 md:text-xl": baseSize === "lg",
        }
      )}
      style={profileClassNames(profile)}
    >
      <p>{firstName?.charAt(0).toUpperCase()}</p>
      <p>{lastName?.charAt(0).toUpperCase()}</p>
    </div>
  );
}
