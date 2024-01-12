import axios from "axios";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const getServerHeader = (cookies: () => ReadonlyRequestCookies) => {
  try {
    const cookiesString = cookies().toString();

    return { Cookie: cookiesString };
  } catch {
    return {};
  }
};

const ServerBackendRequest = (cookies: () => ReadonlyRequestCookies) =>
  axios.create({
    baseURL: process.env.BACKEND_ROUTE || process.env.NEXT_PUBLIC_BACKEND_ROUTE,
    timeout: 3000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Authorization: "token <your-token-here>",
      ...getServerHeader(cookies),
    },
    withCredentials: true,
  });

export default ServerBackendRequest;
