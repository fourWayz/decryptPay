export default function RoadmapCard({
  phase,
  title,
  description,
  status,
  key
}: {
  phase: string;
  title: string;
  description: string;
  status: string;
  key :number
}) {
  const statusColor =
    status === "Completed"
      ? "bg-blue-600"
      : status === "In Progress"
      ? "bg-green-600"
      : "bg-gray-600";

  return (
    <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg flex flex-col">
      <h3 className="font-bold text-lg mb-2">{phase}: {title}</h3>
      <p className="text-gray-400 flex-1">{description}</p>
      <span
        className={`${statusColor} text-xs px-3 py-1 rounded-full mt-4 self-start`}
      >
        {status}
      </span>
    </div>
  );
}
