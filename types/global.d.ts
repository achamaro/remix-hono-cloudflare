declare global {
  declare type Admin = {
    id: string;
  };

  declare type AppEnv = {
    BUCKET: R2Bucket;

    MAIL_FROM: string;
    MAIL_TO: string;

    BASIC_AUTH_USERNAME?: string;
    BASIC_AUTH_PASSWORD?: string;

    ADMIN_JWT_SECRET: string;
    ADMIN_CREDENTIALS: string;

    MAILTRAP_API_TOKEN: string;
    MAILTRAP_INBOX_ID: string;

    DKIM_KEY: string;
  };
}

export {};
