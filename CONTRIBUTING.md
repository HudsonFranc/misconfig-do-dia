# Como contribuir com o Misconfig do Dia

Obrigado pelo interesse! O Misconfig do Dia publica um cenário de má configuração em cloud por dia, em português, para quem está começando em segurança. O projeto cresce com a ajuda da comunidade, e há jeitos de contribuir para todos os níveis de experiência.

Ao contribuir, você concorda que seu trabalho será licenciado sob a [licença MIT](LICENSE) do projeto e que o texto enviado é original (não copiado de documentação, blogs ou cursos).

## Formas de contribuir

| Quero... | O que fazer |
| --- | --- |
| Sugerir uma ideia de cenário | Abra uma issue com o template **"Novo cenário"** |
| Escrever um cenário completo | Siga o passo a passo da seção 2 |
| Corrigir um erro pequeno (typo, comando desatualizado) | Abra um PR direto, sem precisar de issue |
| Revisar tecnicamente um cenário | Comente no PR ou abra uma issue com a label `revisao-tecnica` |
| Tirar uma dúvida | Abra uma issue com a label `duvida` |

### 1. Sugerir um cenário

Abra uma issue usando o template **"Novo cenário"** e descreva:

- O serviço (S3, IAM, EC2, RDS etc.)
- A situação: o que está mal configurado
- Por que isso é um problema

Você não precisa saber a correção. Identificar a situação já ajuda.

### 2. Escrever um cenário completo

1. Copie o template em `docs/template-cenario.md`.
2. Crie um arquivo em `cenarios/` usando **apenas o título em formato slug**, sem número: `seu-titulo.md`. O número de ordem é definido pelo mantenedor no momento do merge, para evitar conflitos entre PRs.
3. Regras para o nome do arquivo: letras minúsculas, números e hífens; sem acentos, espaços ou caracteres especiais. Exemplo: `bucket-s3-publico.md`.
4. Preencha todas as seções obrigatórias:
   - Frontmatter (veja o exemplo abaixo)
   - Cenário
   - Pergunta
   - Resposta (dentro de `<details>`)
   - Como detectar
   - Como corrigir
   - Saiba mais
5. Valide os comandos (veja a seção "Segurança ao testar").
6. Rode o projeto localmente para ver como o cenário aparece (veja "Pré-visualizar localmente").
7. Abra um Pull Request (PR) e preencha o checklist do template.

#### Exemplo de frontmatter

```yaml
---
titulo: "Bucket S3 com acesso público"
provedor: aws
servico: S3
dificuldade: iniciante   # valores aceitos: iniciante | intermediario | avancado
data:                    # opcional: sugira uma data ou deixe vazio
---
```

A data de publicação é definida pelo mantenedor, que organiza a ordem dos cenários. Se você sugerir uma data, ela pode ser ajustada.

### 3. Revisar cenários existentes

Se encontrar um erro técnico, ortográfico ou um comando desatualizado, abra um PR com a correção. Para mudanças pequenas, não é necessário abrir issue antes.

## Escopo: quais provedores entram

Os cenários atuais usam **AWS**. Cenários de Azure e GCP são bem-vindos, mas abra uma issue antes para combinarmos o formato e o campo `provedor` no frontmatter.

## Regras de estilo

- **Linguagem simples.** Explique qualquer termo técnico na primeira vez que ele aparecer.
- **Resposta com no máximo 5 parágrafos.** Se passar disso, divida em outro cenário.
- **Português do Brasil**, sem gírias regionais.
- **Sempre inclua** as seções "Como detectar" e "Como corrigir".
- **Termos em inglês** (como *bucket* e *policy*) são aceitos quando são o nome oficial do recurso. Na primeira menção, explique em português.

## Conteúdo seguro e sem dados reais

- **Não use dados reais** de empresas ou pessoas.
- Use sempre valores de exemplo: ID de conta `111122223333`, bucket `exemplo-bucket`, domínio `example.com`, IPs de documentação (`192.0.2.0/24`, `203.0.113.0/24`).
- **Nunca inclua credenciais**, nem as de exemplo que pareçam reais (chaves de acesso, tokens, senhas).
- Os cenários ensinam a **identificar e corrigir** erros de configuração. Não inclua passo a passo de exploração contra alvos reais.

## Segurança ao testar

- Teste comandos somente em uma **conta sandbox sua**, nunca em produção e nunca em recursos de terceiros.
- Prefira comandos de leitura (`describe`, `list`, `get`). Evite comandos destrutivos.
- Se for criar recursos para testar, configure um alerta de orçamento na conta e apague tudo ao terminar para evitar custos.
- Se não tiver uma conta de lab, confirme os comandos na documentação oficial do provedor.

## Qualidade técnica

- Em **"Saiba mais"**, inclua ao menos uma fonte oficial (documentação do provedor, CIS Benchmarks ou equivalente).
- Você pode usar ferramentas de IA para ajudar a escrever, mas **você é responsável por verificar** cada comando e cada afirmação técnica antes de abrir o PR.
- Cenários passam por revisão técnica antes de entrar. Se algo estiver impreciso, o revisor vai pedir ajustes no PR.

## Pré-visualizar localmente

O site é construído com Astro. Na raiz do projeto:

```bash
npm install
npm run dev
```

O servidor local abre em `http://localhost:4321`. Confira se o cenário aparece corretamente, em especial o bloco `<details>` da resposta. Antes de abrir o PR, rode também:

```bash
npm run build
```

## Antes de abrir o PR: checklist

- [ ] Arquivo em `cenarios/` com nome em slug (minúsculas e hífens)
- [ ] Frontmatter completo, com valores aceitos
- [ ] Todas as seções obrigatórias preenchidas
- [ ] Resposta com no máximo 5 parágrafos
- [ ] Apenas dados de exemplo, sem credenciais ou dados reais
- [ ] Comandos testados em sandbox ou conferidos na documentação oficial
- [ ] Pelo menos uma fonte oficial em "Saiba mais"
- [ ] `npm run build` passou sem erros

## O que acontece depois do PR

O mantenedor revisa o conteúdo e a parte técnica, podendo pedir ajustes. Costumo responder em alguns dias. Se passar de uma semana sem retorno, pode comentar no PR para me lembrar.

## Conduta

Seja respeitoso e paciente: muita gente aqui está aprendendo. Críticas devem ser sobre o conteúdo, de forma construtiva. Comportamento ofensivo ou discriminatório não será tolerado.

## Dúvidas

Abra uma issue com a label `duvida`.