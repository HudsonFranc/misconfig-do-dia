---
titulo: "Senha do banco em variável de ambiente do Lambda"
provedor: aws
servico: Lambda
dificuldade: iniciante
data:
---

## Cenário

A função Lambda `processar-pedidos` precisa se conectar a um banco de dados. Para simplificar, a equipe guardou os dados de conexão, inclusive a senha, nas variáveis de ambiente da função:

```
DB_HOST=exemplo-db.example.com
DB_USUARIO=app
DB_SENHA=senha-de-exemplo
```

Variáveis de ambiente são valores de configuração que o código da função lê quando executa.

## Pergunta

Guardar a senha dessa forma é seguro? Por quê?

## Resposta

<details>
<summary>Ver resposta</summary>

**Não é a melhor prática.** O Lambda criptografa as variáveis de ambiente quando elas estão armazenadas, mas o valor aparece em texto puro para qualquer pessoa ou ferramenta que tenha permissão de ler a configuração da função, e também no console.

Na prática, isso significa que quem só precisava "ver a função" acaba vendo a senha do banco. O valor também costuma vazar por outros caminhos: modelos de infraestrutura versionados no Git, capturas de tela e mensagens de erro ou logs que imprimem a configuração.

Um serviço próprio para segredos, como o AWS Secrets Manager, permite controlar com precisão quem lê cada segredo, registra cada acesso no CloudTrail e facilita trocar a senha periodicamente sem alterar o código.

</details>

## Como detectar

Veja as variáveis de ambiente de uma função:

```bash
aws lambda get-function-configuration \
  --function-name processar-pedidos \
  --query "Environment.Variables"
```

Procure nomes como `SENHA`, `PASSWORD`, `TOKEN`, `SECRET` ou `KEY`. Para revisar todas as funções da conta, rode o comando `aws lambda list-functions --query "Functions[].FunctionName"` e repita a consulta para cada uma.

## Como corrigir

1. Guarde o segredo no Secrets Manager, usando um arquivo temporário para não deixar a senha no histórico do terminal (apague o arquivo depois):

```bash
aws secretsmanager create-secret \
  --name exemplo/banco \
  --secret-string file://segredo.json
```

2. Dê à função de execução permissão de leitura apenas desse segredo (`secretsmanager:GetSecretValue`).
3. Altere o código para buscar o segredo ao iniciar e reaproveitá-lo nas execuções seguintes.
4. Remova a senha das variáveis de ambiente. Esse comando substitui todas as variáveis, então liste as que devem continuar:

```bash
aws lambda update-function-configuration \
  --function-name processar-pedidos \
  --environment "Variables={DB_HOST=exemplo-db.example.com,DB_USUARIO=app}"
```

5. Troque a senha do banco, já que a antiga ficou exposta na configuração.

## Saiba mais

- [Usar variáveis de ambiente no AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)
- [Usar segredos do Secrets Manager em funções Lambda](https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets_lambda.html)
