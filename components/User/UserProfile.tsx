import { TProfileColor, profileClassNames } from "@/utils/profileColor";
import classNames from "classnames";

export default function UserProfile({
  firstName,
  lastName,
  profile,
}: {
  firstName?: string;
  lastName?: string;
  profile?: TProfileColor | null;
}) {
  return (
    <div
      className={classNames(
        "rounded-full h-10 w-10 text-center flex items-center justify-center"
      )}
      style={profileClassNames(profile)}
    >
      <p>{firstName?.charAt(0).toUpperCase()}</p>
      <p>{lastName?.charAt(0).toUpperCase()}</p>
    </div>
  );
}
