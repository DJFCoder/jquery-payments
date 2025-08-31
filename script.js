// Variáveis globais para elementos do DOM
const pixRadio = $("#tipoPix");
const cartaoRadio = $("#tipoCartao");
const pixContainer = $("#pixContainer");
const cartaoContainer = $("#cartaoContainer");
const bandeiraVisa = $("#cartaoVisa");
const bandeiraMaster = $("#cartaoMaster");
const valorInput = $("#valor");
const numCartaoInput = $("#numCartao");
const parcelasSelect = $("#parcelasCartao");
const totalLbl = $("#total");
const cartaoInvalidoLbl = $("#cartaoInvalidoLbl");
const btnInformar = $("#btnInformar");
const btnPagar = $("#btnPagar");

// Inicialização do script após carregamento do DOM
$(document).ready(function () {
  cartaoInvalidoLbl.hide();

  // Adiciona um listener que executa a função mudaContainer
  $('input[name="pagamento"]').change(mudarContainer);

  // Listener botão Informar
  btnInformar.click(function (event) {
    event.preventDefault();
    try {
      if (!informarDados()) return;

      if (isPixSelecionado()) {
        aplicarDescontoPix();
        atualizarTotal();
        return;
      }

      if (isCartaoSelecionado()) {
        calcularValorParcela();
        atualizarTotal();
        return;
      }
    } catch (e) {
      console.log(`${e}`);
      return;
    }
  });

  // Listener campo Valor
  $("#valor").keydown(function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      $("#btnInformar").click();
    }
  });

  // Listener input Numero Cartão
  numCartaoInput.on('input', function () {
    const numCartao = numCartaoInput.val();
    exibirBandeiraCartao(numCartao);
  });

  // Listener botão Pagar
  btnPagar.click(function (event) {
    event.preventDefault();
    try {
      if (!informarDados()) return;

      if (isPixSelecionado()) {
        cobrarPix();
        return;
      }

      if (isCartaoSelecionado()) {
        cobrarCartao();
        return;
      }
    } catch (e) {
      console.log(`${e}`);
      return;
    }
  });

  // Listener select de parcelas
  parcelasSelect.change(function () {
    atualizarTotal();
  });

  mudarContainer();
});

function isPixSelecionado() {
  return pixRadio.is(":checked");
}

function isCartaoSelecionado() {
  return cartaoRadio.is(":checked");
}

function exibirBandeiraCartao(numCartao) {
  if (!numCartao || numCartao.length < 4) {
    bandeiraVisa.fadeOut();
    bandeiraMaster.fadeOut();
    return;
  }

  if (numCartao.startsWith("1234")) {
    setTimeout(() => bandeiraVisa.fadeIn(), 400);
    bandeiraMaster.fadeOut();
    return;
  }

  if (numCartao.startsWith("4321")) {
    setTimeout(() => bandeiraMaster.fadeIn(), 400);
    bandeiraVisa.fadeOut();
    return;
  }

  validarCartao(numCartao);
}

function formatarValor(valor) {
  // Se não tiver ponto ou vírgula, insere vírgula depois de duas casas decimais
  if (!valor.includes('.') && !valor.includes(',')) {
    return parseFloat(valor).toFixed(2).replace(',');
  }
  // Formata o valor para duas casas decimais e substitui ponto por vírgula
  return parseFloat(valor).toFixed(2).replace('.', ',');
}

function mudarContainer() {
  // Se nenhum tipo de pagamento estiver selecionado, esconde ambos os containers
  if (!isPixSelecionado() && !isCartaoSelecionado()) {
    pixContainer.fadeOut();
    cartaoContainer.fadeOut();
    return;
  }
  // Se o Pix estiver selecionado, mostra o container do Pix e esconde o do Cartão
  if (isPixSelecionado()) {
    setTimeout(() => pixContainer.fadeIn(), 400);
    cartaoContainer.fadeOut();
    return;
  }
  // Se o Cartão estiver selecionado, mostra o container do Cartão e esconde o do Pix
  pixContainer.fadeOut();
  setTimeout(() => cartaoContainer.fadeIn(), 400);
}

function informarDados() {
  const valor = parseFloat(valorInput.val());
  if (!validarValor(valor)) {
    return false;
  }
  valorInput.val(valor.toFixed(2));
  return true;
}

function aplicarDescontoPix() {
  const valorOriginal = parseFloat(valorInput.val());
  if (!validarValor(valorOriginal)) {
    return null;
  }
  const desconto = 0.1; // 10%
  return valorOriginal - valorOriginal * desconto;
}

function calcularValorParcela() {
  const valor = parseFloat(valorInput.val());

  if (!validarValor(valor)) return 0.00;

  // Parcelas 1 a 3 sem juros
  const valorParcela1 = valor.toFixed(2);
  const valorParcela2 = (valor / 2).toFixed(2);
  const valorParcela3 = (valor / 3).toFixed(2);
  // Parcelas 4 e 5 com juros sobre o valor total
  const valorParcela4 = ((valor * 1.05) / 4).toFixed(2); // 5% juros
  const valorParcela5 = ((valor * 1.10) / 5).toFixed(2); // 10% juros

  $("#parcelasCartao option[value='1']").text(`1x R$ ${formatarValor(valorParcela1)}`);
  $("#parcelasCartao option[value='2']").text(`2x R$ ${formatarValor(valorParcela2)}`);
  $("#parcelasCartao option[value='3']").text(`3x R$ ${formatarValor(valorParcela3)}`);
  $("#parcelasCartao option[value='4']").text(`4x R$ ${formatarValor(valorParcela4)} (5% de juros)`);
  $("#parcelasCartao option[value='5']").text(`5x R$ ${formatarValor(valorParcela5)} (10% de juros)`);

  const parcelas = parseInt($("#parcelasCartao").val());

  if (parcelas === 4) {
    return valor * 1.05; // 5% juros
  }

  if (parcelas === 5) {
    return valor * 1.10; // 10% juros
  }

  return valor; // Parcelas 1 a 3 sem juros
}

// Valida se o campo "Valor" está preenchido com um número válido
function validarValor(valor) {
  if (!valor || isNaN(valor) || valor <= 0) { // Se o valor for nulo, não numérico ou menor/igual a zero
    alert('O campo "Valor" deve ser preenchido com um número válido.');
    return false;
  }
  return true;
}

// Valida o número do cartão informado
function validarCartao(numCartao) {
  // Se for nulo, vazio ou não começar com 1234 ou 4321
  const numInvalido = !numCartao || (!numCartao.startsWith("1234") && !numCartao.startsWith("4321"));

  if (numInvalido) {
    cartaoInvalidoLbl.fadeIn(); // Mostra mensagem de erro
    return false;
  }
  cartaoInvalidoLbl.fadeOut(); // Esconde mensagem de erro
  return true;
}

function calcularQtParcela(valor, parcelas) {
  return (valor / parcelas).toFixed(2); // Retorna o valor da parcela dividido pela quantidade com 2 casas decimais
}

// Atualiza o valor total exibido conforme a parcela selecionada ou com desconto no Pix
function atualizarTotal() {
  if (isPixSelecionado()) {
    const valorComDesconto = aplicarDescontoPix();
    if (valorComDesconto === null) {
      totalLbl.text(`Total: R$ 0,00`);
      return;
    }
    totalLbl.text(`Total: R$ ${formatarValor(valorComDesconto.toFixed(2))}`);
    return;
  }

  if (isCartaoSelecionado()) {
    const totalComJurosOuSem = calcularValorParcela();
    if (totalComJurosOuSem === null) {
      totalLbl.text(`Total: R$ 0,00`);
      return;
    }
    totalLbl.text(`Total: R$ ${formatarValor(totalComJurosOuSem.toFixed(2))}`);
    return;
  }

  totalLbl.text(`Total: R$ 0,00`);
}

// Limpa os campos do formulário e reseta as opções de parcelas
function limparCampos() {
  valorInput.val('');
  numCartaoInput.val('');
  // Reseta o select de parcelas para 0,00
  parcelasSelect.find('option').each(function () {
    $(this).text($(this).text().replace(/R\$ \d+,\d{2}/, 'R$ 0,00'));
  });
  parcelasSelect.val('1'); // Reseta para 1 parcela
  totalLbl.text('Total: R$ 0,00');
  cartaoInvalidoLbl.hide();
}

// Mostra alert de sucesso se a regra de negócio for atendida
function cobrarCartao() {
  const numCartao = numCartaoInput.val();
  if (!validarCartao(numCartao)) return;

  // Parcela selecionada
  const parcelas = parseInt(parcelasSelect.val());
  // Valor da parcela selecionada
  const valorParcela = calcularQtParcela(valor, parcelas);
  // Valor total do pagamento
  const valor = parseFloat(totalLbl.text().replace('Total: R$ ', ''));

  alert(`Pagamento realizado com sucesso!\n\nNúmero do cartão: ${numCartao}\nParcelas: ${parcelas}x de R$ ${valorParcela}\nValor total: R$ ${valor}`);
  limparCampos();
}

// Mostra alert de sucesso se a regra de negócio for atendida
function cobrarPix() {
  const valor = parseFloat(totalLbl.text().replace('Total: R$ ', ''));
  if (!validarValor(valor)) return;

  alert(`Pagamento realizado com sucesso!\n\nValor total: R$ ${valor}\n\nDesconto de 10% aplicado!`);
  limparCampos();
}