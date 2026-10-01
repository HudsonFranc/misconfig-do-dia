## O que este PR faz

<!-- Descreva em poucas linhas o que foi adicionado ou corrigido. -->

## Tipo de mudança

- [ ] Novo cenário
- [ ] Correção em cenário existente (erro técnico, ortografia, comando desatualizado)
- [ ] Documentação
- [ ] Site / código
- [ ] Outro:

## Issue relacionada

<!-- Ex.: Closes #12. Deixe em branco se não houver. -->

## Checklist

Se este PR **não** adiciona um cenário, marque apenas os itens que se aplicam.

**Cenário novo ou alterado**

- [ ] O arquivo está em `cenarios/` com nome em slug (minúsculas, números e hífens, sem acentos), sem número no início
- [ ] O frontmatter está completo, com valores aceitos em `provedor`, `servico` e `dificuldade`
- [ ] Todas as seções obrigatórias estão preenchidas: Cenário, Pergunta, Resposta (dentro de `<details>`), Como detectar, Como corrigir e Saiba mais
- [ ] A resposta tem no máximo 5 parágrafos
- [ ] A linguagem é simples e em português do Brasil, com os termos técnicos explicados
- [ ] Há pelo menos uma fonte oficial em "Saiba mais"

**Segurança e qualidade**

- [ ] Uso apenas dados de exemplo (`111122223333`, `exemplo-bucket`, `example.com`), sem dados reais
- [ ] Não há credenciais, tokens ou chaves, nem as que pareçam reais
- [ ] Os comandos foram testados em uma conta sandbox minha ou conferidos na documentação oficial
- [ ] Não há passo a passo de exploração contra alvos reais
- [ ] Verifiquei cada comando e afirmação técnica, inclusive se usei ferramentas de IA para escrever

**Geral**

- [ ] `npm run build` passou sem erros
- [ ] O texto é original e concordo em licenciá-lo sob a licença MIT do projeto

## Como testei

<!-- Ex.: rodei npm run dev e conferi o bloco <details>; testei os comandos AWS CLI em conta sandbox. -->

## Observações para a revisão

<!-- Dúvidas, pontos que merecem atenção do revisor técnico, links úteis. -->
