export const categories = [
    'Work', 'Personal', 'Shopping', 'Other'
] as const

export type TodoCategory = (typeof categories)[number]

