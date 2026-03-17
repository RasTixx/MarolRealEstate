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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: InquiryData = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const adminEmail = 'inffomre@gmail.com';

    let adminSubject = '';
    let adminHtml = '';
    let customerSubject = '';
    let customerHtml = '';

    if (data.type === 'buy') {
      adminSubject = '🏠 Nová žiadosť o kúpu nehnuteľnosti';
      adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Nová žiadosť o kúpu nehnuteľnosti</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Kontaktné informácie:</h3>
            <p><strong>Meno:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Telefón:</strong> ${data.phone}</p>` : ''}
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Požiadavky na nehnuteľnosť:</h3>
            ${data.budget ? `<p><strong>Rozpočet:</strong> ${data.budget}</p>` : ''}
            ${data.location ? `<p><strong>Lokalita:</strong> ${data.location}</p>` : ''}
            ${data.roomCount ? `<p><strong>Počet izieb:</strong> ${data.roomCount}</p>` : ''}
            ${data.propertyType ? `<p><strong>Typ nehnuteľnosti:</strong> ${data.propertyType}</p>` : ''}
            ${data.message ? `<p><strong>Správa:</strong><br/>${data.message}</p>` : ''}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Táto správa bola odoslaná z kontaktného formulára na vašej webovej stránke.
          </p>
        </div>
      `;

      customerSubject = 'Ďakujeme za Váš záujem o kúpu nehnuteľnosti';
      customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Ďakujeme za Váš záujem!</h2>
          <p>Vážený/á ${data.name},</p>
          <p>Ďakujeme za Váš záujem o kúpu nehnuteľnosti prostredníctvom našich služieb.</p>
          <p>Vašu žiadosť sme úspešne prijali a náš tým ju v najbližšom čase spracuje. Ozveme sa Vám čo najskôr s ďalšími informáciami a vhodnými ponukami nehnuteľností, ktoré zodpovedajú Vašim požiadavkám.</p>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Vaše požiadavky:</h3>
            ${data.budget ? `<p><strong>Rozpočet:</strong> ${data.budget}</p>` : ''}
            ${data.location ? `<p><strong>Lokalita:</strong> ${data.location}</p>` : ''}
            ${data.roomCount ? `<p><strong>Počet izieb:</strong> ${data.roomCount}</p>` : ''}
            ${data.propertyType ? `<p><strong>Typ nehnuteľnosti:</strong> ${data.propertyType}</p>` : ''}
          </div>

          <p>V prípade akýchkoľvek otázok nás neváhajte kontaktovať.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 5px 0;"><strong>Kontakt:</strong></p>
            <p style="margin: 5px 0;">Email: ${adminEmail}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            S pozdravom,<br/>
            Váš realitný tím
          </p>
        </div>
      `;
    } else if (data.type === 'sell') {
      adminSubject = '🏡 Nová žiadosť o predaj nehnuteľnosti';
      adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Nová žiadosť o predaj nehnuteľnosti</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Kontaktné informácie:</h3>
            <p><strong>Meno:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Telefón:</strong> ${data.phone}</p>` : ''}
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Informácie o nehnuteľnosti:</h3>
            ${data.propertyAddress ? `<p><strong>Adresa:</strong> ${data.propertyAddress}</p>` : ''}
            ${data.propertySize ? `<p><strong>Veľkosť:</strong> ${data.propertySize}</p>` : ''}
            ${data.yearBuilt ? `<p><strong>Rok stavby:</strong> ${data.yearBuilt}</p>` : ''}
            ${data.propertyCondition ? `<p><strong>Stav:</strong> ${data.propertyCondition}</p>` : ''}
            ${data.askingPrice ? `<p><strong>Požadovaná cena:</strong> ${data.askingPrice}</p>` : ''}
            ${data.message ? `<p><strong>Správa:</strong><br/>${data.message}</p>` : ''}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Táto správa bola odoslaná z kontaktného formulára na vašej webovej stránke.
          </p>
        </div>
      `;

      customerSubject = 'Ďakujeme za Váš záujem o predaj nehnuteľnosti';
      customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Ďakujeme za Váš záujem!</h2>
          <p>Vážený/á ${data.name},</p>
          <p>Ďakujeme za Váš záujem o predaj nehnuteľnosti prostredníctvom našich služieb.</p>
          <p>Vašu žiadosť sme úspešne prijali a náš tím ju v najbližšom čase spracuje. Ozveme sa Vám čo najskôr, aby sme prediskutovali ďalšie kroky a poskytli Vám profesionálne poradenstvo pri predaji Vašej nehnuteľnosti.</p>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Informácie o Vašej nehnuteľnosti:</h3>
            ${data.propertyAddress ? `<p><strong>Adresa:</strong> ${data.propertyAddress}</p>` : ''}
            ${data.propertySize ? `<p><strong>Veľkosť:</strong> ${data.propertySize}</p>` : ''}
            ${data.propertyCondition ? `<p><strong>Stav:</strong> ${data.propertyCondition}</p>` : ''}
            ${data.askingPrice ? `<p><strong>Požadovaná cena:</strong> ${data.askingPrice}</p>` : ''}
          </div>

          <p>V prípade akýchkoľvek otázok nás neváhajte kontaktovať.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 5px 0;"><strong>Kontakt:</strong></p>
            <p style="margin: 5px 0;">Email: ${adminEmail}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            S pozdravom,<br/>
            Váš realitný tím
          </p>
        </div>
      `;
    } else if (data.type === 'contact') {
      adminSubject = '📧 Nová správa z kontaktného formulára';
      adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Nová správa z kontaktného formulára</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Kontaktné informácie:</h3>
            <p><strong>Meno:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Telefón:</strong> ${data.phone}</p>` : ''}
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Správa:</h3>
            <p>${data.message || 'Žiadna správa'}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Táto správa bola odoslaná z kontaktného formulára na vašej webovej stránke.
          </p>
        </div>
      `;

      customerSubject = 'Ďakujeme za Vašu správu';
      customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C5A572;">Ďakujeme za Vašu správu!</h2>
          <p>Vážený/á ${data.name},</p>
          <p>Ďakujeme za Vašu správu. Vaša žiadosť bola úspešne prijatá a náš tím ju spracuje v najbližšom čase.</p>
          <p>Ozveme sa Vám do 24-48 hodín s odpoveďou na Vašu otázku alebo požiadavku.</p>

          <p>V prípade naliehavých záležitostí nás môžete kontaktovať priamo:</p>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Kontakt:</strong></p>
            <p style="margin: 5px 0;">Email: ${adminEmail}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            S pozdravom,<br/>
            Váš realitný tím
          </p>
        </div>
      `;
    }

    const emails = [
      {
        from: 'onboarding@resend.dev',
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      },
      {
        from: 'onboarding@resend.dev',
        to: data.email,
        subject: customerSubject,
        html: customerHtml,
      }
    ];

    const results = await Promise.all(
      emails.map(async (emailData) => {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(`Failed to send email to ${emailData.to}: ${error}`);
        }

        return res.json();
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails sent successfully',
        results
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending emails:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
