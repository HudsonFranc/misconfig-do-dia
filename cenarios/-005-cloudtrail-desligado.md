<<<<<<< HEAD
=======

>>>>>>> c9beaa25896fc227c7a6c2a848fd36e677a0fb99
---
titulo: CloudTrail desativado na conta
servico: CloudTrail
dificuldade: iniciante
data: 2024-01-19
---

## Cenário

Uma conta AWS não tem nenhum trail do CloudTrail ativo. Ou seja, chamadas de API não estão sendo registradas.

## Pergunta

Isso é um problema?

## Resposta

<details>
<summary>Clique para revelar</summary>

Sim, e é um problema **silencioso**.

CloudTrail registra **toda chamada de API** feita na conta: quem criou um bucket, quem deletou um usuário, de qual IP, a que hora. Sem ele, você fica cego.

Consequências práticas:

- Se alguém invadir a conta, você **não vai ter evidência** de como entrou nem o que fez
- Auditorias (LGPD, ISO, SOC 2) exigem logs de acesso — sem CloudTrail, você reprova
- Investigar incidentes vira adivinhação

CloudTrail na conta é **gratuito** para o primeiro trail por região, armazenando 90 dias de eventos. Não há motivo para não ativar.

Além disso, guarde os logs em um bucket S3 **com versionamento e bloqueio de exclusão** — se o atacante apagar os logs, você perde a evidência.

</details>

## Como detectar

```bash
aws cloudtrail describe-trails
# Se a lista vier vazia, não há trails configurados

aws cloudtrail get-trail-status --name meu-trail
# Verifique "IsLogging": true

Como corrigir
Crie um trail multi-região com log file validation:

aws cloudtrail create-trail \
  --name trail-principal \
  --s3-bucket-name meus-logs-cloudtrail \
  --is-multi-region-trail \
  --enable-log-file-validation

aws cloudtrail start-logging --name trail-principal