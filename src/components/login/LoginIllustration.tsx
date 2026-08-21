export function LoginIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[200px] sm:max-w-[220px] lg:max-w-[260px]">
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-green-100 opacity-50 lg:-left-8 lg:-top-8 lg:h-28 lg:w-28" />
      <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-green-50 opacity-70 lg:-bottom-5 lg:-right-5 lg:h-24 lg:w-24" />
      <img
        src="/notelist.svg"
        alt="Organize your tasks"
        className="relative w-full jusify-center"
      />
    </div>
  )
}
