import {
  getLocalStorageItem,
  removeFromLocalStorage,
} from "../functions/local-storage";

export async function validateUserSession() {
  const token = getLocalStorageItem("token");
  const isAdmin = getLocalStorageItem("isAdmin");
  const sessionDate = getLocalStorageItem("session-date");

  const isValidSession = await validarFecha(sessionDate);
  const isTokenValid = await verifyTokenWithServer(token);

  if (!isValidSession || !token || !isTokenValid) {
    cleanupLocalStorage();
    return "none";
  }
  if (isAdmin) {
    return "admin";
  }
  if (isValidSession) {
    return "user";
  }
}

function verifyTokenWithServer(token: string) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(
        process.env.apiUrl + `Chat/GetAllActiveChats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        resolve(false);
      }

      resolve(response.ok);
    } catch (error) {
      resolve(false);
    }
  });
}

export async function cleanupLocalStorage() {
  const localStorageKeysToRemove = [
    "user_data",
    "token",
    "session-date",
    "isAdmin",
    "theme",
    "email-recovery",
    "user-id",
  ];

  localStorageKeysToRemove.forEach((key) => {
    removeFromLocalStorage(key);
  });
  return "none";
}

async function validarFecha(fechaString: string) {
  const fechaActual: any = new Date();
  const fechaIngresada: any = new Date(fechaString);
  const diferenciaEnMilisegundos = fechaActual - fechaIngresada;
  const diferenciaEnHoras = diferenciaEnMilisegundos / (1000 * 60 * 60);
  return diferenciaEnHoras <= 24;
}
