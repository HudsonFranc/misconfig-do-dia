---
titulo: "Função Lambda com permissão de administrador"
provedor: aws
servico: Lambda
dificuldade: intermediario
data:
---

## Cenário

A função `redimensionar-imagens` é acionada quando uma foto chega ao bucket `exemplo-bucket-origem`: ela reduz a imagem e salva o resultado em `exemplo-bucket-destino`. Para evitar erros de permissão durante os testes, a equipe anexou a política `AdministratorAccess` à role de execução da função, que é a identidade que a função assume ao rodar.

```json
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}
```

## Pergunta

Isso é um problema? Por quê?

## Resposta

<details>
<summary>Ver resposta</summary>

**Sim.** A função só precisa ler de um bucket e gravar em outro, mas a role permite qualquer ação em qualquer serviço da conta.

O Lambda entrega ao código da função credenciais temporárias dessa role. Se alguém explorar uma falha da função, por exemplo uma imagem maliciosa que ative uma vulnerabilidade na biblioteca de processamento, essas credenciais ficam ao alcance do invasor. Com uma role de administrador, ele passa a controlar a conta inteira. Com uma role restrita, o estrago fica limitado aos dois buckets.

Esse é o princípio do menor privilégio: cada função recebe somente as permissões que realmente usa, e nada além.

</details>

## Como detectar

Descubra a role da função e veja o que está anexado a ela:

```bash
aws lambda get-function-configuration \
  --function-name redimensionar-imagens \
  --query Role

aws iam list-attached-role-policies --role-name redimensionar-imagens-role
aws iam list-role-policies --role-name redimensionar-imagens-role
```

Políticas como `AdministratorAccess`, `PowerUserAccess` ou qualquer uma com `"Action": "*"` e `"Resource": "*"` merecem revisão. O IAM Access Analyzer ajuda a identificar permissões que nunca foram usadas.

## Como corrigir

Crie uma política só com o necessário, salvando-a em um arquivo `politica.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::exemplo-bucket-origem/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::exemplo-bucket-destino/*"
    }
  ]
}
```

Depois, aplique essa política e remova a de administrador:

```bash
aws iam put-role-policy \
  --role-name redimensionar-imagens-role \
  --policy-name acesso-s3-minimo \
  --policy-document file://politica.json

aws iam detach-role-policy \
  --role-name redimensionar-imagens-role \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

Mantenha também a permissão básica para gravar logs no CloudWatch (política `AWSLambdaBasicExecutionRole`), senão a função deixa de registrar o que faz. Teste a função depois da troca.

## Saiba mais

- [Função de execução do AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)
- [Boas práticas de segurança no IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
