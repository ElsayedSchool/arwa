import api from "./api";

type RawAuthResponse = unknown;

export interface AuthResult {
  token: string;
  refreshToken?: string;
  isProfileInit?: boolean;
  isEmailVerified?: boolean;
}

function extractAuthResult(resp: RawAuthResponse): AuthResult | null {
  // Normalize potential wrapper shapes
  const r = (resp ?? {}) as Record<string, unknown>;
  const d1 = (r.data ?? r) as Record<string, unknown>;
  const d2 = (d1.data ?? d1) as Record<string, unknown>;
  if (typeof d2.token === "string") {
    return {
      token: d2.token as string,
      refreshToken: d2.refreshToken as string | undefined,
      isProfileInit: d2.isProfileInit as boolean | undefined,
      isEmailVerified: d2.isEmailVerified as boolean | undefined,
    };
  }
  return null;
}

export async function loginWithCredentials(
  username: string,
  password: string
): Promise<AuthResult> {
  const { data } = await api.post("/authentication/login/credential", {
    username,
    password,
  });
  const parsed = extractAuthResult(data) || extractAuthResult({ data });
  if (!parsed || !parsed.token) {
    throw new Error("Invalid login response");
  }
  return parsed;
}
