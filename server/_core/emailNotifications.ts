import { invokeLLM } from "./llm";

const ADMIN_EMAIL = "dworiordan@icloud.com";
const NOTIFICATION_API = process.env.BUILT_IN_FORGE_API_URL;
const API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

export async function sendEmail(to: string | string[], subject: string, htmlBody: string) {
  if (!to || !subject || !htmlBody) return false;
  
  const recipients = Array.isArray(to) ? to : [to];
  const validRecipients = recipients.filter(r => r && r.includes("@"));
  
  if (validRecipients.length === 0) return false;

  try {
    const response = await fetch(`${NOTIFICATION_API}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        to: validRecipients,
        subject,
        html: htmlBody,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

export async function notifySchoolListing(school: any) {
  const recipients = [ADMIN_EMAIL];
  if (school.contactEmail) recipients.push(school.contactEmail);

  const html = `
    <h2>New School Listing Submitted</h2>
    <p><strong>${school.name}</strong></p>
    <p><strong>Location:</strong> ${school.city}, ${school.stateCode}</p>
    <p><strong>Contact:</strong> ${school.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.org/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(recipients, "New School Listing: " + school.name, html);
}

export async function notifyClaimRequest(school: any, claimData: any) {
  const recipients = [ADMIN_EMAIL];
  if (school.contactEmail) recipients.push(school.contactEmail);

  const html = `
    <h2>School Claim Request</h2>
    <p><strong>${school.name}</strong></p>
    <p><strong>Claimed by:</strong> ${claimData.contactName || "N/A"}</p>
    <p><strong>Email:</strong> ${claimData.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.org/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(recipients, "Claim Request: " + school.name, html);
}

export async function notifyRemovalRequest(school: any, removalData: any) {
  const recipients = [ADMIN_EMAIL];
  if (school.contactEmail) recipients.push(school.contactEmail);

  const html = `
    <h2>School Removal Request</h2>
    <p><strong>${school.name}</strong></p>
    <p><strong>Reason:</strong> ${removalData.reason || "Not provided"}</p>
    <p><strong>Requested by:</strong> ${removalData.contactName || "N/A"}</p>
    <p><a href="https://findchristianschools.org/admin">Review in Admin Panel</a></p>
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
    <p><a href="https://findchristianschools.org/admin">View in Admin Panel</a></p>
  `;

  return sendEmail(ADMIN_EMAIL, "Contact Form: " + contactData.name, html);
}

export async function notifyPremiumPurchase(school: any, amount: number) {
  const recipients = [ADMIN_EMAIL];
  if (school.contactEmail) recipients.push(school.contactEmail);

  const html = `
    <h2>Premium Listing Purchased</h2>
    <p><strong>${school.name}</strong></p>
    <p><strong>Amount:</strong> $${amount}</p>
    <p><strong>Expires:</strong> ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
    <p><a href="https://findchristianschools.org/admin">View in Admin Panel</a></p>
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
    <p><a href="https://findchristianschools.org/admin">View in Admin Panel</a></p>
  `;

  return sendEmail(ADMIN_EMAIL, "New Donation: $" + amount, html);
}

export async function notifyJobPosted(job: any) {
  const html = `
    <h2>New Job Posted</h2>
    <p><strong>Title:</strong> ${job.title}</p>
    <p><strong>School:</strong> ${job.schoolName || "N/A"}</p>
    <p><strong>Posted by:</strong> ${job.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.org/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(ADMIN_EMAIL, "New Job Posting: " + job.title, html);
}

export async function notifyEventPosted(event: any) {
  const html = `
    <h2>New Event Posted</h2>
    <p><strong>Title:</strong> ${event.title}</p>
    <p><strong>Date:</strong> ${event.date || "N/A"}</p>
    <p><strong>Posted by:</strong> ${event.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.org/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(ADMIN_EMAIL, "New Event: " + event.title, html);
}

export async function notifyCoursePosted(course: any) {
  const html = `
    <h2>New Course Posted</h2>
    <p><strong>Title:</strong> ${course.title}</p>
    <p><strong>Provider:</strong> ${course.provider || "N/A"}</p>
    <p><strong>Posted by:</strong> ${course.contactEmail || "N/A"}</p>
    <p><a href="https://findchristianschools.org/admin">Review in Admin Panel</a></p>
  `;

  return sendEmail(ADMIN_EMAIL, "New Course: " + course.title, html);
}
