export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-xl space-y-4">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">KonsinyasiKu Backend API</p>
        <h1 className="text-3xl font-semibold text-foreground">Backend siap menerima request mobile app.</h1>
        <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Gunakan <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-900">/api/health</code> untuk
          health check awal.
        </p>
      </div>
    </main>
  );
}
