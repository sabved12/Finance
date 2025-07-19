// For Next.js app router, in your auth layout or directly wrapping your page
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-60 flex justify-center min-h-screen">
      {children}
    </div>
  );
}
