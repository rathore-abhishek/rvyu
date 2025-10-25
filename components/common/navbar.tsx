import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { getUser } from "@/actions/user";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/lists", label: "Lists" },
];

const Navbar = async () => {
  const user = await getUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto flex max-w-6xl items-center justify-between px-6 py-4 bg-linear-to-br from-background to-background/80 border rounded-3xl mt-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-lg font-serif font-semibold">rvyu.</span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-8">
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
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
