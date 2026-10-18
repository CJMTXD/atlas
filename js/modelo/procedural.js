// Conserva el orden de creación del respaldo original.
import {crear_piel_1} from './sistemas/piel-base.js';
import {crear_muscular_1} from './sistemas/muscular-base.js';
import {crear_esqueletico_1} from './sistemas/esqueletico-base.js';
import {crear_circulatorio_1} from './sistemas/circulatorio-base.js';
import {crear_nervioso_1} from './sistemas/nervioso-base.js';
import {crear_respiratorio_1} from './sistemas/respiratorio-base.js';
import {crear_digestivo_1} from './sistemas/digestivo-base.js';
import {crear_urinario_1} from './sistemas/urinario-base.js';
import {crear_linfatico_1} from './sistemas/linfatico-base.js';
import {crear_endocrino_1} from './sistemas/endocrino-base.js';
export function crearProcedural(contextoModulo){
crear_piel_1(contextoModulo);
crear_muscular_1(contextoModulo);
crear_esqueletico_1(contextoModulo);
crear_circulatorio_1(contextoModulo);
crear_nervioso_1(contextoModulo);
crear_respiratorio_1(contextoModulo);
crear_digestivo_1(contextoModulo);
crear_urinario_1(contextoModulo);
crear_linfatico_1(contextoModulo);
crear_endocrino_1(contextoModulo);
}
