'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface NavItem {
  href: string
  label: string
}

interface ClubhouseNavProps {
  slug: string
}

export function ClubhouseNav({ slug }: ClubhouseNavProps) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { href: `/club/${slug}`, label: 'Overview' },
    { href: `/club/${slug}/lore`, label: 'Lore' },
    { href: `/club/${slug}/media`, label: 'Media' },
    { href: `/club/${slug}/resources`, label: 'Resources' },
    { href: `/club/${slug}/upload`, label: 'Upload' },
  ]

  const isActive = (href: string) => {
    if (href === `/club/${slug}`) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="flex flex-wrap gap-2 border-t border-run-gray-800 pt-4">
      {navItems.map((item) => (
        <NavLink key={item.href} href={item.href} active={isActive(item.href)}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

interface NavLinkProps {
  href: string
  active: boolean
  children: ReactNode
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-orange-600 text-white'
          : 'text-run-white hover:bg-run-gray-800'
      }`}
    >
      {children}
    </Link>
  )
}
