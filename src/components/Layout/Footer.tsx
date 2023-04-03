export function Footer() {
  return (
    <footer className="flex justify-center py-2 px-4 text-slate-500">
      <span>&copy;</span>
      <span className="ml-2">{new Date().getFullYear()}</span>
      <span className="ml-2">Ochuko Ekrresa</span>
    </footer>
  )
}
