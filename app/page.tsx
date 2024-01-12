import SignupForm from "@/components/Auth/SignupForm";
import Image from "next/image";

export default function CreateUserPage() {
  return (
    <main className="flex items-center justify-center">
      <div className="fixed -z-40 dark:opacity-0 opacity-100 bg-white duration-500 ">
        <Image
          src={"/bg-light.jpg"}
          alt="background image"
          width={3840}
          height={2400}
          className="object-cover h-screen w-screen object-top opacity-30"
        />
      </div>
      <div className="fixed -z-40 dark:opacity-100 opacity-0 duration-500 bg-black">
        <Image
          src={"/bg-dark.png"}
          alt="background image"
          width={3840}
          height={2400}
          className="object-cover h-screen w-screen object-top opacity-30"
        />
      </div>
      <SignupForm />
    </main>
  );
}
