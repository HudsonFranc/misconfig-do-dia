import fs from 'node:fs';
import path from 'node:path';

const CENARIOS_DIR = path.resolve('./cenarios');

export interface Cenario {
  slug: string;
  titulo: string;
  servico: string;
  dificuldade: string;
  data: string;
  conteudo: string;
}

export function listarCenarios(): Cenario[] {
  const arquivos = fs.readdirSync(CENARIOS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  return arquivos.map(arquivo => {
    const conteudo = fs.readFileSync(path.join(CENARIOS_DIR, arquivo), 'utf-8');

    const match = conteudo.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
      throw new Error(`Frontmatter inválido em ${arquivo}`);
    }

    const frontmatter: Record<string, string> = {};
    for (const linha of match[1].split('\n')) {
      const idx = linha.indexOf(':');
      if (idx === -1) continue;
      const chave = linha.slice(0, idx).trim();
      const valor = linha.slice(idx + 1).trim();
      if (chave && valor) frontmatter[chave] = valor;
    }

    return {
      slug: arquivo.replace('.md', ''),
      titulo: frontmatter.titulo ?? 'Sem título',
      servico: frontmatter.servico ?? '',
      dificuldade: frontmatter.dificuldade ?? '',
      data: frontmatter.data ?? '',
      conteudo: match[2],
    };
  });
}