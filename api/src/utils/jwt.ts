import jwt from 'jsonwebtoken';

/**
 * Token signing key.
 *
 * This previously fell back to the literal string
 * 'fallback-secret-change-in-production' when JWT_SECRET was unset. Because that
 * string was committed to a public repository, any deployment missing the env var
 * was signing admin tokens with a publicly known key — meaning anyone could mint
 * a valid admin token and authorise every protected write endpoint.
 *
 * There is no safe default for a signing key, so a missing or weak one is now a
 * startup failure rather than a silent downgrade.
 */
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not set. Generate one with `openssl rand -base64 48` and set it ' +
      'in the environment before starting the API.',
  );
}

if (JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters.');
}

const JWT_EXPIRES_IN = '24h';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
