---
titulo: "Conta sem trilha do CloudTrail"
provedor: aws
servico: CloudTrail
dificuldade: iniciante
data:
---

## Cenário

Uma empresa percebe que uma chave de acesso foi criada na conta AWS 111122223333 e usada para subir servidores caros, e ninguém sabe quem fez isso. Ao investigar, descobre que nunca foi criada uma trilha no CloudTrail. O CloudTrail é o serviço que registra quem fez o quê na conta: criar usuários, abrir portas, apagar recursos e assim por diante.

## Pergunta

A conta estava configurada de forma segura? Por quê?

## Resposta

<details>
<summary>Ver resposta</summary>

**Não estava.** Mesmo sem uma trilha, o CloudTrail guarda no console um histórico de eventos de gerenciamento dos últimos 90 dias. Isso ajuda, mas é limitado: o histórico some depois desse período, não cobre todos os tipos de evento, não fica guardado em um lugar seu e não permite alertas.

Uma trilha envia os registros para um bucket S3, onde você controla a retenção, pode proteger os arquivos contra alteração e usar os dados em investigações e alertas. Para não deixar pontos cegos, a trilha deve cobrir todas as regiões, porque invasores costumam agir em regiões que ninguém usa.

Sem registros confiáveis, é difícil descobrir o que aconteceu, quando e por quem, e é difícil provar que o problema foi resolvido.

</details>

## Como detectar

```bash
aws cloudtrail describe-trails
aws cloudtrail get-trail-status --name exemplo-trilha
```

Se `describe-trails` voltar vazio, não há trilha. Se existir, confira no segundo comando se `IsLogging` está como `true`, e na saída do primeiro se `IsMultiRegionTrail` também está `true`.

## Como corrigir

Crie uma trilha que cubra todas as regiões, com validação de integridade dos arquivos, e comece a registrar:

```bash
aws cloudtrail create-trail \
  --name exemplo-trilha \
  --s3-bucket-name exemplo-bucket-logs \
  --is-multi-region-trail \
  --enable-log-file-validation

aws cloudtrail start-logging --name exemplo-trilha
```

O bucket de destino precisa de uma política que permita ao CloudTrail gravar nele. Se criar a trilha pelo console, o bucket e a política podem ser criados automaticamente. Mantenha esse bucket privado e bloqueie o acesso público.

## Saiba mais

- [Guia do usuário do AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
- [Criar uma trilha](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-create-and-update-a-trail.html)
