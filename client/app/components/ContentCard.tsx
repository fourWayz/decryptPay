import Link from "next/link";

interface ContentCardProps {
  image: string;
  title: string;
  creator: string;
  price: string;
  usd?: string;
  id : number
  onBuy?: (product: { title: string; price: string }) => void;
}

export default function ContentCard({
  image,
  title,
  creator,
  price,
  usd,
  onBuy,
  id
}: ContentCardProps) {
  return (
    <Link href={`/content/${id}`}>
      <div className="bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col">
        <img
          src={image}
          alt={title}
          className="rounded-lg mb-4 w-full h-40 object-cover"
        />
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-400 text-sm mb-2">{creator}</p>
        <p className="text-blue-400 font-medium mb-1">{price}</p>
        {usd && <p className="text-gray-400 text-sm mb-4">({usd})</p>}

        <button
          onClick={() => onBuy && onBuy({ title, price })}
          className="mt-auto bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Buy
        </button>
      </div>
    </Link>

  );
}
