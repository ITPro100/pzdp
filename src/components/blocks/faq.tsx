import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
  q: string
  a: string
}

interface FAQProps {
  title?: string
  description?: string
  faqs: FAQItem[]
}

export function FAQ({ title, description, faqs }: FAQProps) {
  return (
    <section className="py-section">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          {(title || description) && (
            <div className="text-center mb-12">
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

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-2xl border border-line px-6 py-2 transition-all hover:bg-white/5"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}