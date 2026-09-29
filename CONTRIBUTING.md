# Como contribuir com o Misconfig do Dia

Obrigado pelo interesse! Este projeto cresce com contribuições da comunidade.

## Formas de contribuir

### 1. Sugerir um cenário

Abra uma issue usando o template **"Novo cenário"** e descreva:
- O serviço (S3, IAM, EC2, RDS, etc.)
- A situação (o que está mal configurado)
- Por que é um problema

Você não precisa saber a correção — só identificar a situação já ajuda.

### 2. Escrever um cenário completo

1. Copie o template em `docs/template-cenario.md`
2. Crie um arquivo em `cenarios/` com o próximo número: `006-seu-titulo.md`
3. Use **apenas letras minúsculas e hífens** no nome do arquivo
4. Preencha todas as seções obrigatórias:
   - Frontmatter (título, serviço, dificuldade, data)
   - Cenário
   - Pergunta
   - Resposta (dentro de `<details>`)
   - Como detectar
   - Como corrigir
   - Saiba mais
5. Teste os comandos AWS CLI (se tiver uma conta de lab) ou verifique na documentação oficial
6. Abra um Pull Request

### 3. Revisar cenários existentes

Se encontrar um erro técnico, ortográfico, ou um comando desatualizado, abra um PR corrigindo.

## Regras de estilo

- **Linguagem simples.** Sem jargão sem explicação.
- **Resposta com no máximo 5 parágrafos.** Se passar disso, divida em outro cenário.
- **Português do Brasil**, sem gírias regionais.
- **Sempre incluir** "Como detectar" e "Como corrigir".
- **Não use dados reais** de empresas ou pessoas.
- **Não teste comandos destrutivos** em contas de produção.

## Estrutura de um cenário

Veja `docs/template-cenario.md` para o formato completo.

## Dúvidas

Abra uma issue com a label `duvida`.