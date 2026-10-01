---
titulo: "Função Lambda em runtime descontinuado"
provedor: aws
servico: Lambda
dificuldade: iniciante
data:
---

## Cenário

A função `enviar-notificacoes` foi criada há alguns anos e funciona sem problemas, então ninguém mexe nela. Ao revisar a conta, alguém percebe que o runtime dela, ou seja, a versão da linguagem usada para executar o código, aparece em um aviso do console como descontinuado pela AWS.

## Pergunta

Se a função continua funcionando, isso é um problema? Por quê?

## Resposta

<details>
<summary>Ver resposta</summary>

**É um problema, apesar de a função continuar rodando.** Quando a AWS descontinua um runtime, ela deixa de aplicar atualizações de segurança nele. Vulnerabilidades descobertas depois disso ficam sem correção, e o ambiente onde a sua função roda vai ficando cada vez mais exposto.

Além disso, depois de um prazo a AWS bloqueia a criação e, mais tarde, a atualização de funções nesse runtime. Se um dia for preciso corrigir algo com urgência, pode não ser possível fazer isso sem antes migrar.

Funções antigas costumam também ter bibliotecas desatualizadas. Por isso, trocar o runtime é um bom momento para atualizar as dependências e testar o comportamento da função.

</details>

## Como detectar

```bash
aws lambda list-functions \
  --query "Functions[].{Nome:FunctionName,Runtime:Runtime}"
```

Compare os runtimes da lista com os que a documentação oficial indica como suportados. Funções empacotadas como imagem de contêiner não mostram um runtime nessa lista. A AWS também avisa por e-mail e pelo AWS Health sobre descontinuações, e o Trusted Advisor e o Amazon Inspector ajudam a encontrar funções desatualizadas e dependências vulneráveis.

## Como corrigir

1. Escolha um runtime suportado e atual na lista da documentação.
2. Teste a função em um ambiente de teste, porque mudanças de versão da linguagem podem quebrar o código ou as bibliotecas.
3. Atualize o runtime:

```bash
aws lambda update-function-configuration \
  --function-name enviar-notificacoes \
  --runtime <runtime-suportado>
```

4. Atualize também as dependências e confirme que a função continua funcionando. Se algo falhar, volte para a versão anterior usando versões e aliases do Lambda.

Para não repetir o problema, anote as datas de descontinuação e reserve um momento periódico para revisar as funções.

## Saiba mais

- [Runtimes do AWS Lambda e política de descontinuação](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
