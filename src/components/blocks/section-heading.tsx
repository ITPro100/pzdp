interface SectionHeadingProps {
  title: string
  description?: string
  badge?: string
  align?: "left" | "center"
}

export function SectionHeading({
  title,
  description,
  badge,
  align = "center",
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto max-w-2xl",
  }

  return (
    <div className={`mb-12 ${alignmentClasses[align]}`}>
      {badge && (
        <div className="mb-4">
          <span className="inline-flex items-center rounded-2xl border border-line bg-white/5 px-4 py-2 text-sm font-medium text-muted-foreground">
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-display-2 font-bold text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}