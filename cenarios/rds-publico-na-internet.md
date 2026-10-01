---
titulo: "Banco de dados RDS acessível pela internet"
provedor: aws
servico: RDS
dificuldade: intermediario
data:
---

## Cenário

Uma equipe criou o banco de dados MySQL `exemplo-db` no Amazon RDS. Para conseguir consultar os dados do notebook, ativou a opção de acesso público e liberou a porta 3306 no grupo de segurança do banco:

```
PubliclyAccessible: true
Regra de entrada:   TCP 3306, origem 0.0.0.0/0
```

## Pergunta

Esse banco de dados está seguro? Por quê?

## Resposta

<details>
<summary>Ver resposta</summary>

**Não está seguro.** A opção de acesso público faz o banco receber um endereço alcançável pela internet, e a regra com origem `0.0.0.0/0` permite que qualquer pessoa tente se conectar à porta 3306.

Cada uma das duas configurações sozinha já é um risco, mas juntas deixam o banco totalmente exposto. O invasor ainda precisa de usuário e senha, mas fica livre para tentar adivinhá-los sem limite, e qualquer falha no mecanismo do banco vira porta de entrada.

Bancos de dados costumam guardar as informações mais valiosas do negócio. Normalmente só a aplicação precisa falar com eles, e ela pode estar na mesma rede privada.

</details>

## Como detectar

```bash
aws rds describe-db-instances \
  --query "DBInstances[].{ID:DBInstanceIdentifier,Publico:PubliclyAccessible}"
```

Instâncias com `Publico: true` merecem revisão. Depois, confira no grupo de segurança do banco se existe uma regra de entrada com origem `0.0.0.0/0`:

```bash
aws ec2 describe-security-groups --group-ids sg-0123456789abcdef0
```

## Como corrigir

Desative o acesso público e restrinja o grupo de segurança para aceitar conexões apenas do grupo de segurança da aplicação:

```bash
aws rds modify-db-instance \
  --db-instance-identifier exemplo-db \
  --no-publicly-accessible \
  --apply-immediately
```

Depois, troque a regra `0.0.0.0/0` por uma regra que tenha como origem o grupo de segurança da aplicação, e mantenha o banco em sub-redes privadas. Quem precisar consultar os dados de fora pode usar uma conexão por um servidor intermediário (bastion) ou o Session Manager, em vez de expor o banco. Avise a equipe antes: quem se conecta de fora vai perder o acesso.

## Saiba mais

- [Amazon RDS em uma VPC](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html)
