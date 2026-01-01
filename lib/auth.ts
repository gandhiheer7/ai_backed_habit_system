// In production, this will verify Firebase tokens.
// In local dev, it returns a hardcoded "demo" user.

export async function getCurrentUser() {
  return {
    id: "demo_user_123",
    name: "Marcus Chen",
    role: "Managing Director"
  };
}