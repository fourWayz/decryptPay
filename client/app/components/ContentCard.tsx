export default function ContentCard({
  image,
  title,
  creator,
  price,
  usd,
}: {
  image: string;
  title: string;
  creator: string;
  price: string;
  usd: string;
}) {
  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-400 mb-2">{creator}</p>
        <p className="font-medium text-blue-400 mb-4">{price} <span className="text-gray-400 text-sm">({usd})</span></p>
        <button className="bg-blue-600 w-full py-2 rounded-lg hover:bg-blue-700">
          Buy
        </button>
      </div>
    </div>
  );
}
