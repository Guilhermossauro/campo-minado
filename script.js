let tabuleiro;
let gameOver = false;
let bandeirasDisponiveis;
let bandeirasMarcadas = 0;

function criarTabuleiro(linhas, colunas) {
    const tabuleiro = [];
    for (let i = 0; i < linhas; i++) {
        tabuleiro[i] = [];
        for (let j = 0; j < colunas; j++) {
            tabuleiro[i][j] = { valor: 0, revelado: false, marcado: false }; 
        }
    }
    return tabuleiro;
}

function adicionarMinasETipos(tabuleiro, numMinas) {
    const linhas = tabuleiro.length;
    const colunas = tabuleiro[0].length;
    let minasAdicionadas = 0;

    while (minasAdicionadas < numMinas) {
        const linha = Math.floor(Math.random() * linhas);
        const coluna = Math.floor(Math.random() * colunas);

        if (tabuleiro[linha][coluna].valor !== 'M') {
            tabuleiro[linha][coluna].valor = 'M'; 
            minasAdicionadas++;


            for (let i = linha - 1; i <= linha + 1; i++) {
                for (let j = coluna - 1; j <= coluna + 1; j++) {
                    if (i >= 0 && i < linhas && j >= 0 && j < colunas && tabuleiro[i][j].valor !== 'M') {
                        tabuleiro[i][j].valor++;
                    }
                }
            }
        }
    }
    return tabuleiro;
}

function campoMinadoFacil() {
    const tabuleiro = criarTabuleiro(5, 5);
    const numMinas = 5;
    return adicionarMinasETipos(tabuleiro, numMinas);
}

function campoMinadoMedio() {
    const tabuleiro = criarTabuleiro(7, 7);
    const numMinas = 10;
    return adicionarMinasETipos(tabuleiro, numMinas);
}

function campoMinadoDificil() {
    const tabuleiro = criarTabuleiro(8, 8);
    const numMinas = 18;
    return adicionarMinasETipos(tabuleiro, numMinas);
}

function gerarTabuleiroFacil() {
    tabuleiro = campoMinadoFacil();
    console.log(tabuleiro)
    exibirTabuleiro(tabuleiro);
    gameOver= false
    bandeirasDisponiveis = 5; 
}

function gerarTabuleiroMedio() {
    tabuleiro = campoMinadoMedio();
    console.log(tabuleiro)
    exibirTabuleiro(tabuleiro);
    gameOver= false
    bandeirasDisponiveis = 10; 
}

function gerarTabuleiroDificil() {
    tabuleiro = campoMinadoDificil();
    console.log(tabuleiro)
    exibirTabuleiro(tabuleiro);
    gameOver= false
    bandeirasDisponiveis = 18; 

}

function exibirTabuleiro(tabuleiro) {
    const table = document.getElementById('tabuleiro');
    table.innerHTML = '';

    for (let i = 0; i < tabuleiro.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < tabuleiro[i].length; j++) {
            const cell = document.createElement('td');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.textContent = ''; 
            cell.addEventListener('click', revelarCelula); 
            cell.addEventListener('contextmenu', marcarBandeira); 
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

}

function revelarCelula(event) {
    if (gameOver) return; 
    const linha = parseInt(event.target.dataset.row);
    const coluna = parseInt(event.target.dataset.col);

    if (tabuleiro[linha][coluna].marcado) return; 
    if (tabuleiro[linha][coluna].revelado) return; 

    tabuleiro[linha][coluna].revelado = true;

    if (tabuleiro[linha][coluna].valor === 'M') {
        event.target.textContent = '💣';
        gameOver = true;
        mostrarBombas();
        return alert('GAME OVER');
    }

    event.target.textContent = tabuleiro[linha][coluna].valor; 
    if (tabuleiro[linha][coluna].valor === 0) {
        revelarCelulasVizinhas(linha, coluna); 
    }

    if (verificarVitoria()) {
        alert('You Win!');
        gameOver = true;
    }
}

function marcarBandeira(event) {
    event.preventDefault(); 
    if (gameOver) return; 
    if (bandeirasDisponiveis === 0) return; 
    const linha = parseInt(event.target.dataset.row);
    const coluna = parseInt(event.target.dataset.col);

    if (!tabuleiro[linha][coluna].revelado && !tabuleiro[linha][coluna].marcado) {
        tabuleiro[linha][coluna].marcado = true;
        event.target.textContent = '🚩';
        bandeirasDisponiveis--;
        bandeirasMarcadas++;

        if (verificarVitoria()) {
            alert('You Win!');
            gameOver = true;
        }
    } else if (tabuleiro[linha][coluna].marcado) {
        tabuleiro[linha][coluna].marcado = false;
        event.target.textContent = '';
        bandeirasDisponiveis++;
        bandeirasMarcadas--;

        if (verificarVitoria()) {
            alert('You Win!');
            gameOver = true;
        }
    }
}

function revelarCelulasVizinhas(linha, coluna) {
    const linhas = tabuleiro.length;
    const colunas = tabuleiro[0].length;

    for (let i = linha - 1; i <= linha + 1; i++) {
        for (let j = coluna - 1; j <= coluna + 1; j++) {
            if (i >= 0 && i < linhas && j >= 0 && j < colunas && !tabuleiro[i][j].revelado) {
                tabuleiro[i][j].revelado = true;
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.textContent = tabuleiro[i][j].valor;
                if (tabuleiro[i][j].valor === 0) {
                    revelarCelulasVizinhas(i, j);
                }
            }
        }
    }
}

function verificarVitoria() {
    const linhas = tabuleiro.length;
    const colunas = tabuleiro[0].length;
    let celulasNaoReveladas = 0;

    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            if (!tabuleiro[i][j].revelado && tabuleiro[i][j].valor !== 'M') {
                celulasNaoReveladas++;
            }
        }
    }

    return celulasNaoReveladas === 0 && bandeirasMarcadas === 5;
}

function mostrarBombas() {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        const linha = parseInt(cell.dataset.row);
        const coluna = parseInt(cell.dataset.col);

        if (tabuleiro[linha][coluna].valor === 'M') {
            cell.textContent = '💣'; 
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    var toggleThemeBtn = document.getElementById('toggle-theme-btn');

    toggleThemeBtn.addEventListener('click', function() {
        toggleThemeBtn.classList.toggle('on');
        toggleThemeBtn.classList.toggle('off');

        document.body.classList.toggle('dark');
    });
});
function highlightBox(box) {
box.style.filter = "brightness(0.9)";
}

function unhighlightBox(box) {
box.style.filter = "brightness(0.8)";
}