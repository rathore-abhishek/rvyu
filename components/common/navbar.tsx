import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { getUser } from "@/actions/user";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/lists", label: "Lists" },
];

const Navbar = async () => {
  const user = await getUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6">
      <nav className="container mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-br from-background to-background/80 backdrop-blur-sm border rounded-2xl sm:rounded-3xl mt-2 sm:mt-4 shadow-sm">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileNav 
            user={user ? {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image
            } : null} 
          />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="sm:w-9 sm:h-9"
          />
          <span className="text-lg sm:text-xl font-serif font-semibold">
            rvyu.
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section - Theme Toggle & User Menu/CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="/auth/login">Get Started</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
