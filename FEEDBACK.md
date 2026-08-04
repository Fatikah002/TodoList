# Feedback untuk Next Task

1. ID todo pakai `Date.now()` (di `useTodos.tsx` dan `todos.tsx`). Ini bahaya soalnya bisa collision kalau ada 2 todo dibuat di milidetik yang sama, misalnya pas auto-generate todo repeat. Coba ganti pakai `crypto.randomUUID()` atau counter increment.

2. Belum ada satu pun file test padahal `vitest` udah di-setup lengkap di `package.json` (`npm run test`, testing-library juga udah kepasang). Coba mulai nulis unit test, minimal buat `src/lib/` (repeat.ts, deadline.ts, date.ts) soalnya itu pure function jadi gampang banget ditest.

3. Ada banyak dead code, kode yang di-comment tapi dibiarin nyangkut gitu aja (TanStackDevtools di `__root.tsx`, `<Link>` sama `<span>` di `dashboard.tsx`, `<span>Select</span>` di `todos.tsx`). Bersihin dulu sebelum commit, jangan numpuk komentar yang gajelas mau dipake lagi apa enggak.

4. Import path alias campur aduk, ada yang pakai `@/` ada yang pakai `#/` bahkan dalam satu file yang sama (`todos.tsx`). Dua-duanya emang valid sih tapi mending konsisten satu aja biar rapi.

5. Type object buat data form todo (title, detail, category, priority, deadline, dueTime, repeat) ditulis ulang manual di beberapa tempat (`TodoForm.tsx`, `todos.tsx`, kayaknya juga di `TodoDialog.tsx`), padahal udah ada `TodoFormData` di `schemas.ts` yang bisa dipake ulang. Rawan typo dan gampang kesenjangan kalau field-nya berubah.

6. Komponen `todos.tsx` (413 baris) sama `dashboard.tsx` (335 baris) kegedean, logic filter/sort/statistik ditulis langsung di komponen. Coba dipecah ke custom hook atau helper function di `lib/` biar komponennya fokus render aja, sekalian jadi lebih gampang ditest.

7. Ada hardcoded default value yang keliatan sisa development, kayak `userName = 'Fatikah'` di `dashboard.tsx`. Fallback-nya mending pakai yang generic aja kayak "User" atau string kosong.

8. Style/warna kadang inline hardcoded, kayak `style={{ background: '#fee2e2', ... }}` di toast pada `todos.tsx`, padahal di tempat lain konsisten pakai className Tailwind. Samain aja pakai class Tailwind semua biar konsisten dan gampang di-maintain.

9. Filtering sama searching di `todos.tsx` dihitung ulang tiap render tanpa `useMemo`. Buat list kecil sih gapapa, tapi biasain aja pakai `useMemo` buat derived data yang bergantung ke banyak state, sekalian latihan performance best practice.

10. Ada campuran pesan validasi Bahasa Indonesia (di `schemas.ts`) sama UI Bahasa Inggris di tempat lain. Samain aja, pilih satu bahasa buat seluruh app. Saranku full english ya.

## Halaman Tasks (/todos) Kosong di Desktop

Di `todos.tsx` grid-nya udah didefinisikan `xl:grid-cols-[1fr_340px]`, tapi cuma kolom kiri (`order-2 xl:order-1`) yang diisi konten, kolom kanan 340px-nya gak pernah diisi apa-apa. Makanya di layar desktop keliatan bolong di kanan. Next task, isi kolom kanan itu jadi sidebar panel, misalnya:

11. Ringkasan progress harian (total task, completed, pending, overdue), semacam versi mini dari card di `dashboard.tsx` biar user gak perlu pindah halaman buat liat statistik.

12. Breakdown per kategori, list kategori beserta jumlah task aktifnya, sekalian bisa jadi shortcut filter kalau diklik.

13. Mini calendar/kalender bulan penuh buat quick jump ke tanggal tertentu, beda dari `HorizontalCalendar` yang cuma nampilin 1 minggu. Bisa reuse `Calendar` dari `components/ui/calendar.tsx` yang kayaknya belum dipake di mana-mana.

14. List "Upcoming Deadlines" (7 hari ke depan) biar user bisa lihat sekilas task yang mepet deadline tanpa harus ubah filter tanggal.

15. Quick add category/priority shortcut atau saved filter preset (misalnya "High Priority", "Overdue only") yang tinggal diklik.

## Gamification Features

16. Streak counter, hitung berapa hari berturut-turut user nyelesain minimal 1 task, ditampilin di dashboard mirip streak Duolingo gitu. Logic-nya bisa taruh di `lib/streak.ts`, disimpen di localStorage kayak todos.

17. Poin/XP per todo selesai, makin tinggi priority-nya (High/Medium/Low) makin gede poin yang didapet. Total XP ditampilin di header/profile.

18. Level system, akumulasi XP naikin level user (Level 1, 2, 3, dst dengan threshold tertentu), ditampilin pakai progress bar kayak `CircularProgress` yang udah ada.

19. Badge/achievement, reward buat milestone tertentu, contoh "Selesaikan 10 task", "7 hari streak", "Selesaikan semua task overdue". Bisa disimpen sebagai array di localStorage juga.

20. Celebration feedback pas complete task atau capai milestone, confetti animation atau toast khusus (manfaatin `sonner` yang udah ada) biar user dapet dopamine hit, jangan cuma toast polos "Todo added successfully!".

21. Daily goal/quest, target jumlah task selesai per hari, progress bar di dashboard yang keisi seiring task di-complete, reset tiap ganti hari.
