---
titulo: Security Group com SSH aberto para o mundo
servico: EC2
dificuldade: iniciante
data: 2024-01-16
---

## Cenário

Um Security Group chamado `sg-web-server` tem uma regra de entrada permitindo porta 22 (SSH) a partir de `0.0.0.0/0`.

## Pergunta

Isso é um problema?

## Resposta

<details>
<summary>Clique para revelar</summary>

Sim.

`0.0.0.0/0` significa **qualquer IP do mundo**. Porta 22 aberta assim deixa seu servidor exposto a tentativas de login SSH 24 horas por dia.

Servidores com SSH aberto recebem **milhares de tentativas por hora**, vindas de bots que varrem a internet. Se alguém usa senha fraca ou uma chave vazada, o servidor é comprometido em minutos.

A correção depende do caso:

- **Uso pessoal**: restrinja ao seu IP (`203.0.113.42/32`)
- **Uso corporativo**: use VPN ou AWS Systems Manager Session Manager, sem abrir a porta
- **Se precisar manter aberto**: chave SSH forte + fail2ban + autenticação só por chave (nunca senha)

</details>

## Como detectar

```bash
aws ec2 describe-security-groups \
  --group-ids sg-xxxxxxxx \
  --query 'SecurityGroups[].IpPermissions[?FromPort==`22`]'

  Como corrigir

  # Substitua SEU_IP pelo seu IP público
aws ec2 revoke-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp --port 22 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp --port 22 --cidr SEU_IP/32