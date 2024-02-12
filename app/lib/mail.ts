interface MailEnv {
  MAIL_FROM: string;
  MAIL_TO: string;
  MAILTRAP_API_TOKEN?: string;
  MAILTRAP_INBOX_ID?: string;
  DKIM_KEY?: string;
}

export function send(subject: string, body: string, env: MailEnv) {
  if (process.env.NODE_ENV === "development") {
    // mailtrap
    return sendMailtrap(subject, body, env);
  } else {
    // mailchannels
    return sendMailchannels(subject, body, env);
  }
}

async function sendMailtrap(subject: string, body: string, env: MailEnv) {
  const to = {
    email: env.MAIL_TO,
  };
  const from = {
    email: env.MAIL_FROM,
  };

  const payload = {
    to: [to],
    from,
    subject,
    text: body,
  };

  return fetch(
    `https://sandbox.api.mailtrap.io/api/send/${env.MAILTRAP_INBOX_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${env.MAILTRAP_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    }
  );
}

function sendMailchannels(subject: string, body: string, env: MailEnv) {
  const to = {
    email: env.MAIL_TO,
  };
  const from = {
    email: env.MAIL_FROM,
  };
  const personalization = {
    to: [to],
    from,
    dkim_domain: env.MAIL_FROM.split("@")[1],
    dkim_selector: "mailchannels",
    dkim_private_key: env.DKIM_KEY,
  };
  const payload = {
    personalizations: [personalization],
    from,
    subject,
    content: [
      {
        type: "text/plain",
        value: body,
      },
    ],
  };
  return fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
}
