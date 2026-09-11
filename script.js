/*
const canvas = document.getElementById("labirinto");
const ctx = canvas.getContext("2d");
const faseTexto = document.getElementById("fase");
const tempoTexto = document.getElementById("tempo");
const movimentosTexto = document.getElementById("movimentos");
const mensagem = document.getElementById("mensagem");
const botaoProximaFase = document.getElementById("proximaFase");

// ========================================
// CONFIGURAÇÃO DAS 10 FASES
// ========================================

const fases = [
    // FASE 1
    { tamanho: 31, tempo: 60 },

    // FASE 2
    { tamanho: 37, tempo: 70 },

    // FASE 3
    { tamanho: 43, tempo: 80 },

    // FASE 4
    { tamanho: 47, tempo: 90 },

    // FASE 5
    { tamanho: 51, tempo: 105 },

    // FASE 6
    { tamanho: 55, tempo: 120 },

    // FASE 7
    { tamanho: 60, tempo: 130 },

    // FASE 8
    { tamanho: 65, tempo: 140 },

    // FASE 9
    { tamanho: 71, tempo: 150 },

    // FASE 10
    { tamanho: 77, tempo: 165 }

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

let tempoTotalJogo = 0;

let jogoTerminou = false;

let intervaloTempo;

let tamanhoCelula;

let moedas = 0;

let perdas = 0;

// Se perdeu alguma vez na fase atual
let perdeuNaFase = false;

// Indica se começou desde a fase 1
let jogoCompleto = true;

function voltarInicio() {
    clearInterval(intervaloTempo);

    jogoTerminou = true;

    document.getElementById("jogo").style.display = "none";
    document.getElementById("telaFinal").style.display = "none";
    document.getElementById("telaFases").style.display = "none";
    document.getElementById("telaComoJogar").style.display = "none";

    document.getElementById("telaInicio").style.display = "flex";
}

// ========================================
// CRIAR LABIRINTO
// ========================================

function criarLabirinto(tamanho) {

    const novoMapa = [];

    for (let y = 0; y < tamanho; y++) {

        novoMapa[y] = [];

        for (let x = 0; x < tamanho; x++) {

            novoMapa[y][x] = 1;

        }
    }


    function cavar(x, y) {

        novoMapa[y][x] = 0;


        const direcoes = [

            [0, -2],
            [0, 2],
            [-2, 0],
            [2, 0]

        ];


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

                novoMapa[
                    y + dy / 2
                ][
                    x + dx / 2
                ] = 0;


                cavar(novoX, novoY);
            }
        }
    }


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


    for (let y = 0; y < tamanho; y++) {

        for (let x = 0; x < tamanho; x++) {

            if (mapa[y][x] === 1) {

                ctx.fillStyle = "#111";

            } else {

                ctx.fillStyle = "#f4f4f4";

            }


            ctx.fillRect(

                x * tamanhoCelula,

                y * tamanhoCelula,

                tamanhoCelula + 1,

                tamanhoCelula + 1

            );
        }
    }


    // ====================================
    // SAÍDA
    // ====================================

    const saidaX =
        tamanho - 1;

    const saidaY =
        tamanho - 2;


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


    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.stroke();
}


// ========================================
// MOVER JOGADOR
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

let teclasPressionadas = {};


document.addEventListener(
    "keydown",
    function (event) {

        if (jogoTerminou) {
            return;
        }


        const teclas = [

            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight"

        ];


        if (!teclas.includes(event.key)) {
            return;
        }


        event.preventDefault();


        if (teclasPressionadas[event.key]) {
            return;
        }


        teclasPressionadas[event.key] = true;


        moverContinuamente(event.key);

    }
);


document.addEventListener(
    "keyup",
    function (event) {

        teclasPressionadas[event.key] = false;

    }
);


// ========================================
// MOVIMENTO RÁPIDO
// ========================================

function moverContinuamente(tecla) {

    if (

        jogoTerminou ||
        !teclasPressionadas[tecla]

    ) {

        return;
    }


    switch (tecla) {

        case "ArrowUp":
            moverJogador("cima");
            break;

        case "ArrowDown":
            moverJogador("baixo");
            break;

        case "ArrowLeft":
            moverJogador("esquerda");
            break;

        case "ArrowRight":
            moverJogador("direita");
            break;
    }


    setTimeout(

        function () {

            moverContinuamente(tecla);

        },

        60

    );
}


// ========================================
// TOUCH / CELULAR
// ========================================

let toqueInicialX = 0;
let toqueInicialY = 0;


canvas.addEventListener(

    "touchstart",

    function (event) {

        event.preventDefault();


        const toque =
            event.touches[0];


        toqueInicialX =
            toque.clientX;


        toqueInicialY =
            toque.clientY;

    },

    { passive: false }

);


canvas.addEventListener(

    "touchend",

    function (event) {

        event.preventDefault();


        const toque =
            event.changedTouches[0];


        const finalX =
            toque.clientX;


        const finalY =
            toque.clientY;


        const diferencaX =
            finalX - toqueInicialX;


        const diferencaY =
            finalY - toqueInicialY;


        const distancia =
            Math.max(

                Math.abs(diferencaX),
                Math.abs(diferencaY)

            );


        if (distancia < 20) {
            return;
        }


        if (

            Math.abs(diferencaX) >
            Math.abs(diferencaY)

        ) {

            if (diferencaX > 0) {

                moverJogador("direita");

            } else {

                moverJogador("esquerda");

            }

        } else {

            if (diferencaY > 0) {

                moverJogador("baixo");

            } else {

                moverJogador("cima");

            }
        }

    },

    { passive: false }

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


    // Soma o tempo dessa tentativa
    tempoTotalJogo += tempo;


    // ====================================
    // RECOMPENSA
    // ====================================

    let moedasGanhas;


    if (perdeuNaFase) {

        moedasGanhas = 30;

    } else {

        moedasGanhas = 50;

    }


    moedas += moedasGanhas;


    // ====================================
    // ÚLTIMA FASE
    // ====================================

    if (
        faseAtual === fases.length - 1
    ) {

        mostrarTelaFinal();

        return;
    }


    // ====================================
    // PRÓXIMA FASE
    // ====================================

    mensagem.textContent =

        "🎉 FASE " +
        (faseAtual + 1) +
        " CONCLUÍDA! +" +
        moedasGanhas +
        " 🪙";


    botaoProximaFase.textContent =
        "➡️ PRÓXIMA FASE";


    botaoProximaFase.style.display =
        "inline-block";


    botaoProximaFase.onclick =
        proximaFase;


    // Próxima fase começa sem
    // considerar perda da fase anterior

    perdeuNaFase = false;
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

            if (jogoTerminou) {
                return;
            }


            tempo++;


            tempoTexto.textContent =
                tempo;


            // ====================================
            // TEMPO ESGOTADO
            // ====================================

            if (
                tempo >=
                fases[faseAtual].tempo
            ) {

                perderFase();

            }

        },

        1000

    );
}


// ========================================
// PERDEU A FASE
// ========================================

function perderFase() {

    jogoTerminou = true;


    clearInterval(intervaloTempo);


    // Conta a perda

    perdas++;


    // Essa fase agora vale 30 moedas

    perdeuNaFase = true;


    // Soma o tempo que passou

    tempoTotalJogo += tempo;


    mensagem.textContent =
        "❌ VOCÊ PERDEU! O TEMPO ACABOU!";


    botaoProximaFase.textContent =
        "🔄 REINICIAR FASE";


    botaoProximaFase.style.display =
        "inline-block";


    botaoProximaFase.onclick =
        reiniciarFase;
}


// ========================================
// REINICIAR FASE
// ========================================

function reiniciarFase() {

    // Não zera perdeuNaFase.
    // Se perdeu uma vez, ao vencer
    // essa fase ganhará apenas 30 moedas.

    iniciarFase();
}


// ========================================
// TELA DE TODAS AS FASES
// ========================================

function mostrarFases() {

    document.getElementById(
        "telaFases"
    ).style.display = "flex";
}


function fecharFases() {

    document.getElementById(
        "telaFases"
    ).style.display = "none";
}


// ========================================
// ESCOLHER UMA FASE
// ========================================

function escolherFase(numero) {

    faseAtual = numero;

    moedas = 0;

    perdas = 0;

    tempoTotalJogo = 0;

    perdeuNaFase = false;

    jogoCompleto = false;


    document.getElementById(
        "telaFases"
    ).style.display = "none";


    document.getElementById(
        "telaInicio"
    ).style.display = "none";


    document.getElementById(
        "jogo"
    ).style.display = "block";


    iniciarFase();
}


// ========================================
// COMO JOGAR
// ========================================

function mostrarComoJogar() {

    document.getElementById(
        "telaComoJogar"
    ).style.display = "flex";
}


function fecharComoJogar() {

    document.getElementById(
        "telaComoJogar"
    ).style.display = "none";
}


// ========================================
// TELA FINAL
// ========================================

function mostrarTelaFinal() {

    document.getElementById(
        "jogo"
    ).style.display = "none";


    document.getElementById(
        "telaFinal"
    ).style.display = "flex";


    document.getElementById(
        "moedasFinal"
    ).textContent = moedas;


    document.getElementById(
        "perdasFinal"
    ).textContent = perdas;


    document.getElementById(
        "tempoFinal"
    ).textContent =
        tempoTotalJogo + "s";


    // ====================================
    // RECORD
    // ====================================

    let recorde =
        localStorage.getItem(
            "recordeLabirinto"
        );


    if (
        jogoCompleto
    ) {

        if (
            recorde === null ||
            tempoTotalJogo < Number(recorde)
        ) {

            recorde =
                tempoTotalJogo;


            localStorage.setItem(
                "recordeLabirinto",
                recorde
            );
        }
    }


    if (recorde !== null) {

        document.getElementById(
            "recordeFinal"
        ).textContent =
            recorde + "s";

    } else {

        document.getElementById(
            "recordeFinal"
        ).textContent =
            "--";
    }
}


// ========================================
// JOGAR NOVAMENTE
// ========================================

function jogarNovamente() {

    document.getElementById(
        "telaFinal"
    ).style.display = "none";


    document.getElementById(
        "jogo"
    ).style.display = "block";


    faseAtual = 0;

    moedas = 0;

    perdas = 0;

    tempoTotalJogo = 0;

    perdeuNaFase = false;

    jogoCompleto = true;


    iniciarFase();
}
*/

// ========================================
// ELEMENTOS DO HTML
// ========================================

const canvas = document.getElementById("labirinto");
const ctx = canvas.getContext("2d");

const faseTexto = document.getElementById("fase");
const tempoTexto = document.getElementById("tempo");
const movimentosTexto = document.getElementById("movimentos");
const mensagem = document.getElementById("mensagem");
const botaoProximaFase = document.getElementById("proximaFase");


// ========================================
// CONFIGURAÇÃO DAS 10 FASES
// ========================================

const fases = [
    { tamanho: 31, tempo: 60 },
    { tamanho: 37, tempo: 70 },
    { tamanho: 43, tempo: 80 },
    { tamanho: 47, tempo: 90 },
    { tamanho: 51, tempo: 105 },
    { tamanho: 55, tempo: 120 },
    { tamanho: 61, tempo: 130 },
    { tamanho: 67, tempo: 140 },
    { tamanho: 73, tempo: 150 },
    { tamanho: 79, tempo: 165 }
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
let tempoTotalJogo = 0;

let moedas = 0;
let perdas = 0;

let perdeuNaFase = false;
let jogoCompleto = true;
let jogoTerminou = false;

let intervaloTempo;
let tamanhoCelula;

let teclasPressionadas = {};


// ========================================
// CRIAR LABIRINTO
// ========================================

function criarLabirinto(tamanho) {

    const novoMapa = [];

    for (let y = 0; y < tamanho; y++) {
        novoMapa[y] = [];

        for (let x = 0; x < tamanho; x++) {
            novoMapa[y][x] = 1;
        }
    }

    function cavar(x, y) {

        novoMapa[y][x] = 0;

        const direcoes = [
            [0, -2],
            [0, 2],
            [-2, 0],
            [2, 0]
        ];

        direcoes.sort(() => Math.random() - 0.5);

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

                novoMapa[y + dy / 2][x + dx / 2] = 0;

                cavar(novoX, novoY);
            }
        }
    }

    cavar(1, 1);

    // Entrada
    novoMapa[1][0] = 0;

    // Saída
    novoMapa[tamanho - 2][tamanho - 1] = 0;

    return novoMapa;
}


// ========================================
// INICIAR FASE
// ========================================

function iniciarFase() {

    const tamanho = fases[faseAtual].tamanho;

    mapa = criarLabirinto(tamanho);

    jogador.x = 1;
    jogador.y = 1;

    movimentos = 0;
    tempo = 0;

    jogoTerminou = false;

    faseTexto.textContent = faseAtual + 1;
    movimentosTexto.textContent = movimentos;
    tempoTexto.textContent = tempo;

    mensagem.textContent = "";

    botaoProximaFase.style.display = "none";

    tamanhoCelula = canvas.width / tamanho;

    desenhar();

    iniciarCronometro();
}


// ========================================
// DESENHAR LABIRINTO
// ========================================

function desenhar() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tamanho = mapa.length;

    tamanhoCelula = canvas.width / tamanho;

    for (let y = 0; y < tamanho; y++) {

        for (let x = 0; x < tamanho; x++) {

            if (mapa[y][x] === 1) {
                ctx.fillStyle = "#111";
            } else {
                ctx.fillStyle = "#f4f4f4";
            }

            ctx.fillRect(
                x * tamanhoCelula,
                y * tamanhoCelula,
                tamanhoCelula + 1,
                tamanhoCelula + 1
            );
        }
    }

    // ====================================
    // SAÍDA
    // ====================================

    const saidaX = tamanho - 1;
    const saidaY = tamanho - 2;

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
        jogador.x * tamanhoCelula + tamanhoCelula / 2;

    const centroY =
        jogador.y * tamanhoCelula + tamanhoCelula / 2;

    ctx.beginPath();

    ctx.arc(
        centroX,
        centroY,
        tamanhoCelula * 0.35,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
}


// ========================================
// MOVER JOGADOR
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

    if (
        mapa[novoY] &&
        mapa[novoY][novoX] === 0
    ) {

        jogador.x = novoX;
        jogador.y = novoY;

        movimentos++;

        movimentosTexto.textContent = movimentos;

        verificarVitoria();

        desenhar();
    }
}


// ========================================
// TECLADO
// ========================================

document.addEventListener("keydown", function (event) {

    if (jogoTerminou) {
        return;
    }

    const teclas = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
    ];

    if (!teclas.includes(event.key)) {
        return;
    }

    event.preventDefault();

    if (teclasPressionadas[event.key]) {
        return;
    }

    teclasPressionadas[event.key] = true;

    moverContinuamente(event.key);
});


document.addEventListener("keyup", function (event) {
    teclasPressionadas[event.key] = false;
});


// ========================================
// MOVIMENTO CONTÍNUO
// ========================================

function moverContinuamente(tecla) {

    if (
        jogoTerminou ||
        !teclasPressionadas[tecla]
    ) {
        return;
    }

    switch (tecla) {

        case "ArrowUp":
            moverJogador("cima");
            break;

        case "ArrowDown":
            moverJogador("baixo");
            break;

        case "ArrowLeft":
            moverJogador("esquerda");
            break;

        case "ArrowRight":
            moverJogador("direita");
            break;
    }

    setTimeout(function () {
        moverContinuamente(tecla);
    }, 60);
}


// ========================================
// TOUCH / CELULAR
// ========================================

let toqueInicialX = 0;
let toqueInicialY = 0;

canvas.addEventListener("touchstart", function (event) {

    event.preventDefault();

    const toque = event.touches[0];

    toqueInicialX = toque.clientX;
    toqueInicialY = toque.clientY;

}, { passive: false });


canvas.addEventListener("touchend", function (event) {

    event.preventDefault();

    const toque = event.changedTouches[0];

    const diferencaX = toque.clientX - toqueInicialX;
    const diferencaY = toque.clientY - toqueInicialY;

    const distancia = Math.max(
        Math.abs(diferencaX),
        Math.abs(diferencaY)
    );

    if (distancia < 20) {
        return;
    }

    if (Math.abs(diferencaX) > Math.abs(diferencaY)) {

        if (diferencaX > 0) {
            moverJogador("direita");
        } else {
            moverJogador("esquerda");
        }

    } else {

        if (diferencaY > 0) {
            moverJogador("baixo");
        } else {
            moverJogador("cima");
        }
    }

}, { passive: false });


// ========================================
// VERIFICAR VITÓRIA
// ========================================

function verificarVitoria() {

    const tamanho = mapa.length;

    const saidaX = tamanho - 1;
    const saidaY = tamanho - 2;

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

    tempoTotalJogo += tempo;

    const moedasGanhas = perdeuNaFase ? 30 : 50;

    moedas += moedasGanhas;

    if (faseAtual === fases.length - 1) {

        mostrarTelaFinal();

        return;
    }

    mensagem.textContent =
        "🎉 FASE " +
        (faseAtual + 1) +
        " CONCLUÍDA! +" +
        moedasGanhas +
        " 🪙";

    botaoProximaFase.textContent = "➡️ PRÓXIMA FASE";

    botaoProximaFase.style.display = "inline-block";

    botaoProximaFase.onclick = proximaFase;

    perdeuNaFase = false;
}


// ========================================
// PRÓXIMA FASE
// ========================================

function proximaFase() {

    if (faseAtual >= fases.length - 1) {
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

    intervaloTempo = setInterval(function () {

        if (jogoTerminou) {
            return;
        }

        tempo++;

        tempoTexto.textContent = tempo;

        if (tempo >= fases[faseAtual].tempo) {

            perderFase();
        }

    }, 1000);
}


// ========================================
// PERDEU A FASE
// ========================================

function perderFase() {

    jogoTerminou = true;

    clearInterval(intervaloTempo);

    perdas++;

    perdeuNaFase = true;

    tempoTotalJogo += tempo;

    mensagem.textContent =
        "❌ VOCÊ PERDEU! O TEMPO ACABOU!";

    botaoProximaFase.textContent =
        "🔄 REINICIAR FASE";

    botaoProximaFase.style.display =
        "inline-block";

    botaoProximaFase.onclick =
        reiniciarFase;
}


// ========================================
// REINICIAR FASE
// ========================================

function reiniciarFase() {

    iniciarFase();
}


// ========================================
// TELA INICIAL
// ========================================

function iniciarJogo() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaFases").style.display = "none";
    document.getElementById("telaComoJogar").style.display = "none";
    document.getElementById("telaFinal").style.display = "none";

    document.getElementById("jogo").style.display = "block";

    faseAtual = 0;
    moedas = 0;
    perdas = 0;
    tempoTotalJogo = 0;
    perdeuNaFase = false;
    jogoCompleto = true;

    iniciarFase();
}


// ========================================
// TODAS AS FASES
// ========================================

function mostrarFases() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("jogo").style.display = "none";
    document.getElementById("telaComoJogar").style.display = "none";
    document.getElementById("telaFinal").style.display = "none";

    document.getElementById("telaFases").style.display = "flex";
}


function fecharFases() {

    document.getElementById("telaFases").style.display = "none";
    document.getElementById("telaInicio").style.display = "flex";
}


// ========================================
// ESCOLHER FASE
// ========================================

function escolherFase(numero) {

    faseAtual = numero;

    moedas = 0;
    perdas = 0;
    tempoTotalJogo = 0;
    perdeuNaFase = false;

    jogoCompleto = false;

    document.getElementById("telaFases").style.display = "none";
    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaFinal").style.display = "none";
    document.getElementById("jogo").style.display = "block";

    iniciarFase();
}


// ========================================
// COMO JOGAR
// ========================================

function mostrarComoJogar() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaFases").style.display = "none";
    document.getElementById("jogo").style.display = "none";
    document.getElementById("telaFinal").style.display = "none";

    document.getElementById("telaComoJogar").style.display = "flex";
}


function fecharComoJogar() {

    document.getElementById("telaComoJogar").style.display = "none";
    document.getElementById("telaInicio").style.display = "flex";
}


// ========================================
// VOLTAR À TELA INICIAL
// ========================================

function voltarInicio() {

    clearInterval(intervaloTempo);

    jogoTerminou = true;

    document.getElementById("jogo").style.display = "none";
    document.getElementById("telaFinal").style.display = "none";
    document.getElementById("telaFases").style.display = "none";
    document.getElementById("telaComoJogar").style.display = "none";

    document.getElementById("telaInicio").style.display = "flex";
}


// ========================================
// TELA FINAL
// ========================================

function mostrarTelaFinal() {

    document.getElementById("jogo").style.display = "none";
    document.getElementById("telaFinal").style.display = "flex";

    document.getElementById("moedasFinal").textContent = moedas;
    document.getElementById("perdasFinal").textContent = perdas;
    document.getElementById("tempoFinal").textContent = tempoTotalJogo + "s";

    let recorde = localStorage.getItem("recordeLabirinto");

    if (jogoCompleto) {

        if (
            recorde === null ||
            tempoTotalJogo < Number(recorde)
        ) {

            recorde = tempoTotalJogo;

            localStorage.setItem(
                "recordeLabirinto",
                recorde
            );
        }
    }

    document.getElementById("recordeFinal").textContent =
        recorde !== null ? recorde + "s" : "--";
}


// ========================================
// JOGAR NOVAMENTE
// ========================================

function jogarNovamente() {

    document.getElementById("telaFinal").style.display = "none";
    document.getElementById("jogo").style.display = "block";

    faseAtual = 0;
    moedas = 0;
    perdas = 0;
    tempoTotalJogo = 0;
    perdeuNaFase = false;
    jogoCompleto = true;

    iniciarFase();
}