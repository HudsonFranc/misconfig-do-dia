---
titulo: "Permissão do S3 para invocar o Lambda sem restringir a origem"
provedor: aws
servico: Lambda
dificuldade: avancado
data:
---

## Cenário

A função `processar-upload` deve ser acionada por novos arquivos no bucket `exemplo-bucket`, da conta 111122223333. Para o S3 poder chamá-la, a equipe adicionou esta permissão:

```bash
aws lambda add-permission \
  --function-name processar-upload \
  --statement-id s3-invoke \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com
```

## Pergunta

Há algum risco nessa permissão? Qual?

## Resposta

<details>
<summary>Ver resposta</summary>

**Sim.** A permissão diz que o serviço S3 pode invocar a função, mas não diz de qual bucket nem de qual conta. Isso vale para o S3 inteiro: um bucket de outra pessoa, em outra conta, também poderia ser configurado para acionar a função.

Esse tipo de problema é conhecido como "confused deputy" (deputado confuso): um serviço confiável é usado por terceiros para agir em nome de quem não deveria. O mesmo ocorre se o bucket original for apagado e alguém criar outro com o mesmo nome, porque o nome do bucket é global.

As consequências incluem execuções indesejadas da função, custos inesperados e, dependendo do que ela faz, processamento de dados que não são seus.

</details>

## Como detectar

```bash
aws lambda get-policy \
  --function-name processar-upload \
  --query Policy \
  --output text
```

Na política exibida, procure instruções com `"Principal": {"Service": "..."}` que não tenham um bloco `Condition` com `aws:SourceArn` ou `aws:SourceAccount`. Sem essas condições, a origem não está restrita.

## Como corrigir

Remova a permissão ampla e crie outra limitando o bucket e a conta de origem:

```bash
aws lambda remove-permission \
  --function-name processar-upload \
  --statement-id s3-invoke

aws lambda add-permission \
  --function-name processar-upload \
  --statement-id s3-invoke \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::exemplo-bucket \
  --source-account 111122223333
```

O `--source-arn` limita o bucket, e o `--source-account` garante que o dono dele é a sua conta. Confirme depois que as notificações do bucket continuam funcionando.

## Saiba mais

- [Políticas baseadas em recursos no Lambda](https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html)
- [O problema do "confused deputy"](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html)
