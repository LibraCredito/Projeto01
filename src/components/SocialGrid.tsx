const REDES = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/libracredito/',
    text: 'Bastidores, dicas rápidas e histórias de clientes.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/LibraCreditoOficial',
    text: 'Novidades e conteúdos para compartilhar com a família.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M14 8.5V7c0-.8.2-1.2 1.3-1.2H17V3h-2.5C11.6 3 10.5 4.5 10.5 7v1.5H8.5V12h2v9H14v-9h2.6l.4-3.5H14z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/libracredito',
    text: 'A Libra por dentro: time, cultura e mercado.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h2.9v1.7h.1c.4-.8 1.5-1.9 3.3-1.9 3.5 0 4.2 2.3 4.2 5.4V21h-3v-6.1c0-1.5 0-3.3-2-3.3s-2.4 1.6-2.4 3.2V21H9z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@libracredito',
    text: 'Vídeos que explicam crédito sem economês.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2C2 8.9 2 12 2 12s0 3.1.4 4.8a2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM10 15.2V8.8L15.5 12 10 15.2z" />
      </svg>
    ),
  },
] as const

export function SocialGrid() {
  return (
    <div className="socgrid">
      {REDES.map((rede) => (
        <a
          key={rede.name}
          className="soc"
          href={rede.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${rede.name} da Libra Crédito`}
        >
          <span className="soc-ic">{rede.icon}</span>
          <b>{rede.name}</b>
          <p className="soc-p">{rede.text}</p>
          <span className="soc-ar">→</span>
        </a>
      ))}
    </div>
  )
}
