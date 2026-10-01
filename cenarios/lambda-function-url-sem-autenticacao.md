---
titulo: "Function URL do Lambda sem autenticação"
provedor: aws
servico: Lambda
dificuldade: intermediario
data:
---

## Cenário

Uma equipe criou a função `exportar-relatorio`, que gera um relatório com dados de clientes. Para chamá-la rapidamente a partir de outro sistema, ativou uma Function URL, que é um endereço HTTPS que executa a função diretamente. Na configuração, escolheu o tipo de autenticação `NONE`:

```json
{
  "FunctionUrl": "https://exemplo.lambda-url.us-east-1.on.aws/",
  "AuthType": "NONE"
}
```

## Pergunta

Essa função está protegida? Por quê?

## Resposta

<details>
<summary>Ver resposta</summary>

**Não está.** Com `AuthType` igual a `NONE`, qualquer pessoa que souber ou descobrir o endereço pode chamar a função, sem usuário, senha ou chave. O endereço parece difícil de adivinhar, mas ele não é um segredo: pode aparecer em logs, no código do outro sistema, em histórico de navegador ou em mensagens.

Como essa função devolve dados de clientes, o resultado é um vazamento direto de informações. Mesmo que não devolvesse nada sensível, chamadas em excesso gerariam custo e consumiriam o limite de execuções da conta.

Uma URL pública só faz sentido quando o objetivo é realmente ser público, como um webhook ou uma página aberta, e mesmo assim a função deve validar o que recebe.

</details>

## Como detectar

```bash
aws lambda get-function-url-config --function-name exportar-relatorio
```

Se `AuthType` for `NONE`, a função é acessível sem autenticação. Veja também a política de acesso da função, que contém a permissão pública de invocação:

```bash
aws lambda get-policy --function-name exportar-relatorio
```

Procure uma instrução com `"Principal": "*"` e a ação `lambda:InvokeFunctionUrl`.

## Como corrigir

Troque o tipo de autenticação para IAM, de modo que só chamadas assinadas por uma identidade autorizada funcionem:

```bash
aws lambda update-function-url-config \
  --function-name exportar-relatorio \
  --auth-type AWS_IAM
```

Remova também a permissão pública. O `statement-id` aparece na saída do `get-policy`, e o nome abaixo é apenas um exemplo comum:

```bash
aws lambda remove-permission \
  --function-name exportar-relatorio \
  --statement-id FunctionURLAllowPublicAccess
```

Depois, dê permissão `lambda:InvokeFunctionUrl` apenas à identidade do sistema que precisa chamar a função. Outra opção é colocar a função atrás do Amazon API Gateway, com um mecanismo de autenticação.

## Saiba mais

- [Controlar o acesso às Function URLs do Lambda](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html)
