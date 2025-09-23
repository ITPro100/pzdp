import { LucideIcon } from "lucide-react"

interface Feature {
  title: string
  description: string
  icon?: LucideIcon
  iconName?: string
}

interface FeaturesProps {
  title?: string
  description?: string
  features: Feature[]
  columns?: 2 | 3 | 4
}

export function Features({
  title,
  description,
  features,
  columns = 3,
}: FeaturesProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }

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

        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-line p-6 transition-all hover:bg-white/5 hover:shadow-soft"
            >
              {feature.icon && (
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              )}
              {feature.iconName && (
                <div className="mb-4 text-2xl">
                  {feature.iconName}
                </div>
              )}
              
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}