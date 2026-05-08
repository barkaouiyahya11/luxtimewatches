const TRUST_ITEMS = [
  {
    icon: 'fa-truck-fast',
    title: 'Livraison Gratuite',
    desc: 'Partout au Maroc sous 24/48h.',
  },
  {
    icon: 'fa-handshake-angle',
    title: 'Paiement à la Livraison',
    desc: 'Payez à réception, 100% sécurisé.',
  },
  {
    icon: 'fa-medal',
    title: 'Qualité Premium',
    desc: 'Sélection rigoureuse, garantie produit.',
  },
]

export default function TrustSection() {
  return (
    <section style={{ background: '#FAFAFA', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', padding: '72px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>

        {/* Title */}
        <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: '#C6A769', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
          Notre Engagement
        </p>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#1A1A1A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '48px' }}>
          L&apos;Excellence Lux Time
        </h2>

        {/* Items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px', height: '56px',
                border: '1px solid #E5E5E5',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fff',
              }}>
                <i className={`fa-solid ${item.icon}`} style={{ fontSize: '18px', color: '#C6A769' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A1A1A', marginBottom: '6px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '11px', color: '#6E6E6E', letterSpacing: '0.02em', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
