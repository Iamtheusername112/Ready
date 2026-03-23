const columns = [
  { heading: "Company", id: "company" },
  { heading: "Legal", id: "legal" },
  { heading: "Tools", id: "tools" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-rr-footer text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-8 sm:text-center">
          {columns.map((col) => (
            <div key={col.id} className="flex flex-col items-center">
              <h2 className="text-[15px] font-bold tracking-wide text-white">{col.heading}</h2>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-neutral-400">
          © 2024 RetireReady. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
