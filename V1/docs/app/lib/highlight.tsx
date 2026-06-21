import type { ReactNode } from 'react';
import type { Entrada } from './glossario';
import Tooltip from '@/components/Tooltip';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Para termos alfabéticos exige fronteira de palavra; para entradas com
 * dígitos/símbolos (números, ex.: "p = 0,49") casa literal sem \b
 * (que não funciona bem com vírgula/espaço).
 */
function padraoDe(texto: string): string {
  const esc = escapeRegex(texto);
  const alfabetico = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ /-]*$/.test(texto);
  return alfabetico ? `\\b${esc}\\b` : esc;
}

/**
 * Envolve no texto cada termo/número conhecido num <Tooltip>.
 * Casa no máximo UMA vez por entrada por bloco (evita poluir o slide).
 * Preserva quebras de linha (usado dentro de whitespace-pre-wrap).
 */
export function destacar(texto: string, entradas: Entrada[]): ReactNode[] {
  // Constrói um único regex com alternância, já em ordem longest-first.
  const partes = entradas.map((e) => padraoDe(e.texto));
  if (partes.length === 0) return [texto];
  const re = new RegExp(`(${partes.join('|')})`, 'gi');

  const usados = new Set<string>();
  // Mapa rápido de match normalizado → entrada.
  const porTexto = new Map<string, Entrada>();
  for (const e of entradas) porTexto.set(e.texto.toLowerCase(), e);

  const out: ReactNode[] = [];
  let ultimo = 0;
  let m: RegExpExecArray | null;
  let chave = 0;

  while ((m = re.exec(texto)) !== null) {
    const achado = m[0];
    const ent = porTexto.get(achado.toLowerCase()) ?? acharEntrada(achado, entradas);
    if (!ent) continue;
    const idEnt = ent.texto.toLowerCase();
    if (usados.has(idEnt)) continue; // só a 1ª ocorrência de cada entrada
    usados.add(idEnt);

    if (m.index > ultimo) out.push(texto.slice(ultimo, m.index));
    out.push(
      <Tooltip key={`t${chave++}`} texto={achado} conteudo={ent.conteudo} tipo={ent.tipo} />,
    );
    ultimo = m.index + achado.length;
  }
  if (ultimo < texto.length) out.push(texto.slice(ultimo));
  return out;
}

function acharEntrada(achado: string, entradas: Entrada[]): Entrada | undefined {
  const a = achado.toLowerCase();
  return entradas.find((e) => e.texto.toLowerCase() === a);
}
