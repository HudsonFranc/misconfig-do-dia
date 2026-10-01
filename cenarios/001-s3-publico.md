---
titulo: "Bucket S3 com ACL público"
provedor: aws
servico: S3
dificuldade: iniciante
data: 2024-01-15
---

## Cenário

Uma empresa criou o bucket S3 `exemplo-backup` para guardar arquivos de backup do sistema. Para facilitar o acesso de um fornecedor, alguém desativou o bloqueio de acesso público do bucket, habilitou as ACLs (listas de controle de acesso, um mecanismo antigo de permissões) e marcou a opção de leitura pública ("Public read"). Os arquivos foram enviados com a mesma permissão. O console exige confirmar que a pessoa entende o risco, e ela confirmou sem ler.

O resultado, visto na ACL do bucket, é este:

```json
{
  "Grantee": {
    "Type": "Group",
    "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
  },
  "Permission": "READ"
}
```

## Pergunta

Isso é um problema? Por quê?

## Resposta

<details>
<summary>Clique para revelar</summary>

**Sim, e é grave.** O grupo `AllUsers` representa qualquer pessoa na internet, sem login. Com leitura pública, qualquer um pode listar os arquivos do bucket e baixar os que estiverem com permissão pública.

Backups costumam conter dados sensíveis, como informações de clientes. Se houver dados pessoais, o caso deve ser tratado como um incidente de segurança, sujeito à LGPD, e a empresa precisa avaliar se houve acesso indevido e se é necessário comunicar os envolvidos.

Existem ferramentas e pessoas que varrem a internet em busca de buckets abertos, e o nome de um bucket pode ser descoberto em links, códigos e vazamentos. Basta que alguém o encontre.

Por isso a regra é: **por padrão, nenhum bucket deve ser público**. Desde 2023, buckets novos já nascem com o bloqueio de acesso público ativo e com as ACLs desativadas, e foi preciso desligar essas proteções para chegar a esse cenário. Se for necessário servir arquivos ao público (um site estático, por exemplo), use o CloudFront na frente e mantenha o bucket privado.

</details>

## Como detectar

```bash
aws s3api get-bucket-acl --bucket exemplo-backup
aws s3api get-public-access-block --bucket exemplo-backup
aws s3api get-bucket-policy-status --bucket exemplo-backup
```

- **ACL:** procure `Grants` com o grupo `AllUsers` (qualquer pessoa) ou `AuthenticatedUsers` (qualquer pessoa com uma conta AWS, de qualquer empresa, e não só a sua).
- **Bloqueio de acesso público:** se algum dos quatro valores aparecer como `false`, a proteção está desligada.
- **Política do bucket:** `IsPublic: true` indica que a política deixa o bucket público. Se o bucket não tiver política, esse comando retorna um erro de política inexistente, o que é normal.

Para ver a configuração da conta inteira, use `aws s3control get-public-access-block --account-id 111122223333`. O IAM Access Analyzer também mostra os buckets com acesso externo.

## Como corrigir

1. Corte o acesso público imediatamente:

```bash
aws s3api put-public-access-block \
  --bucket exemplo-backup \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

2. Volte a ACL para privada e desative as ACLs de vez, para que as permissões passem a ser controladas só por políticas do IAM e do bucket. Antes, confirme que nenhuma aplicação depende de ACLs:

```bash
aws s3api put-bucket-acl --bucket exemplo-backup --acl private

aws s3api put-bucket-ownership-controls \
  --bucket exemplo-backup \
  --ownership-controls "Rules=[{ObjectOwnership=BucketOwnerEnforced}]"
```

3. Verifique se houve acesso indevido, usando os logs de acesso do S3 ou os eventos de dados do CloudTrail, se estiverem ativados. Se o bucket tinha dados pessoais, avise o responsável por segurança e privacidade da empresa.
4. Para o fornecedor, em vez de deixar o bucket público, gere um link temporário de download:

```bash
aws s3 presign s3://exemplo-backup/arquivo.zip --expires-in 3600
```

Para evitar que o problema se repita, ative o bloqueio de acesso público no nível da conta, depois de conferir que nenhum outro bucket precisa ser público.

## Saiba mais

- [Bloquear o acesso público ao Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html)
- [Controlar a propriedade de objetos e desativar as ACLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html)
- [Compartilhar objetos com URLs pré-assinadas](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- [Restringir o acesso a uma origem S3 com o CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)