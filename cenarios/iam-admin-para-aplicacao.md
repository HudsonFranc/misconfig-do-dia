---
titulo: "Aplicação com permissão de administrador e chaves fixas"
provedor: aws
servico: IAM
dificuldade: intermediario
data:
---

## Cenário

Uma aplicação precisa gravar imagens em um bucket S3. Para "não perder tempo com erro de permissão", a equipe criou o usuário IAM `app-exemplo`, anexou a política `AdministratorAccess` e guardou a chave de acesso em um arquivo `.env` dentro do servidor:

```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=<chave secreta guardada no arquivo>
```

A política `AdministratorAccess` permite fazer qualquer ação em qualquer serviço da conta.

## Pergunta

Há algum problema nessa configuração? Qual?

## Resposta

<details>
<summary>Ver resposta</summary>

**Há dois problemas.** O primeiro é o excesso de permissões: a aplicação só precisa gravar em um bucket, mas pode criar usuários, apagar bancos de dados e mexer em qualquer recurso. Se alguém explorar uma falha da aplicação ou roubar a chave, terá controle total da conta.

O segundo é a chave de acesso fixa em um arquivo. Chaves de longa duração não expiram sozinhas, podem vazar em backups, logs ou repositórios, e ninguém percebe quando isso acontece.

O caminho mais seguro combina duas ideias: conceder apenas o mínimo necessário (menor privilégio) e preferir credenciais temporárias, entregues por uma função (role) do IAM anexada à instância, em vez de chaves fixas.

</details>

## Como detectar

Veja quais políticas e chaves o usuário tem:

```bash
aws iam list-attached-user-policies --user-name app-exemplo
aws iam list-access-keys --user-name app-exemplo
```

Se `AdministratorAccess` aparecer na primeira lista, ou se existirem chaves antigas na segunda, há motivo de atenção. O IAM Access Analyzer também ajuda: ele valida políticas e mostra permissões que nunca foram usadas.

## Como corrigir

1. Crie uma política que permita só o necessário, por exemplo apenas `s3:PutObject` no bucket `exemplo-bucket`.
2. Crie uma função (role) do IAM com essa política e anexe a função à instância. A aplicação passa a receber credenciais temporárias automaticamente, sem arquivo `.env`.
3. Depois de confirmar que a aplicação funciona, remova a permissão excessiva e a chave antiga:

```bash
aws iam detach-user-policy \
  --user-name app-exemplo \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

aws iam delete-access-key \
  --user-name app-exemplo \
  --access-key-id AKIAIOSFODNN7EXAMPLE
```

Se a chave já esteve em algum lugar público, considere-a comprometida e revise o que foi feito com ela nos logs da conta.

## Saiba mais

- [Boas práticas de segurança no IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Funções do IAM para o Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html)
