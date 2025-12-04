import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Boss Mode - Cobb's Crumbs",
  description: 'Admin dashboard for managing your bakery',
};

export default function BossLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
