export const metadata = {
  title: "SB Tech Lab // Studio Control",
  description: "Internal Studio Control for SB Tech Lab"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script defer src="/scripts/sb-analytics.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
