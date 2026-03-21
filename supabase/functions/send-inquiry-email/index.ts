import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InquiryData {
  type: 'buy' | 'sell' | 'contact';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  budget?: string;
  location?: string;
  roomCount?: string;
  propertyType?: string;
  propertyAddress?: string;
  propertySize?: string;
  yearBuilt?: string;
  propertyCondition?: string;
  askingPrice?: string;
}

async function sendEmail(apiKey: string, from: string, to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Resend API error ${res.status}: ${responseText}`);
  }

  return JSON.parse(responseText);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: InquiryData = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const adminEmail = 'inffomre@gmail.com';
    const fromAddress = 'onboarding@resend.dev';

    let adminSubject = '';
    let adminHtml = '';
    let customerSubject = '';
    let customerHtml = '';

    if (data.type === 'buy') {
      adminSubject = 'Nova ziadost o kupu nehnutelnosti';
      adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Nova ziadost o kupu nehnutelnosti</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Kontaktne informacie:</h3>
            <p><strong>Meno:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Telefon:</strong> ${data.phone}</p>` : ''}
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Poziadavky na nehnutelnost:</h3>
            ${data.budget ? `<p><strong>Rozpocet:</strong> ${data.budget}</p>` : ''}
            ${data.location ? `<p><strong>Lokalita:</strong> ${data.location}</p>` : ''}
            ${data.roomCount ? `<p><strong>Pocet izieb:</strong> ${data.roomCount}</p>` : ''}
            ${data.propertyType ? `<p><strong>Typ nehnutelnosti:</strong> ${data.propertyType}</p>` : ''}
            ${data.message ? `<p><strong>Sprava:</strong><br/>${data.message}</p>` : ''}
          </div>
        </div>
      `;
      customerSubject = 'Dakujeme za Vas zaujem o kupu nehnutelnosti';
      customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Dakujeme za Vas zaujem!</h2>
          <p>Vazeny/a ${data.name},</p>
          <p>Dakujeme za Vas zaujem o kupu nehnutelnosti prostredníctvom nasich sluzieb.</p>
          <p>Vasu ziadost sme uspesne prijali a nas tym ju v najblizsom case spracuje. Ozveme sa Vam co najskor s dalsimi informaciami.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">S pozdravom,<br/>Vas realitny tym</p>
        </div>
      `;
    } else if (data.type === 'sell') {
      adminSubject = 'Nova ziadost o predaj nehnutelnosti';
      adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Nova ziadost o predaj nehnutelnosti</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Kontaktne informacie:</h3>
            <p><strong>Meno:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Telefon:</strong> ${data.phone}</p>` : ''}
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Informacie o nehnutelnosti:</h3>
            ${data.propertyAddress ? `<p><strong>Adresa:</strong> ${data.propertyAddress}</p>` : ''}
            ${data.propertySize ? `<p><strong>Velkost:</strong> ${data.propertySize}</p>` : ''}
            ${data.yearBuilt ? `<p><strong>Rok stavby:</strong> ${data.yearBuilt}</p>` : ''}
            ${data.propertyCondition ? `<p><strong>Stav:</strong> ${data.propertyCondition}</p>` : ''}
            ${data.askingPrice ? `<p><strong>Pozadovana cena:</strong> ${data.askingPrice}</p>` : ''}
            ${data.message ? `<p><strong>Sprava:</strong><br/>${data.message}</p>` : ''}
          </div>
        </div>
      `;
      customerSubject = 'Dakujeme za Vas zaujem o predaj nehnutelnosti';
      customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Dakujeme za Vas zaujem!</h2>
          <p>Vazeny/a ${data.name},</p>
          <p>Dakujeme za Vas zaujem o predaj nehnutelnosti prostredníctvom nasich sluzieb.</p>
          <p>Vasu ziadost sme uspesne prijali. Ozveme sa Vam co najskor.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">S pozdravom,<br/>Vas realitny tym</p>
        </div>
      `;
    } else if (data.type === 'contact') {
      adminSubject = 'Nova sprava z kontaktneho formulara';
      adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Nova sprava z kontaktneho formulara</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Kontaktne informacie:</h3>
            <p><strong>Meno:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Telefon:</strong> ${data.phone}</p>` : ''}
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Sprava:</h3>
            <p>${data.message || 'Ziadna sprava'}</p>
          </div>
        </div>
      `;
      customerSubject = 'Dakujeme za Vasu spravu';
      customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Dakujeme za Vasu spravu!</h2>
          <p>Vazeny/a ${data.name},</p>
          <p>Dakujeme za Vasu spravu. Ozveme sa Vam do 24-48 hodin.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">S pozdravom,<br/>Vas realitny tym</p>
        </div>
      `;
    }

    const results: { admin?: unknown; customer?: unknown; customerError?: string } = {};

    results.admin = await sendEmail(RESEND_API_KEY, fromAddress, adminEmail, adminSubject, adminHtml);

    try {
      results.customer = await sendEmail(RESEND_API_KEY, fromAddress, data.email, customerSubject, customerHtml);
    } catch (customerErr: any) {
      results.customerError = customerErr.message;
      console.warn('Customer confirmation email failed (likely free-tier sender restriction):', customerErr.message);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email(s) sent', results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
