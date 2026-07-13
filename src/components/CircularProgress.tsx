type CircularProgressProps = {
  percentage: number
}

export function CircularProgress({
  percentage,
}: CircularProgressProps) {
  const radius = 55
  const stroke = 10

  const circumference = 2 * Math.PI * radius

  const offset =
    circumference - (percentage / 100) * circumference

  return (
    <div className="flex justify-center">
      <svg width="140" height="140">
        {/* Background */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progress */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#22C55E"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />

        {/* Percentage */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-black text-xl font-bold"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  )
}