/*
 * Autus Robotics — site configuration (single source of truth).
 * ---------------------------------------------------------------------------
 * ENQUIRY FORM — the owner's one-minute step to make the contact form deliver
 * messages straight to your inbox:
 *
 *   1. Go to  https://web3forms.com  and enter your email (info@autusrobotics.com).
 *      You will receive a free "Access Key" by email. No account, no password,
 *      no credit card.
 *   2. Paste that key between the quotes on the `web3formsAccessKey` line below.
 *   3. Commit and push. Done — enquiries now arrive by email.
 *
 * Until a key is configured, the form still works: it gracefully falls back to
 * opening the visitor's own email client (a mailto: draft to contactEmail), so
 * no enquiry is ever lost.
 * ---------------------------------------------------------------------------
 */
window.AUTUS_CONFIG = {
  form: {
    // Provider to use: 'web3forms' (default, recommended) or 'formspree'.
    provider: 'web3forms',

    // --- Web3Forms (default provider) --------------------------------------
    // Free and keyless-signup: get an Access Key at https://web3forms.com.
    // PASTE YOUR ACCESS KEY BETWEEN THE QUOTES (leave empty to use the
    // mailto: fallback):
    web3formsAccessKey: '',

    // --- Formspree (alternative provider) ----------------------------------
    // Create a form at https://formspree.io and paste its form ID — the part
    // after "/f/" in the endpoint URL, e.g. 'xdoqzabc'. Only used when
    // `provider` above is set to 'formspree'.
    formspreeFormId: '',

    // Inbox that enquiries should reach, and the target of the mailto: fallback.
    contactEmail: 'info@autusrobotics.com',

    // Subject line used for delivered enquiry emails.
    subject: 'New enquiry from autusrobotics.com'
  }
};
