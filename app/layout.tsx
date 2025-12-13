import type { ReactNode } from "react";

export const metadata = {
  title: "Swarm Lock",
  description: "Edge Security Shield"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
