function IllustrationShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute -left-8 -top-10 h-28 w-28 rounded-full bg-green-200/50 blur-2xl sm:h-36 sm:w-36" />
      <div className="absolute -right-6 -bottom-10 h-32 w-32 rounded-full bg-emerald-200/60 blur-2xl sm:h-40 sm:w-40" />

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
        className="relative h-full w-full max-w-[22rem] object-contain"
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
        className="relative h-full w-full max-w-[25rem] object-contain"
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
        className="relative h-full w-full max-w-[22rem] object-contain"
      />
    </IllustrationShell>
  )
}
