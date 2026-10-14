/**
 * Where every form-submission notification goes. Configurable via the
 * NOTIFICATION_EMAIL env var; defaults to the site's only real mailbox.
 */
export const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL ?? "findchristianschools@gmail.com";

const NOTIFICATION_FROM =
  process.env.NOTIFICATION_FROM ??
  "FindChristianSchools <notifications@findchristianschools.com>";

// Email transport: a Resend API key (RESEND_API_KEY) — one env var, sent
// over HTTPS.
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendEmail(to: string | string[], subject: string, htmlBody: string) {
  if (!to || !subject || !htmlBody) return false;

  const recipients = Array.isArray(to) ? to : [to];
  const validRecipients = recipients.filter(r => r && r.includes("@"));

  if (validRecipients.length === 0) return false;

  try {
    if (RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: NOTIFICATION_FROM,
          to: validRecipients,
          subject,
          html: htmlBody,
        }),
      });
      if (!response.ok) {
        console.error("[Email] Resend send failed:", response.status, await response.text().catch(() => ""));
      }
      return response.ok;
    }

    console.error(
      "[Email] No email provider configured (set RESEND_API_KEY in the server environment). " +
      `Notification not sent: "${subject}" to ${validRecipients.join(", ")}`
    );
    return false;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

export type SubmissionFields = Record<string, string | number | boolean | null | undefined>;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * The one notification path for form submissions: emails the site admin
 * (NOTIFICATION_EMAIL, default findchristianschools@gmail.com) with the form
 * type, the key submitted fields, and a link to the relevant admin view.
 * Never throws — a mail failure must not fail the visitor's submission.
 */
export async function notifyAdminOfSubmission(
  type: string,
  fields: SubmissionFields,
  adminPath = "/admin"
): Promise<boolean> {
  try {
    const rows = Object.entries(fields)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(String(v)).replace(/\n/g, "<br>")}</td></tr>`
      )
      .join("");
    const html = `
      <h2>New Form Submission</h2>
      <p><strong>${escapeHtml(type)}</strong></p>
      <table>${rows}</table>
      <p><a href="https://www.findchristianschools.com${adminPath}">Review in Admin Panel</a></p>
    `;
    return await sendEmail(NOTIFICATION_EMAIL, `[FCS Form] ${type}`, html);
  } catch (error) {
    console.error("[Email] notifyAdminOfSubmission failed:", error);
    return false;
  }
}

export async function notifySchoolListing(school: any) {
  const recipients = [NOTIFICATION_EMAIL];
  if (school.contactEmail) recipients.push(school.contactEmail);

  const html = `
    <h2>New School Listing Submitted</h2>
    <p><strong>${school.name}</strong></p>
    <p><strong>Location:</strong> ${school.city}, ${school.stateCode}</p>
    <p><strong>Contact:</strong> ${school.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.com/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(recipients, "New School Listing: " + school.name, html);
}

export async function notifyClaimRequest(school: any, claimData: any) {
  const recipients = [NOTIFICATION_EMAIL];
  if (school.contactEmail) recipients.push(school.contactEmail);

  const html = `
    <h2>School Claim Request</h2>
    <p><strong>${school.name}</strong></p>
    <p><strong>Claimed by:</strong> ${claimData.contactName || "N/A"}</p>
    <p><strong>Email:</strong> ${claimData.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.com/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(recipients, "Claim Request: " + school.name, html);
}

export async function notifyRemovalRequest(school: any, removalData: any) {
  const recipients = [NOTIFICATION_EMAIL];
  if (school.contactEmail) recipients.push(school.contactEmail);

  const html = `
    <h2>School Removal Request</h2>
    <p><strong>${school.name}</strong></p>
    <p><strong>Reason:</strong> ${removalData.reason || "Not provided"}</p>
    <p><strong>Requested by:</strong> ${removalData.contactName || "N/A"}</p>
    <p><a href="https://findchristianschools.com/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(recipients, "Removal Request: " + school.name, html);
}

export async function notifyContactForm(contactData: any) {
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${contactData.name}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Phone:</strong> ${contactData.phone || "N/A"}</p>
    <p><strong>Message:</strong></p>
    <p>${(contactData.message || "").replace(/\n/g, "<br>")}</p>
    <p><a href="https://findchristianschools.com/admin">View in Admin Panel</a></p>
  `;

  return sendEmail(NOTIFICATION_EMAIL, "Contact Form: " + contactData.name, html);
}

/**
 * Delivers a parent's profile-page question ("Ask this school a question")
 * to a school that has claimed its listing. Only called when the school has
 * a contact email on file. sendEmail has no reply-to support, so the
 * parent's email is stated prominently at the top of the body and linked —
 * the school replies by writing to that address directly.
 * Returns true only when the mail provider accepted the send.
 */
export async function notifySchoolOfInquiry(
  school: { name: string; contactEmail: string },
  inquiry: {
    parentName: string;
    parentEmail: string;
    parentPhone?: string;
    childGrade?: string;
    message: string;
  }
): Promise<boolean> {
  const html = `
    <h2>A parent has a question about ${escapeHtml(school.name)}</h2>
    <p><strong>Reply to the parent directly at: <a href="mailto:${escapeHtml(inquiry.parentEmail)}">${escapeHtml(inquiry.parentEmail)}</a></strong></p>
    <table>
      <tr><td style="padding:4px 12px 4px 0;vertical-align:top;"><strong>From</strong></td><td>${escapeHtml(inquiry.parentName)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;vertical-align:top;"><strong>Email</strong></td><td>${escapeHtml(inquiry.parentEmail)}</td></tr>
      ${inquiry.parentPhone ? `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;"><strong>Phone</strong></td><td>${escapeHtml(inquiry.parentPhone)}</td></tr>` : ""}
      ${inquiry.childGrade ? `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;"><strong>Grade exploring</strong></td><td>${escapeHtml(inquiry.childGrade)}</td></tr>` : ""}
      <tr><td style="padding:4px 12px 4px 0;vertical-align:top;"><strong>Message</strong></td><td>${escapeHtml(inquiry.message).replace(/\n/g, "<br>")}</td></tr>
    </table>
    <p style="color:#666;font-size:12px;">This question was submitted on your school's FindChristianSchools.com profile page. Replying to the parent's email address above reaches them directly.</p>
  `;

  return sendEmail(
    school.contactEmail,
    `Parent question about ${school.name} via FindChristianSchools`,
    html
  );
}

export async function notifyPremiumPurchase(school: any, amount: number) {
  const recipients = [NOTIFICATION_EMAIL];
  if (school.contactEmail) recipients.push(school.contactEmail);

  const html = `
    <h2>Premium Listing Purchased</h2>
    <p><strong>${school.name}</strong></p>
    <p><strong>Amount:</strong> $${amount}</p>
    <p><strong>Expires:</strong> ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
    <p><a href="https://findchristianschools.com/admin">View in Admin Panel</a></p>
  `;

  return sendEmail(recipients, "Premium Listing: " + school.name, html);
}

export async function notifyDonation(donationData: any, amount: number) {
  const html = `
    <h2>New Donation Received</h2>
    <p><strong>Amount:</strong> $${amount}</p>
    <p><strong>Type:</strong> ${donationData.type === "monthly" ? "Monthly Recurring" : "One-time"}</p>
    <p><strong>Donor Email:</strong> ${donationData.email || "Anonymous"}</p>
    <p><strong>Message:</strong> ${donationData.message || "N/A"}</p>
    <p><a href="https://findchristianschools.com/admin">View in Admin Panel</a></p>
  `;

  return sendEmail(NOTIFICATION_EMAIL, "New Donation: $" + amount, html);
}

export async function notifyJobPosted(job: any) {
  const html = `
    <h2>New Job Posted</h2>
    <p><strong>Title:</strong> ${job.title}</p>
    <p><strong>School:</strong> ${job.schoolName || "N/A"}</p>
    <p><strong>Posted by:</strong> ${job.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.com/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(NOTIFICATION_EMAIL, "New Job Posting: " + job.title, html);
}

export async function notifyEventPosted(event: any) {
  const html = `
    <h2>New Event Posted</h2>
    <p><strong>Title:</strong> ${event.title}</p>
    <p><strong>Date:</strong> ${event.date || "N/A"}</p>
    <p><strong>Posted by:</strong> ${event.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.com/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(NOTIFICATION_EMAIL, "New Event: " + event.title, html);
}

export async function notifyCoursePosted(course: any) {
  const html = `
    <h2>New Course Posted</h2>
    <p><strong>Title:</strong> ${course.title}</p>
    <p><strong>Provider:</strong> ${course.provider || "N/A"}</p>
    <p><strong>Posted by:</strong> ${course.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.com/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(NOTIFICATION_EMAIL, "New Course: " + course.title, html);
}
