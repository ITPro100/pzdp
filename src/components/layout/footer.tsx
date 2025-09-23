import Link from "next/link"
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react"

const footerLinks = {
  services: [
    { title: "Оскарження рішень ВЛК", href: "/uslugi/oskargennya-vlk" },
    { title: "Переведення зі служби", href: "/uslugi/perevedennya-zi-slugby" },
    { title: "Звільнення зі служби", href: "/uslugi/zvilnennya-zi-slugby" },
    { title: "Індексація виплат", href: "/uslugi/indeksaciya-vyplat" },
  ],
  practices: [
    { title: "Військове право", href: "/napryamy/viyskove-pravo" },
    { title: "Сімейне право", href: "/napryamy/simeyne-pravo" },
    { title: "Адміністративне право", href: "/napryamy/administratyvne-pravo" },
    { title: "Кримінальне право", href: "/napryamy/kryminalne-pravo" },
  ],
  company: [
    { title: "Про нас", href: "/about" },
    { title: "Блог", href: "/blog" },
    { title: "FAQ", href: "/faq" },
    { title: "Контакти", href: "/contacts" },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <div className="h-4 w-4 rounded-sm bg-white" />
              </div>
              <span className="font-bold text-foreground">Правовий Захист</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Професійна правова допомога військовим у Дніпрі. Спеціалізуємося на оскарженні рішень ВЛК та незалежній оцінці здоров'я.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="text-foreground">м. Дніпро</p>
                  <p className="text-muted-foreground">вул. Воскресенська, 1А</p>
                </div>
              </div>

              <Link 
                href="tel:+380633094480"
                className="flex items-center space-x-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>063 309 44 80</span>
              </Link>

              <Link 
                href="mailto:info@pz.dp.ua"
                className="flex items-center space-x-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>info@pz.dp.ua</span>
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Послуги</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practices */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Напрямки</h3>
            <ul className="space-y-2">
              {footerLinks.practices.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Компанія</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="pt-4">
              <Link
                href="https://pz.dp.ua"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <span>pz.dp.ua</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-line">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Правовий Захист Дніпро. Усі права захищені.
            </p>
            
            <div className="flex space-x-6">
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Політика конфіденційності
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Умови використання
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}