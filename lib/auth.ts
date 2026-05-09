import { auth, currentUser } from "@clerk/nextjs/server";

export async function requireAdminAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Acceso denegado: No autenticado en la capa de red.");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("Acceso denegado: No autenticado.");
  }

  const allowedEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  const isAuthorized = user.emailAddresses.some(
    (email) => allowedEmails.includes(email.emailAddress)
  );

  if (!isAuthorized) {
    throw new Error("Acceso denegado: Operación restringida solo para administradores.");
  }

  return user.id;
}
