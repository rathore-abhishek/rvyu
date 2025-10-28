import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { getUser } from "@/actions/user";

const navLinks = [
  { href: "/dashboard/lists", label: "Dashboard" },
  { href: "/lists", label: "Lists" },
];

const Navbar = async () => {
  const user = await getUser();

  return (
    <header className="sticky top-0 right-0 left-0 z-50 px-5">
      <nav className="from-background to-background/80 relative container mx-auto mt-2 flex max-w-6xl items-center justify-between rounded-2xl border bg-linear-to-br px-6 py-3 shadow-sm backdrop-blur-sm sm:mt-4 sm:rounded-3xl sm:py-4">
        {/* Gradient overlay */}
        <div className="from-primary/5 pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br via-transparent to-transparent sm:rounded-3xl" />

        {/* Mobile Menu */}
        <div className="relative md:hidden">
          <MobileNav user={user} />
        </div>

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="sm:h-9 sm:w-9"
          />
          <span className="font-serif text-lg font-semibold sm:text-xl">
            rvyu.
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="relative hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section - Theme Toggle & User Menu/CTA */}
        <div className="relative flex items-center gap-2 sm:gap-3">
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
