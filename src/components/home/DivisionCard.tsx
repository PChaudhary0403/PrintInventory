import Link from "next/link";

interface DivisionCardProps {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
}

export function DivisionCard({
  name,
  slug,
  description,
  imageUrl,
}: DivisionCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group block border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm text-text-muted">{name}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
        <span className="inline-block text-sm font-medium text-primary mt-3 group-hover:translate-x-0.5 transition-transform">
          Explore →
        </span>
      </div>
    </Link>
  );
}
