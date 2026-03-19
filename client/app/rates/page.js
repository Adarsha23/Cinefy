'use client';

export default function TicketRates() {
  const rateSections = [
    {
      title: "Weekdays (Monday & Thursday)",
      rates: [
        { label: "Rs. 200", sub: "Morning Show" },
        { label: "Rs. 350", sub: "Regular Show" },
        { label: "Rs. 250", sub: "3D Morning Show" },
        { label: "Rs. 400", sub: "3D Regular Show" }
      ]
    },
    {
      title: "Weekends (Friday To Sunday) & Public Holidays",
      rates: [
        { label: "Rs. 200", sub: "Morning Show" },
        { label: "Rs. 400", sub: "Regular Show" },
        { label: "Rs. 250", sub: "3D Morning Show" },
        { label: "Rs. 450", sub: "3D Regular Show" }
      ]
    },
    {
      title: "Xtended Super2Days (Tuesday and Wednesday-All day long)",
      rates: [
        { label: "Rs. 200", sub: "Regular Shows" },
        { label: "Rs. 250", sub: "3D Regular Shows" }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '8rem 4rem 4rem 4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '3rem', textAlign: 'center' }}>
          Ticket Pricing
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {rateSections.map((section, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              backgroundColor: '#1a1a1a', 
              borderRadius: '8px', 
              overflow: 'hidden',
              minHeight: '160px',
              border: '1px solid #222'
            }}>
              {/* Left Accent Header */}
              <div style={{ 
                width: '240px', 
                backgroundColor: '#f40612', 
                padding: '2rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: '600',
                lineHeight: '1.4'
              }}>
                {section.title}
              </div>

              {/* Rates Grid */}
              <div style={{ 
                flexGrow: 1, 
                display: 'grid', 
                gridTemplateColumns: `repeat(${section.rates.length}, 1fr)`,
                borderLeft: '1px solid #333'
              }}>
                {section.rates.map((rate, rIdx) => (
                  <div key={rIdx} style={{ 
                    borderLeft: rIdx === 0 ? 'none' : '1px solid #222',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '8px' }}>{rate.label}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{rate.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '3rem', color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>
          * Rates are subject to change during blockbuster releases or special events. 3D glasses may require a separate deposit.
        </p>

      </div>
    </div>
  );
}
