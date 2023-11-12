export interface TTask {
  title: string;
  description?: string;
  status: "Done" | "In-progress" | "Blocked" | "Not started";
  due?: Date;
  dueStart?: Date;
  priority?: "High" | "Medium" | "Low";
  owners?: {
    firstName: string;
    lastName: string;
    profile?: string;
    userId: string;
  }[];
}

// TODO: get types from DB

export default function Task({
  title,
  description,
  status,
  due,
  dueStart,
  priority,
  owners,
}: TTask) {
  return (
    <div className="bg-slate-800 rounded-md shadow-lg flex flex-col gap-2 p-4 m-4 w-60">
      <h4>{title}</h4>
      <hr />
      <p>{description}</p> <p>{status}</p>
      <p>{due?.toString()}</p>
      <p>{dueStart?.toString()}</p>
      <p>{priority}</p>
      <div className="flex gap-2">
        {owners?.map(({ firstName, lastName, profile }, idx) => (
          <div
            className="rounded-full h-10 w-10 text-center flex items-center justify-center"
            key={`${idx}-owner`}
            style={{ backgroundColor: profile || "#345678" }}
          >
            <p>{firstName.charAt(0)}</p>
            <p>{lastName.charAt(0)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
