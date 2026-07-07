export const categories = [
    'Pekerjaan', 'Pribadi', 'Belanja', 'Lainnya'
] as const

export type TodoCategory = (typeof categories)[number]

