interface ProofItem {
  value: string
  label: string
  description?: string
}

interface ProofProps {
  title?: string
  description?: string
  items: ProofItem[]
  badges?: string[]
}

export function Proof({ title, description, items, badges }: ProofProps) {
  return (
    <section className="py-section">
      <div className="container">
        {(title || description) && (
          <div className="mx-auto max-w-2xl text-center mb-12">
            {title && (
              <h2 className="text-display-2 font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-8">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <span className="text-4xl font-bold text-primary md:text-5xl">
                  {item.value}
                </span>
              </div>
              <p className="font-medium text-foreground">{item.label}</p>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="inline-flex items-center rounded-2xl border border-line bg-white/5 px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}