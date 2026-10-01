# 🐛 Misconfig do Dia

Um cenário de má configuração em cloud por dia, em português, para quem está começando em segurança.

<!-- Se houver site publicado, descomente e ajuste a linha abaixo -->
<!-- 🌐 **Acesse:** https://SEU-SITE-AQUI -->

## O que é

Todo dia um novo cenário: **"esse recurso está seguro? por quê?"**

Você lê a situação, tenta responder e depois clica para ver a explicação, como detectar o problema e como corrigir.

## Por que existe

Aprender segurança cloud é difícil: os materiais costumam ser técnicos, estar em inglês e assumir que você já sabe muito. Aqui é o oposto: cenários curtos, em português, feitos para iniciantes.

## Exemplo de cenário

> **Cenário:** uma equipe criou o bucket S3 `exemplo-bucket` para guardar backups de um sistema interno. Para "facilitar o acesso", alguém adicionou uma política permitindo `s3:GetObject` para qualquer pessoa (`"Principal": "*"`).
>
> **Pergunta:** esse bucket está seguro? Por quê?

<details>
<summary>Ver resposta</summary>

**Não está seguro.** Com `"Principal": "*"`, qualquer pessoa na internet, sem conta AWS e sem autenticação, pode baixar os arquivos do bucket se souber (ou descobrir) o nome dele. Backups costumam conter dados sensíveis, então o risco de vazamento é alto.

**Como detectar:**

```bash
aws s3api get-bucket-policy-status --bucket exemplo-bucket
aws s3api get-public-access-block --bucket exemplo-bucket
```

Se `IsPublic` vier como `true`, ou se o bloqueio de acesso público estiver desativado, o bucket merece atenção. O IAM Access Analyzer também aponta buckets com acesso externo.

**Como corrigir:** remova da política o trecho que libera acesso a todos e ative o bloqueio de acesso público:

```bash
aws s3api put-public-access-block \
  --bucket exemplo-bucket \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

Se alguém realmente precisa de acesso, conceda a identidades específicas (usuários ou funções do IAM), e não a todos.

</details>

## Estrutura do projeto

```
cenarios/   # um arquivo Markdown por cenário
docs/       # template de cenário e documentação do projeto
public/     # arquivos estáticos
src/        # código do site (Astro)
```

## Rodando localmente

Requisitos: [Node.js](https://nodejs.org/) e npm.

```bash
git clone https://github.com/HudsonFranc/misconfig-do-dia.git
cd misconfig-do-dia
npm install
npm run dev
```

O site abre em `http://localhost:4321`.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o servidor local em `localhost:4321` |
| `npm run build` | Gera a versão de produção em `./dist/` |
| `npm run preview` | Pré-visualiza o build localmente |

## Como contribuir

Contribuições são muito bem-vindas, desde uma ideia de cenário até a revisão técnica de um existente. Veja o guia completo em [CONTRIBUTING.md](CONTRIBUTING.md).

## Aviso

Os cenários têm fins educacionais e usam apenas dados de exemplo. Teste comandos somente em contas sandbox suas, nunca em ambientes de produção ou de terceiros.

## Licença

[MIT](LICENSE)
