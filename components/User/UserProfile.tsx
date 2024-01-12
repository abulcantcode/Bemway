import { TProfileColor, profileClassNames } from "@/utils/profileColor";
import classNames from "classnames";

export default function UserProfile({
  firstName,
  lastName,
  size = "md",
  profile,
}: {
  firstName?: string;
  lastName?: string;
  profile?: TProfileColor | null;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={classNames(
        "rounded-full text-center flex items-center justify-center",
        {
          "h-10 w-10": size === "md",
          "h-8 w-8 text-sm": size === "sm",
          "h-12 w-12 text-xl": size === "lg",
        }
      )}
      style={profileClassNames(profile)}
    >
      <p>{firstName?.charAt(0).toUpperCase()}</p>
      <p>{lastName?.charAt(0).toUpperCase()}</p>
    </div>
  );
}
