const archivos=["banco-urinario", "fuente", "autoevaluacion", "secciones", "epitelios", "observaciones", "sistemas", "regiones", "catalogo", "modelos"];
export const datos=Object.fromEntries(await Promise.all(archivos.map(async nombre=>{const r=await fetch("./data/"+nombre+".json");if(!r.ok)throw new Error("No se pudo cargar "+nombre+": HTTP "+r.status);return [nombre,await r.json()];})));
