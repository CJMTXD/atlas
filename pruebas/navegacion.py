"""Acceso a actividades a través del menú por apartados."""
def abrir_modo(pagina, modo):
 area='exploracion' if modo in ['ruta','fisiologia','comparar','herramientas'] else 'progreso' if modo in ['estadisticas','errores','auto','notas','importador','transferencias'] else 'estudio'
 pagina.locator('[data-area="'+area+'"]').click()
 pagina.locator('[data-mode="'+modo+'"]').click()
