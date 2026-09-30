---
titulo: Título curto do cenário
servico: S3
dificuldade: iniciante
data: 2024-01-15
---

## Cenário

Descreva a situação em 2 ou 3 linhas. Ex: "Um bucket S3 chamado `minha-empresa-backup` tem ACL `public-read`."

## Pergunta

Isso é um problema? Por quê?

## Resposta

<details>
<summary>Clique para revelar</summary>

Explicação em linguagem simples. Máximo 5 parágrafos.

</details>

## Como detectar

```bash
aws s3api get-bucket-acl --bucket minha-empresa-backup

## Como corrigir

aws s3api put-public-access-block \
  --bucket minha-empresa-backup \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"