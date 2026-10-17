// Funciones extraídas con referencias explícitas al contexto compartido.
export function avisar(contextoModulo,texto) {
        clearTimeout(contextoModulo.toastTimer);
        contextoModulo.$("toast").textContent = texto;
        contextoModulo.$("toast").hidden = false;
        contextoModulo.toastTimer = setTimeout(() => contextoModulo.$("toast").hidden = true,4200);
      }
