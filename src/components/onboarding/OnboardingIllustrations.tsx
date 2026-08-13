function IllustrationShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-64 items-center justify-center overflow-hidden sm:h-80 lg:h-96">
      <div className="absolute -left-10 -top-12 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
      <div className="absolute -bottom-12 -right-8 h-36 w-36 rounded-full bg-primary/25 blur-2xl" />

      {children}
    </div>
  )
}

export function Slide1Illustration() {
  return (
    <IllustrationShell>
      <img
        src="/notelist.svg"
        alt="Organizing a task list"
        className="relative h-full w-full max-w-[360px] object-contain"
      />
    </IllustrationShell>
  )
}

export function Slide2Illustration() {
  return (
    <IllustrationShell>
      <img
        src="/nexttask.svg"
        alt="Organizing the next task"
        className="relative h-full w-full max-w-[360px] object-contain"
      />
    </IllustrationShell>
  )
}

export function Slide3Illustration() {
  return (
    <IllustrationShell>
      <img
        src="/todolist.svg"
        alt="TodoSpace task list"
        className="relative h-full w-full max-w-[360px] object-contain"
      />
    </IllustrationShell>
  )
}
