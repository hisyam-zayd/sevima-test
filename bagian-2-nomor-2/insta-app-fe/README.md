# Insta App - Frontend

- Node.JS >= 18
- React 18 (ui js library)
- Vite 5 (build tool dan dev server)
- Tailwind CSS 3 (css framework)
- Axios (http client)
- React Router DOM (SPA routing, navigasi tanpa reload)

## Fitur

- **Autentikasi** — Register, Login, Logout
- **Feed** — Melihat semua post dari semua User
- **Post** — Buat Post baru (dengan/tanpa gambar), edit, hapus (owner only)
- **Komentar** — Lihat, buat, edit, hapus komentar (owner only)
- **Like** — Like/unlike post dengan toggle

## Local run

```bash
npm install
# dev port 3000
npm run dev
npm run build
# preview production build
npm run preview
```

## Struktur
```
src/
├── api.js                  # Axios instance + auth interceptor
├── App.jsx                 # Router & route
├── main.jsx
├── index.css
├── context/
│   └── AuthContext.jsx     # Auth state (user, login, logout)
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Feed.jsx            # Halaman utama
└── components/
    ├── CreatePost.jsx       # Form buat post baru
    ├── PostCard.jsx         # Kartu post (like, komentar, edit/hapus)
    └── CommentsModal.jsx    # Modal komentar
```

## Notes
- Backend URL dikonfigurasi di `src/api.js` (`baseURL`)
- Gambar post di-serve dari `http://localhost:8000/storage/`
- Auth token disimpan di `localStorage` dengan key `token`
