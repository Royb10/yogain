exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, phone, email, subject } = JSON.parse(event.body || '{}');

  const html = `
    <div dir="rtl" style="font-family:sans-serif; max-width:500px;">
      <h2>${subject || 'פנייה חדשה מהאתר'}</h2>
      <p><strong>שם:</strong> ${name || '—'}</p>
      <p><strong>טלפון:</strong> ${phone || '—'}</p>
      ${email ? `<p><strong>מייל:</strong> ${email}</p>` : ''}
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'ציפי נגב <noreply@resend.iwise.co.il>',
      to: ['yogaintegrativit@gmail.com,roybalsam@gmail.com'],
      subject: subject || 'פנייה חדשה מהאתר',
      html
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
    return { statusCode: 500, body: 'Email failed' };
  }

  return { statusCode: 200, body: 'OK' };
};
