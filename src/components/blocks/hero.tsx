import { Button } from "@/components/ui/button"

interface HeroProps {
  title: string
  subtitle: string
  description?: string
  primaryAction?: {
    text: string
    href: string
  }
  secondaryAction?: {
    text: string
    href: string
  }
  badge?: string
}

export function Hero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  badge,
}: HeroProps) {
  return (
    <section className="py-section">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          {badge && (
            <div className="inline-flex items-center rounded-2xl border border-line bg-white/5 px-4 py-2 text-sm font-medium text-muted-foreground">
              {badge}
            </div>
          )}
          
          <div className="space-y-4">
            <h1 className="text-display-1 font-bold tracking-[-0.02em] text-foreground">
              {title}
            </h1>
            <p className="text-display-2 text-muted-foreground">
              {subtitle}
            </p>
            {description && (
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {primaryAction && (
                <Button size="lg" className="rounded-2xl shadow-soft" asChild>
                  <a href={primaryAction.href}>{primaryAction.text}</a>
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-line hover:bg-white/5"
                  asChild
                >
                  <a href={secondaryAction.href}>{secondaryAction.text}</a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}