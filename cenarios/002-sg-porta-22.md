---
titulo: "Security Group com SSH aberto para o mundo"
provedor: aws
servico: EC2
dificuldade: iniciante
data: 2024-01-16
---

## Cenário

Um site roda em uma instância EC2 protegida pelo Security Group `web-server` (`sg-0123456789abcdef0`). Um Security Group funciona como um firewall virtual: ele define quem pode se conectar à instância e em quais portas. Estas são as regras de entrada:

```
TCP  80   origem 0.0.0.0/0
TCP  443  origem 0.0.0.0/0
TCP  22   origem 0.0.0.0/0
```

A origem `0.0.0.0/0` representa qualquer endereço IP da internet. A porta 22 é a do SSH, o acesso remoto ao terminal do servidor.

## Pergunta

Alguma dessas regras é um problema? Qual(is) e por quê?

## Resposta

<details>
<summary>Clique para revelar</summary>

**Sim, a da porta 22.** As portas 80 (HTTP) e 443 (HTTPS) abertas para todos são esperadas em um site público, porque os visitantes precisam acessá-lo. Já o SSH é um acesso administrativo: quem consegue entrar passa a controlar a máquina, e por isso ele não deveria estar disponível para o mundo todo.

Robôs varrem a internet o tempo todo atrás de portas SSH abertas, e é comum receber tentativas automáticas de login pouco depois de um servidor ficar no ar. Basta uma senha fraca, uma chave vazada ou uma falha no serviço para o servidor ser comprometido.

A solução depende do caso:

- **Uso pessoal:** restrinja a porta 22 ao seu IP (por exemplo, `203.0.113.10/32`). Lembre que IPs residenciais podem mudar.
- **Uso corporativo:** use uma VPN ou o AWS Systems Manager Session Manager, que dá acesso ao terminal sem abrir a porta 22 para ninguém.
- **Último recurso, se a porta precisar ficar mais aberta:** aceite só chave SSH (desative a senha) e limite as tentativas de login, com uma ferramenta como o fail2ban.

</details>

## Como detectar

Veja as regras de um grupo específico:

```bash
aws ec2 describe-security-groups \
  --group-ids sg-0123456789abcdef0 \
  --query "SecurityGroups[].IpPermissions"
```

Para encontrar todos os grupos da conta que liberam a porta 22 para qualquer origem IPv4:

```bash
aws ec2 describe-security-groups \
  --filters Name=ip-permission.from-port,Values=22 \
            Name=ip-permission.to-port,Values=22 \
            Name=ip-permission.cidr,Values=0.0.0.0/0 \
  --query "SecurityGroups[].{ID:GroupId,Nome:GroupName}"
```

Fique atento a três casos que esse filtro não pega sozinho: regras com origem IPv6 (`::/0`, filtro `ip-permission.ipv6-cidr`), regras que abrem uma faixa de portas que inclui a 22 (como `0-65535`) e regras com protocolo `-1` (todo o tráfego). O AWS Security Hub e o Trusted Advisor também alertam sobre portas administrativas abertas.

## Como corrigir

1. Descubra o seu IP público em [checkip.amazonaws.com](https://checkip.amazonaws.com).
2. Primeiro crie a regra restrita e confirme que você consegue conectar. Só depois remova a regra aberta, para não ficar sem acesso ao servidor:

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

Aqui `203.0.113.10/32` é um IP de exemplo: use o seu. Não mexa nas regras das portas 80 e 443, que precisam continuar abertas.

3. Para um ambiente de equipe, prefira o Session Manager. Ele exige o SSM Agent na instância e uma função do IAM com permissão para o Systems Manager, e depois disso a regra da porta 22 pode ser removida de vez.

## Saiba mais

- [Grupos de segurança do Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html)
- [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)