import { admin } from "../src/lib/firebase-admin";

export async function authenticateFirebaseToken(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}