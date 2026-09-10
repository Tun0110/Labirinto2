const canvas = document.getElementById("labirinto");

const ctx = canvas.getContext("2d");

const faseTexto = document.getElementById("fase");

const tempoTexto = document.getElementById("tempo");

const movimentosTexto =
    document.getElementById("movimentos");

const mensagem =
    document.getElementById("mensagem");

const botaoProximaFase =
    document.getElementById("proximaFase");


// ========================================
// CONFIGURAÇÃO DAS FASES
// ========================================

const fases = [

    {
        tamanho: 26
    },

    {
        tamanho: 36
    },

    {
        tamanho: 46
    }

];


// ========================================
// VARIÁVEIS
// ========================================

let faseAtual = 0;

let mapa = [];

let jogador = {
    x: 1,
    y: 1
};

let movimentos = 0;

let tempo = 0;

let jogoTerminou = false;

let intervaloTempo;


// ========================================
// TAMANHO DA CÉLULA
// ========================================

let tamanhoCelula;


// ========================================
// CRIAR LABIRINTO
// ========================================

function criarLabirinto(tamanho) {

    const novoMapa = [];

    // Cria tudo como parede

    for (let y = 0; y < tamanho; y++) {

        novoMapa[y] = [];

        for (let x = 0; x < tamanho; x++) {

            novoMapa[y][x] = 1;

        }
    }


    /*
        Algoritmo de geração de labirinto.

        1 = parede
        0 = caminho
    */

    function cavar(x, y) {

        novoMapa[y][x] = 0;


        const direcoes = [

            [0, -2],

            [0, 2],

            [-2, 0],

            [2, 0]

        ];


        // Embaralhar direções

        direcoes.sort(
            () => Math.random() - 0.5
        );


        for (const [dx, dy] of direcoes) {

            const novoX = x + dx;

            const novoY = y + dy;


            if (
                novoX > 0 &&
                novoX < tamanho - 1 &&
                novoY > 0 &&
                novoY < tamanho - 1 &&
                novoMapa[novoY][novoX] === 1
            ) {

                // Remove parede entre os pontos

                novoMapa[
                    y + dy / 2
                ][
                    x + dx / 2
                ] = 0;


                cavar(novoX, novoY);

            }
        }
    }


    // Começa a cavar

    cavar(1, 1);


    // Entrada

    novoMapa[1][0] = 0;


    // Saída

    novoMapa[
        tamanho - 2
    ][
        tamanho - 1
    ] = 0;


    return novoMapa;
}


// ========================================
// INICIAR FASE
// ========================================

function iniciarFase() {

    const tamanho =
        fases[faseAtual].tamanho;


    mapa = criarLabirinto(tamanho);


    jogador.x = 1;

    jogador.y = 1;


    movimentos = 0;

    tempo = 0;

    jogoTerminou = false;


    faseTexto.textContent =
        faseAtual + 1;


    movimentosTexto.textContent =
        movimentos;


    tempoTexto.textContent =
        tempo;


    mensagem.textContent = "";


    botaoProximaFase.style.display =
        "none";


    // Calcula tamanho da célula

    tamanhoCelula =
        canvas.width / tamanho;


    desenhar();


    iniciarCronometro();
}


// ========================================
// DESENHAR
// ========================================

function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const tamanho =
        mapa.length;


    tamanhoCelula =
        canvas.width / tamanho;


    // ====================================
    // DESENHAR MAPA
    // ====================================

    for (let y = 0; y < tamanho; y++) {

        for (let x = 0; x < tamanho; x++) {

            if (mapa[y][x] === 1) {

                // Parede

                ctx.fillStyle = "#111";

                ctx.fillRect(
                    x * tamanhoCelula,
                    y * tamanhoCelula,
                    tamanhoCelula + 1,
                    tamanhoCelula + 1
                );

            } else {

                // Caminho

                ctx.fillStyle = "#f4f4f4";

                ctx.fillRect(
                    x * tamanhoCelula,
                    y * tamanhoCelula,
                    tamanhoCelula + 1,
                    tamanhoCelula + 1
                );

            }
        }
    }


    // ====================================
    // SAÍDA
    // ====================================

    const saidaX = mapa.length - 1;

    const saidaY = mapa.length - 2;


    ctx.fillStyle = "#27ae60";


    ctx.fillRect(

        saidaX * tamanhoCelula,

        saidaY * tamanhoCelula,

        tamanhoCelula,

        tamanhoCelula

    );


    // ====================================
    // JOGADOR
    // ====================================

    ctx.fillStyle = "#e74c3c";


    const centroX =
        jogador.x * tamanhoCelula +
        tamanhoCelula / 2;


    const centroY =
        jogador.y * tamanhoCelula +
        tamanhoCelula / 2;


    ctx.beginPath();


    ctx.arc(

        centroX,

        centroY,

        tamanhoCelula * 0.35,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // Contorno

    ctx.strokeStyle = "#000";

    ctx.lineWidth = 2;

    ctx.stroke();
}


// ========================================
// VERIFICAR MOVIMENTO
// ========================================

function moverJogador(direcao) {

    if (jogoTerminou) {
        return;
    }


    let novoX = jogador.x;

    let novoY = jogador.y;


    switch (direcao) {

        case "cima":

            novoY--;

            break;


        case "baixo":

            novoY++;

            break;


        case "esquerda":

            novoX--;

            break;


        case "direita":

            novoX++;

            break;
    }


    // ====================================
    // VERIFICAR SE NÃO É PAREDE
    // ====================================

    if (
        mapa[novoY] &&
        mapa[novoY][novoX] === 0
    ) {

        jogador.x = novoX;

        jogador.y = novoY;

        movimentos++;

        movimentosTexto.textContent =
            movimentos;


        verificarVitoria();


        desenhar();
    }
}


// ========================================
// TECLADO
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (jogoTerminou) {
            return;
        }


        switch (event.key) {

            case "ArrowUp":

                moverJogador("cima");

                event.preventDefault();

                break;


            case "ArrowDown":

                moverJogador("baixo");

                event.preventDefault();

                break;


            case "ArrowLeft":

                moverJogador("esquerda");

                event.preventDefault();

                break;


            case "ArrowRight":

                moverJogador("direita");

                event.preventDefault();

                break;
        }
    }
);


// ========================================
// VERIFICAR VITÓRIA
// ========================================

function verificarVitoria() {

    const tamanho =
        mapa.length;


    const saidaX =
        tamanho - 1;


    const saidaY =
        tamanho - 2;


    if (
        jogador.x === saidaX &&
        jogador.y === saidaY
    ) {

        vencerFase();
    }
}


// ========================================
// VENCER FASE
// ========================================

function vencerFase() {

    jogoTerminou = true;


    clearInterval(intervaloTempo);


    if (faseAtual < fases.length - 1) {

        mensagem.textContent =
            "🎉 Fase " +
            (faseAtual + 1) +
            " concluída!";


        botaoProximaFase.style.display =
            "inline-block";

    } else {

        mensagem.textContent =
            "🏆 PARABÉNS! Você terminou as 3 fases!";

    }
}


// ========================================
// PRÓXIMA FASE
// ========================================

function proximaFase() {

    if (
        faseAtual >= fases.length - 1
    ) {

        return;
    }


    faseAtual++;


    iniciarFase();
}


// ========================================
// CRONÔMETRO
// ========================================

function iniciarCronometro() {

    clearInterval(intervaloTempo);


    intervaloTempo = setInterval(
        function () {

            if (!jogoTerminou) {

                tempo++;

                tempoTexto.textContent =
                    tempo;
            }

        },
        1000
    );
}

// ========================================
// TELA INICIAL
// ========================================

function iniciarJogo() {

    document.getElementById("telaInicio").style.display =
        "none";

    document.getElementById("jogo").style.display =
        "block";

    iniciarFase();
}


// ========================================
// COMO JOGAR
// ========================================

function mostrarComoJogar() {

    document.getElementById("telaComoJogar").style.display =
        "flex";
}


function fecharComoJogar() {

    document.getElementById("telaComoJogar").style.display =
        "none";
}

// ========================================
// COMEÇAR JOGO
// ========================================

function iniciarJogo() {

    document.getElementById("telaInicio").style.display =
        "none";

    document.getElementById("jogo").style.display =
        "block";

    iniciarFase();
}