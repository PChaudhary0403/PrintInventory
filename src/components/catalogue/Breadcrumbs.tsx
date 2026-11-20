import Link from 'next/link'

interface BreadcrumbItem { label: string; href?: string }
interface Props { items: BreadcrumbItem[] }

export function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[#9CA3AF] text-xs">›</span>}
            {item.href ? (
              <Link href={item.href} className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-xs text-[#1F2937] font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
