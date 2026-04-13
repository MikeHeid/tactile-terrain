export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-[pageIn_0.4s_ease-out_both]">
      {children}
    </div>
  );
}
