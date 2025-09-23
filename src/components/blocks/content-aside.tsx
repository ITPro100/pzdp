import { ReactNode } from "react"

interface ContentAsideProps {
  title: string
  content: string | ReactNode
  aside: ReactNode
  reversed?: boolean
}

export function ContentAside({
  title,
  content,
  aside,
  reversed = false,
}: ContentAsideProps) {
  return (
    <section className="py-section">
      <div className="container">
        <div className={`grid gap-12 lg:grid-cols-2 lg:items-start ${
          reversed ? "lg:grid-cols-[1fr,2fr]" : "lg:grid-cols-[2fr,1fr]"
        }`}>
          <div className={reversed ? "lg:order-2" : ""}>
            <div className="space-y-6">
              <h2 className="text-display-2 font-bold text-foreground">
                {title}
              </h2>
              <div className="prose prose-lg text-muted-foreground">
                {typeof content === "string" ? (
                  <p>{content}</p>
                ) : (
                  content
                )}
              </div>
            </div>
          </div>
          
          <div className={reversed ? "lg:order-1" : ""}>
            <div className="sticky top-24">
              {aside}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}