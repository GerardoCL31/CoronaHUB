import crypto from "crypto";

export const hashIp = (ip) => {
  const salt = process.env.IP_HASH_SALT || "";
  return crypto.createHash("sha256").update(`${ip}|${salt}`).digest("hex");
};
