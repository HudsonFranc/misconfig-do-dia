---
# TEMPLATE DE CENÁRIO
# Copie este arquivo para cenarios/ com o nome em slug, sem número:
#   cenarios/bucket-s3-publico.md
# Regras do nome: minúsculas, números e hífens; sem acentos nem espaços.
# O número de ordem é definido pelo mantenedor no merge.
# Apague todos os comentários (linhas com # no frontmatter e blocos <!-- -->) antes de abrir o PR.

titulo: "Título curto e direto"        # Ex.: "Bucket S3 com acesso público"
provedor: aws                          # aws | azure | gcp (para azure/gcp, abra uma issue antes)
servico: S3                            # Ex.: S3, IAM, EC2, RDS, Security Groups
dificuldade: iniciante                 # iniciante | intermediario | avancado
data:                                  # opcional: sugira uma data ou deixe vazio; o mantenedor decide
---

## Cenário

<!--
Descreva a situação como um caso real, em 2 a 4 frases.
- Linguagem simples; explique qualquer termo técnico na primeira vez que aparecer.
- Use apenas dados de exemplo: conta 111122223333, bucket exemplo-bucket,
  domínio example.com, IPs 192.0.2.0/24 ou 203.0.113.0/24.
- Nunca inclua dados reais de empresas ou pessoas, nem credenciais (nem as de exemplo que pareçam reais).
- Se ajudar, inclua um trecho curto de configuração (JSON, YAML ou saída de comando).
- Não revele aqui se está certo ou errado.
-->

## Pergunta

<!--
Uma pergunta objetiva que faça a pessoa pensar antes de ver a resposta.
Ex.: "Esse bucket está seguro? Por quê?"
-->

## Resposta

<details>
<summary>Ver resposta</summary>

<!--
Responda de forma direta, com NO MÁXIMO 5 PARÁGRAFOS.
Comece dizendo se está seguro ou não, depois explique o porquê e qual o risco.
Se passar de 5 parágrafos, divida em outro cenário.
Deixe uma linha em branco logo após <summary> e antes de </details>,
senão o Markdown dentro do bloco não é renderizado.
-->

</details>

## Como detectar

<!--
Mostre como identificar o problema. Prefira comandos de leitura (describe, list, get).
Exemplo:

```bash
aws s3api get-bucket-policy-status --bucket exemplo-bucket
```

Explique o que procurar na saída. Mencione também ferramentas de console
ou serviços gerenciados que ajudem (ex.: IAM Access Analyzer).
Teste os comandos em uma conta sandbox sua, nunca em produção
nem em recursos de terceiros.
-->

## Como corrigir

<!--
Mostre a correção passo a passo, com comandos ou trechos de configuração.
Explique por que a correção resolve o problema.
Se houver mais de um caminho, indique o mais simples para iniciantes.
Evite comandos destrutivos; se forem inevitáveis, avise claramente.
-->

## Saiba mais

<!--
Inclua pelo menos UMA fonte oficial (documentação do provedor, CIS Benchmarks ou equivalente).
Formato sugerido:

- [Nome da página](https://link-oficial)
-->

---

<!--
CHECKLIST ANTES DE ABRIR O PR (o template de PR repete estes itens):
[ ] Nome do arquivo em slug, sem número
[ ] Frontmatter completo, com valores aceitos
[ ] Todas as seções preenchidas
[ ] Resposta com no máximo 5 parágrafos
[ ] Apenas dados de exemplo; sem credenciais
[ ] Comandos testados em sandbox ou conferidos na documentação oficial
[ ] Pelo menos uma fonte oficial em "Saiba mais"
[ ] Verifiquei cada comando e afirmação técnica (inclusive se usei IA)
[ ] npm run build passou sem erros
-->