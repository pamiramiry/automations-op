import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, business, email, phone, message } = await request.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ ok: false, error: "Name and email are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Automations OP <onboarding@resend.dev>",
      to: import.meta.env.NOTIFY_EMAIL ?? "pamiramiry10@gmail.com",
      subject: `New lead from your website — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
          <div style="margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 8px 16px; border-radius: 999px;">
              <span style="color: white; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">New Website Lead</span>
            </div>
          </div>

          <h2 style="margin: 0 0 4px; color: #0f172a; font-size: 20px;">New Contact Form Submission</h2>
          <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">Someone filled out the contact form on your website.</p>

          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; width: 130px; background: #f8fafc;">Name</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px; font-weight: 500;">${name}</td>
            </tr>
            ${business ? `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #f8fafc;">Business</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px; font-weight: 500;">${business}</td>
            </tr>` : ""}
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #f8fafc;">Email</td>
              <td style="padding: 12px 16px; font-size: 14px;"><a href="mailto:${email}" style="color: #4f46e5; font-weight: 500;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #f8fafc;">Phone</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px; font-weight: 500;"><a href="tel:${phone}" style="color: #4f46e5; font-weight: 500;">${phone}</a></td>
            </tr>` : ""}
            ${message ? `
            <tr>
              <td style="padding: 12px 16px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #f8fafc; vertical-align: top;">Message</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</td>
            </tr>` : ""}
          </table>

          <p style="margin: 24px 0 0; color: #94a3b8; font-size: 12px;">
            Sent from <strong>automationsop.com</strong> contact form.
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return new Response(JSON.stringify({ ok: false, error: "Failed to send message." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
