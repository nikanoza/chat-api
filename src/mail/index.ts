import { Edge } from "edge.js";
import path, { join } from "path";
import mailTransport from "./edge";

const edge = new Edge({ cache: false });
const templatesPath = join(path.resolve(), "src/mail/templates");
edge.mount(templatesPath);

const send = (to: string, subject: string, html: any) => {
  const options = {
    to,
    subject,
    html,
    from: "",
  };

  return mailTransport.sendMail(options);
};

export const sendEmailVerification = async (
  to: string,
  hash: string,
  name: string,
  backLink: string
) => {
  const html = edge.renderSync("user-verify", {
    link: `${backLink}?hash=${hash}`,
    name,
  });

  return send(to, "Verify User", html);
};

export const sendPasswordRecovery = async (
  to: string,
  hash: string,
  name: string,
  backLink: string
) => {
  const html = edge.renderSync("password-recovery", {
    link: `${backLink}?hash=${hash}`,
    name,
  });

  return send(to, "Password Reset", html);
};
