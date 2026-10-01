---
titulo: Credencial AWS commitada no GitHub
servico: IAM
dificuldade: iniciante
data: 2024-01-18
---

## Cenário

Um desenvolvedor rodou `git add .` sem revisar e commitou um arquivo `.env` contendo `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`.

## Pergunta

Isso é um problema? E remover o arquivo depois resolve?

## Resposta

<details>
<summary>Clique para revelar</summary>

Sim, é crítico — e **remover o arquivo depois NÃO resolve**.

Motivo: o Git guarda todo o histórico. Mesmo que você delete o `.env` no próximo commit, qualquer pessoa pode rodar `git log` e ver o commit antigo com a chave.

Além disso, existem **bots** que varrem o GitHub em tempo real procurando chaves AWS. Uma chave exposta em repositório público é **usada em minutos** — normalmente para minerar criptomoedas na sua conta.

O que fazer, na ordem:

1. **Rotacione a chave imediatamente** no console IAM (desative a antiga, crie uma nova)
2. Limpe o histórico do Git (`git filter-repo` ou BFG Repo-Cleaner)
3. Adicione `.env` ao `.gitignore`
4. Use `git-secrets` ou pre-commit hooks para prevenir no futuro

Rotacionar primeiro é essencial: limpar o histórico depois é inútil se a chave continua ativa.

</details>

## Como detectar

Procure padrões em todo o histórico:

```bash
git log -p | grep -iE 'AKIA[0-9A-Z]{16}'

Ou use ferramentas como gitleaks:

gitleaks detect --source .

Como corrigir

Rotacione a chave no console IAM (Security credentials → Access keys → Deactivate → Delete)
Remova do histórico com git filter-repo:

pip install git-filter-repo
git filter-repo --path .env --invert-paths
git push --force

Adicione ao .gitignore:

.env
*.pem
credentials

Instale um hook de proteção:

pip install pre-commit
# .pre-commit-config.yaml com gitleaks

