---
titulo: Usuário IAM sem MFA
servico: IAM
dificuldade: iniciante
data: 2024-01-17
---

## Cenário

Um usuário IAM chamado `joao.silva` tem acesso ao console AWS, mas não tem MFA (autenticação de dois fatores) habilitado.

## Pergunta

Isso é um problema?

## Resposta

<details>
<summary>Clique para revelar</summary>

Sim, e é um dos riscos mais comuns em contas AWS.

Sem MFA, tudo depende **apenas da senha**. Se a senha do João vazar — por phishing, reuso em outro site, ou um banco de dados comprometido — o atacante entra na conta AWS com as permissões dele.

Em contas onde o usuário tem permissões administrativas, isso é catastrófico: o atacante pode criar recursos, roubar dados, minerar criptomoedas na sua conta, e você só descobre na fatura.

MFA resolve isso porque exige um **segundo fator** (app autenticador, chave física ou SMS). Mesmo com a senha, o atacante não passa sem o segundo fator.

Regra prática: **todos os usuários IAM, sem exceção, devem ter MFA**.

</details>

## Como detectar

```bash
aws iam list-users --query 'Users[].UserName' --output text | \
  while read user; do
    mfa=$(aws iam list-mfa-devices --user-name "$user" --query 'MFADevices' --output text)
    [ -z "$mfa" ] && echo "SEM MFA: $user"
  done

  Como corrigir

  Acesse o console IAM → Users → joao.silva → Security credentials
  Clique em "Assign MFA device"
  Escolha "Authenticator app"
  Escaneie o QR code com Google Authenticator ou Authy
  Digite dois códigos consecutivos para confirmar