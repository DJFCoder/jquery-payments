# jquery-payments

Projeto simples para demonstrar um formulário de pagamento com opções de Pix e Cartão, utilizando jQuery para manipulação do DOM e lógica de cálculo.

## Descrição

Este projeto apresenta uma interface web onde o usuário pode informar um valor e escolher entre pagamento via Pix ou Cartão. Conforme a escolha, o formulário exibe os campos correspondentes e calcula o valor total com desconto para Pix ou parcelas com juros para cartão.

## Funcionalidades

- Seleção entre pagamento via Pix ou Cartão.
- Aplicação de desconto de 10% para pagamentos via Pix.
- Cálculo de parcelas para pagamento com cartão, com juros para 4 e 5 parcelas.
- Validação básica do valor e número do cartão.
- Exibição dinâmica da bandeira do cartão (Visa ou Master) conforme o número informado.

## Tecnologias

- HTML5
- CSS3
- JavaScript (jQuery 3.7.1)

## Como usar

1. Informe o valor da compra.
2. Selecione o tipo de pagamento (Pix ou Cartão).
3. Clique em "Informar dados" para calcular o total ou parcelas.
4. Preencha os dados adicionais conforme o tipo de pagamento.
5. Clique em "Pagar" para finalizar a operação.

## Estrutura do projeto

- `index.html`: arquivo principal com o formulário e estrutura da página.
- `script.js`: script JavaScript com toda a lógica de manipulação e cálculo.

## Observações

- O projeto é um exemplo didático e não realiza transações reais.
- A validação do cartão é simplificada para fins de demonstração.
