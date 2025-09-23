import { Button } from "@/components/ui/button"

interface CTAProps {
  title: string
  description?: string
  primaryAction: {
    text: string
    href: string
  }
  secondaryAction?: {
    text: string
    href: string
  }
  variant?: "default" | "accent"
}

export function CTA({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "default",
}: CTAProps) {
  const bgClass = variant === "accent" 
    ? "bg-primary" 
    : "bg-gradient-to-r from-background to-secondary"

  return (
    <section className="py-section">
      <div className="container">
        <div className={`rounded-2xl border border-line ${bgClass} p-12 text-center`}>
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-display-2 font-bold text-foreground">
              {title}
            </h2>
            
            {description && (
              <p className="text-lg text-muted-foreground">
                {description}
              </p>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="rounded-2xl shadow-soft"
                variant={variant === "accent" ? "secondary" : "default"}
                asChild
              >
                <a href={primaryAction.href}>{primaryAction.text}</a>
              </Button>
              
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
          </div>
        </div>
      </div>
    </section>
  )
}