---
titulo: Bucket S3 com ACL público
servico: S3
dificuldade: iniciante
data: 2024-01-15
---

## Cenário

Você criou um bucket S3 chamado `minha-empresa-backup` para guardar arquivos de backup. Sem perceber, marcou a opção "Public read" ao criar.

## Pergunta

Isso é um problema?

## Resposta

<details>
<summary>Clique para revelar</summary>

Sim, e é grave.

Bucket público significa que **qualquer pessoa na internet** pode listar e baixar os arquivos, sem login. Se o backup contém dados de clientes, isso vira um vazamento — e no Brasil, um incidente de LGPD.

Atacantes varrem a internet procurando buckets abertos constantemente. Não é questão de "se", é de "quando" alguém encontra.

Regra prática: **por padrão, nenhum bucket deve ser público**. Se precisar servir arquivos publicamente (site estático, por exemplo), use CloudFront na frente.

</details>

## Como detectar

```bash
aws s3api get-bucket-acl --bucket minha-empresa-backup
# Procure por "AllUsers" ou "AuthenticatedUsers" nos Grants

## Como corrigir

aws s3api put-public-access-block \
  --bucket minha-empresa-backup \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"