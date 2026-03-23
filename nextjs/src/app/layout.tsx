export const metadata = {
  title: "Kapa Agent — Next.js Example",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
};

export default RootLayout;
