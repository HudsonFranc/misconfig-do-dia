---
titulo: "Usuário root sem autenticação em dois fatores"
provedor: aws
servico: IAM
dificuldade: iniciante
data:
---

## Cenário

Uma startup abriu a conta AWS 111122223333 com o e-mail do fundador. Esse e-mail e uma senha são o único jeito de entrar como usuário root, e o fundador usa esse acesso para tudo, inclusive para o trabalho do dia a dia. A conta não tem autenticação multifator (MFA) ativada.

O usuário root é o dono original da conta, com poder total e irrestrito.

## Pergunta

Isso é um problema? Por quê?

## Resposta

<details>
<summary>Ver resposta</summary>

**Sim, é um dos problemas mais graves possíveis.** O usuário root pode tudo: apagar recursos, mudar o plano de pagamento e até encerrar a conta, e algumas dessas ações não podem ser limitadas por políticas.

Sem MFA, quem descobrir a senha, por vazamento, golpe de phishing ou reaproveitamento de senha, consegue controle total. O MFA exige um segundo fator, como um aplicativo autenticador ou uma chave de segurança física, o que impede a invasão mesmo com a senha em mãos.

Além disso, usar o root no dia a dia aumenta as chances de a senha vazar. O ideal é proteger o root com MFA e usar identidades com permissões limitadas para o trabalho comum.

</details>

## Como detectar

```bash
aws iam get-account-summary \
  --query "SummaryMap.{MFARoot:AccountMFAEnabled,ChavesRoot:AccountAccessKeysPresent}"
```

Se `MFARoot` for `0`, o root não tem MFA. Se `ChavesRoot` for maior que `0`, existem chaves de acesso do root, o que também deve ser evitado. O AWS Security Hub e o Trusted Advisor mostram esse alerta no console.

## Como corrigir

1. Entre no console como root e ative o MFA para o usuário root (aplicativo autenticador ou chave de segurança). Essa etapa é feita pelo console.
2. Crie uma identidade para o uso diário, de preferência com o IAM Identity Center, ou um usuário IAM com MFA e permissões limitadas.
3. Passe a usar essa identidade no dia a dia e guarde o root apenas para as poucas tarefas que exigem ele.
4. Se existirem chaves de acesso do root, apague-as.

Guarde também de forma segura o acesso ao e-mail da conta, já que ele é o caminho de recuperação do root.

## Saiba mais

- [Boas práticas para o usuário root](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html)
- [Habilitar MFA para o usuário root](https://docs.aws.amazon.com/IAM/latest/UserGuide/enable-mfa-for-root.html)
