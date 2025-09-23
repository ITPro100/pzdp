"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const navigation = [
  {
    title: "Послуги",
    href: "/uslugi",
    items: [
      { title: "Оскарження рішень ВЛК", href: "/uslugi/oskargennya-vlk" },
      { title: "Переведення зі служби", href: "/uslugi/perevedennya-zi-slugby" },
      { title: "Звільнення зі служби", href: "/uslugi/zvilnennya-zi-slugby" },
      { title: "Індексація виплат", href: "/uslugi/indeksaciya-vyplat" },
    ],
  },
  {
    title: "Напрямки",
    href: "/napryamy",
    items: [
      { title: "Військове право", href: "/napryamy/viyskove-pravo" },
      { title: "Сімейне право", href: "/napryamy/simeyne-pravo" },
      { title: "Адміністративне право", href: "/napryamy/administratyvne-pravo" },
      { title: "Кримінальне право", href: "/napryamy/kryminalne-pravo" },
    ],
  },
  { title: "Блог", href: "/blog" },
  { title: "FAQ", href: "/faq" },
  { title: "Контакти", href: "/contacts" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <div className="h-4 w-4 rounded-sm bg-white" />
          </div>
          <span className="hidden font-bold text-foreground sm:inline-block">
            Правовий Захист
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-1">
            {navigation.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-white/5">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-1 p-2">
                        {item.items.map((subItem) => (
                          <li key={subItem.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                )}
                              >
                                <div className="text-sm font-medium leading-none">
                                  {subItem.title}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    {item.title}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Phone & Mobile Menu Button */}
        <div className="flex items-center space-x-2">
          <Link href="tel:+380633094480" className="hidden sm:flex">
            <Button variant="outline" size="sm" className="border-line hover:bg-white/5">
              <Phone className="mr-2 h-4 w-4" />
              063 309 44 80
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-line bg-background md:hidden">
          <nav className="container py-4">
            <div className="space-y-4">
              {navigation.map((item) => (
                <div key={item.title} className="space-y-2">
                  <Link
                    href={item.href}
                    className="block text-sm font-medium text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.items && (
                    <div className="ml-4 space-y-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block text-sm text-muted-foreground hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <Link href="tel:+380633094480">
                  <Button className="w-full" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    063 309 44 80
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}