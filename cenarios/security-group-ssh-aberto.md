---
titulo: "Porta SSH aberta para o mundo inteiro"
provedor: aws
servico: EC2
dificuldade: iniciante
data:
---

## Cenário

Uma loja virtual hospeda o site em uma instância EC2 (`i-0123456789abcdef0`). Para acessar o servidor de casa, do celular e de um café, alguém liberou a porta 22 no grupo de segurança `sg-0123456789abcdef0`. O grupo de segurança funciona como um firewall virtual: ele decide quem pode se conectar à instância. A regra criada foi esta:

```
Tipo:      SSH
Protocolo: TCP
Porta:     22
Origem:    0.0.0.0/0
```

SSH é o acesso remoto ao terminal do servidor, e `0.0.0.0/0` representa qualquer endereço da internet.

## Pergunta

Essa configuração é segura? Por quê?

## Resposta

<details>
<summary>Ver resposta</summary>

**Não é segura.** Com a origem `0.0.0.0/0`, qualquer pessoa ou programa na internet pode tentar se conectar à porta 22 do servidor.

Isso não significa que alguém entre automaticamente, porque ainda é preciso ter a chave ou a senha. Mas robôs varrem a internet o tempo todo atrás de portas SSH abertas e começam a testar senhas e usuários comuns poucos minutos depois de o servidor aparecer. Basta uma senha fraca, uma chave vazada ou uma falha no serviço para o servidor inteiro ser comprometido.

A regra geral é expor somente o necessário, apenas para quem precisa. Quase nunca existe motivo para deixar o SSH aberto para todo mundo.

</details>

## Como detectar

Liste os grupos de segurança que liberam a porta 22 para qualquer origem:

```bash
aws ec2 describe-security-groups \
  --filters Name=ip-permission.from-port,Values=22 \
            Name=ip-permission.to-port,Values=22 \
            Name=ip-permission.cidr,Values=0.0.0.0/0 \
  --query "SecurityGroups[].{ID:GroupId,Nome:GroupName}"
```

Cada grupo que aparecer na lista tem o problema. Fique atento também a regras que abrem todas as portas (`0-65535`) para `0.0.0.0/0`, que não aparecem nesse filtro. No console, o AWS Trusted Advisor e o AWS Security Hub também apontam portas administrativas abertas.

## Como corrigir

Antes de remover a regra, tenha um jeito alternativo de acessar o servidor, para não ficar sem acesso. Uma opção é restringir a origem ao seu IP:

```bash
aws ec2 authorize-security-group-ingress \
  --group-id sg-0123456789abcdef0 \
  --protocol tcp --port 22 \
  --cidr 203.0.113.10/32

aws ec2 revoke-security-group-ingress \
  --group-id sg-0123456789abcdef0 \
  --protocol tcp --port 22 \
  --cidr 0.0.0.0/0
```

Aqui `203.0.113.10/32` é um IP de exemplo: use o IP fixo de quem realmente precisa acessar. Uma alternativa melhor ainda é usar o AWS Systems Manager Session Manager, que dá acesso ao terminal sem abrir a porta 22 para ninguém.

## Saiba mais

- [Grupos de segurança do Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html)
- [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
