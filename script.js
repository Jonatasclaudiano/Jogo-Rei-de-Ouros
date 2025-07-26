// script.js

// Array para armazenar os participantes do jogo
let players = [];
let numPlayers = 0; // Será definido pelo utilizador
const winningScore = 10;
const losingScore = -10;
let currentPlayerIndex = 0; // Controla qual jogador está a inserir o número
let confettiInterval = null; // Para controlar o intervalo da animação de confetes
let gameMode = 'normal'; // Modo de jogo selecionado

// Variáveis para o pop-up de castigo
let punishmentPlayersQueue = []; // Fila de jogadores que precisam de castigo
let currentPunishmentPlayerIndex = 0;
// Castigos individuais para o modo Fitness (sorteado por vez)
const fitnessPunishments = [
    "5 Flexões",
    "10 Polichinelos",
    "5 Abdominais"
];

// Pre-defined avatar colors (10 colors)
const avatarColors = [
    { name: 'Verde', value: '#28A745' },
    { name: 'Vermelho', value: '#DC3545' },
    { name: 'Azul', value: '#007BFF' },
    { name: 'Roxo', value: '#6F42C1' },
    { name: 'Preto', value: '#343A40' },
    { name: 'Amarelo', value: '#FFC107' },
    { name: 'Laranja', value: '#FD7E14' },
    { name: 'Branco', value: '#F8F9FA' }, // White avatar will get a border
    { name: 'Marrom', value: '#6C4D32' },
    { name: 'Rosa', value: '#E83E8C' }
];

// Referências aos elementos do DOM
const playerCountSetup = document.getElementById('playerCountSetup');
const modeSelectionSection = document.getElementById('modeSelectionSection');
const confirmModeBtn = document.getElementById('confirmModeBtn');
const initialSetup = document.getElementById('initialSetup');
const playerCountInput = document.getElementById('playerCount');
const startGameBtn = document.getElementById('startGameBtn');
const nameInputSection = document.getElementById('nameInputSection');
const playerNamesAndAvatarsInputs = document.getElementById('playerNamesAndAvatarsInputs');
const confirmNamesBtn = document.getElementById('confirmNamesBtn');
const backToPlayerCountBtn = document.getElementById('backToPlayerCountBtn');
const backToModeSelectionBtn = document.getElementById('backToModeSelectionBtn');
const gameContent = document.getElementById('gameContent');

const gameBoard = document.getElementById('gameBoard');
const boardTrack = document.getElementById('boardTrack');

const startRoundBtn = document.getElementById('startRoundBtn');
const inputSection = document.getElementById('inputSection');
const currentPlayerName = document.getElementById('currentPlayerName');
const playerNumberInput = document.getElementById('playerNumberInput');
const submitNumberBtn = document.getElementById('submitNumberBtn');
const getHintBtn = document.getElementById('getHintBtn');
const hintDisplay = document.getElementById('hintDisplay');
const roundResultsDisplay = document.getElementById('roundResultsDisplay');
const targetNumberDisplay = document.getElementById('targetNumber');
const duplicatePenaltyMessage = document.getElementById('duplicatePenaltyMessage');
const winnerMessageDisplay = document.getElementById('winnerMessage');
const roundPenaltyDetails = document.getElementById('roundPenaltyDetails');
const messageArea = document.getElementById('messageArea');
const rulesBtn = document.getElementById('rulesBtn');
const rulesDisplay = document.getElementById('rulesDisplay');
const resetGameBtn = document.getElementById('resetGameBtn');

const winnerAnimationOverlay = document.getElementById('winnerAnimationOverlay');
const winnerNameDisplay = document.getElementById('winnerNameDisplay');

// Referências do pop-up de castigo
const punishmentOverlay = document.getElementById('punishmentOverlay');
const punishmentTitle = document.getElementById('punishmentTitle');
const punishmentPlayerName = document.getElementById('punishmentPlayerName');
const punishmentDescription = document.getElementById('punishmentDescription');
const punishmentActionButton = document.getElementById('punishmentActionButton');


/**
 * Prepara a interface para a seleção do modo de jogo.
 */
function initializeSetup() {
    playerCountSetup.classList.remove('hidden');
    modeSelectionSection.classList.remove('hidden'); // Mostra a seleção de modo
    initialSetup.classList.add('hidden'); // Esconde a seleção de quantidade
    nameInputSection.classList.add('hidden'); // Esconde a seção de nomes
    gameContent.classList.add('hidden');
    messageArea.textContent = 'Escolha o modo de jogo e clique em "Confirmar Modo".';
    playerNumberInput.value = '';
    rulesDisplay.style.display = 'none';
    playerNamesAndAvatarsInputs.innerHTML = ''; // Limpa os inputs de nomes/avatares
    hideWinnerAnimation();
    hidePunishmentPopup(); // Garante que o popup de castigo esteja escondido
    renderGameBoard(); // Renderiza o tabuleiro vazio ou com jogadores padrão
}

/**
 * Confirma o modo de jogo selecionado.
 */
function confirmGameMode() {
    const selectedMode = document.querySelector('input[name="gameMode"]:checked').value;
    gameMode = selectedMode;

    modeSelectionSection.classList.add('hidden');
    initialSetup.classList.remove('hidden'); // Mostra a seleção de quantidade de jogadores
    messageArea.textContent = 'Defina a quantidade de jogadores e clique em "Iniciar Jogo".';
}

/**
 * Gera os campos de input para os nomes dos jogadores e seletores de avatar.
 */
function promptForPlayerNames() {
    const selectedPlayerCount = parseInt(playerCountInput.value);

    if (isNaN(selectedPlayerCount) || selectedPlayerCount < 2 || selectedPlayerCount > 10) {
        messageArea.textContent = 'Por favor, escolha um número de jogadores entre 2 e 10.';
        return;
    }

    numPlayers = selectedPlayerCount;
    initialSetup.classList.add('hidden');
    nameInputSection.classList.remove('hidden');

    playerNamesAndAvatarsInputs.innerHTML = ''; // Limpa inputs anteriores
    for (let i = 0; i < numPlayers; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.className = "flex flex-col sm:flex-row items-center gap-2";

        const labelName = document.createElement('label');
        labelName.textContent = `Nome do Jogador ${i + 1}:`;
        labelName.className = "text-gray-700 font-semibold w-full sm:w-1/3";

        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = `playerName${i}`;
        inputName.placeholder = `Nome do Jogador ${i + 1}`;
        inputName.className = "p-2 rounded-lg border focus:ring-red-500 focus:border-red-500 w-full sm:w-2/3";
        inputName.value = `Jogador ${i + 1}`;

        const labelAvatar = document.createElement('label');
        labelAvatar.textContent = `Avatar:`;
        labelAvatar.className = "text-gray-700 font-semibold w-full sm:w-1/3 mt-2 sm:mt-0";

        const selectAvatar = document.createElement('select');
        selectAvatar.id = `playerAvatar${i}`;
        selectAvatar.className = "p-2 rounded-lg border focus:ring-red-500 focus:border-red-500 w-full sm:w-2/3";
        
        // Populate avatar options
        avatarColors.forEach((color, index) => {
            const option = document.createElement('option');
            option.value = color.value;
            option.textContent = color.name;
            selectAvatar.appendChild(option);
            // Set a default unique avatar color if available
            if (i < avatarColors.length) {
                if (avatarColors[i].name !== 'Branco' || numPlayers === 1 || i === 0) { // Prefer not white as default, unless few players
                   selectAvatar.value = avatarColors[i].value;
                } else {
                    selectAvatar.value = avatarColors[(i + 1) % avatarColors.length].value; // Shift if white
                }
            } else { // Fallback for more players than colors
                selectAvatar.value = avatarColors[i % avatarColors.length].value;
            }
        });

        playerDiv.appendChild(labelName);
        playerDiv.appendChild(inputName);
        playerDiv.appendChild(labelAvatar);
        playerDiv.appendChild(selectAvatar);
        
        playerNamesAndAvatarsInputs.appendChild(playerDiv);
    }
    messageArea.textContent = 'Digite os nomes e escolha os avatares. Depois, clique em "Confirmar Nomes".';
    rulesDisplay.style.display = 'none';
}

/**
 * Confirma os nomes e avatares dos jogadores e inicia o jogo.
 */
function confirmPlayerNames() {
    players = [];
    // Track chosen colors to warn about duplicates (optional, not enforced for now)
    let chosenColors = new Set(); 
    for (let i = 0; i < numPlayers; i++) {
        const nameInput = document.getElementById(`playerName${i}`);
        let name = nameInput.value.trim();
        if (name === '') {
            name = `Jogador ${i + 1}`;
        }

        const avatarSelect = document.getElementById(`playerAvatar${i}`);
        let avatarColor = avatarSelect.value;
        chosenColors.add(avatarColor); // For potential future duplicate avatar warning

        players.push({
            id: i,
            name: name,
            score: 0,
            chosenNumber: null,
            isEliminated: false,
            avatarColor: avatarColor,
            consecutiveLostRounds: 0 // NOVO: Contador para rodadas perdidas consecutivas
        });
    }

    nameInputSection.classList.add('hidden');
    gameContent.classList.remove('hidden');
    renderGameBoard(); // Renderiza o tabuleiro com os avatares recém-definidos
    updateUI(); // Posiciona os avatares
    startRoundBtn.classList.remove('disabled-button');
    startRoundBtn.disabled = false;
    inputSection.classList.add('hidden');
    roundResultsDisplay.style.display = 'none';
    messageArea.textContent = 'Jogo pronto! Clique em "Iniciar Nova Rodada" para começar.';
    hintDisplay.textContent = '';
    rulesDisplay.style.display = 'none';
}

/**
 * Renderiza o tabuleiro do jogo e posiciona os avatares.
 */
function renderGameBoard() {
    boardTrack.innerHTML = ''; // Limpa o tabuleiro existente
    
    // Cria os quadrados do tabuleiro de -10 a 10
    for (let s = -10; s <= 10; s++) {
        const square = document.createElement('div');
        square.id = `square-${s}`; // ID único para cada quadrado
        square.className = 'board-square';
        
        if (s === 0) {
            square.classList.add('start-square');
            square.textContent = 'INÍCIO';
        } else if (s === 10) {
            square.classList.add('finish-square');
            square.textContent = 'FIM';
        } else if (s === -10) {
            square.classList.add('elimination-square');
            square.textContent = 'ELIM.';
        } else {
            square.textContent = s;
        }
        boardTrack.appendChild(square);
    }

    // Cria os avatares e os anexa às casas iniciais (score 0)
    players.forEach(player => {
        const avatar = document.createElement('div');
        avatar.id = `avatar-${player.id}`;
        avatar.className = `player-avatar`;
        avatar.style.backgroundColor = player.avatarColor;
        if (player.avatarColor === '#F8F9FA') { // White color
            avatar.classList.add('white-avatar');
        }
        // Nome do jogador abaixo do avatar
        const nameTag = document.createElement('span');
        nameTag.className = 'player-name-on-board';
        nameTag.textContent = player.name;
        avatar.appendChild(nameTag);

        // Adiciona o avatar à casa inicial (score 0)
        const initialSquare = document.getElementById(`square-${Math.max(-10, Math.min(10, player.score))}`);
        if (initialSquare) {
            initialSquare.appendChild(avatar);
        }
    });
    updateUI(); // Chama updateUI para garantir o posicionamento inicial dos avatares
}

/**
 * Posiciona um avatar específico no tabuleiro, incluindo offset para múltiplos jogadores na mesma casa.
 * @param {object} player - O objeto jogador.
 */
function positionAvatar(player) {
    let actualScore = Math.max(-10, Math.min(10, player.score)); // Garante que o score esteja entre -10 e 10
    const targetSquare = document.getElementById(`square-${actualScore}`);
    let avatarElement = document.getElementById(`avatar-${player.id}`);

    if (targetSquare && avatarElement) {
        // Move o avatar para a nova casa se ele não estiver lá
        if (avatarElement.parentNode !== targetSquare) {
            // Remove de onde estiver e adiciona ao novo pai
            if (avatarElement.parentNode) {
                avatarElement.parentNode.removeChild(avatarElement);
            }
            targetSquare.appendChild(avatarElement);
        }

        // Determina a posição dentro da célula para espalhar avatares
        const avatarsInThisSquare = Array.from(targetSquare.querySelectorAll('.player-avatar'));
        const playerIndexInSquare = avatarsInThisSquare.indexOf(avatarElement);
        const numAvatarsInSquare = avatarsInThisSquare.length;

        // Simple grid-like spread for up to 4 players, then stack (or more complex if needed)
        let offsetX = 0;
        let offsetY = 0;
        const spreadAmount = 10; // Pixels to spread

        // Distribute players within the square to avoid perfect overlap
        // Example for 1-4 players:
        if (numAvatarsInSquare === 1) {
            // Centered
            offsetX = 0;
            offsetY = 0;
        } else if (numAvatarsInSquare === 2) {
            offsetX = (playerIndexInSquare === 0 ? -spreadAmount / 2 : spreadAmount / 2);
            offsetY = 0;
        } else if (numAvatarsInSquare === 3) {
            if (playerIndexInSquare === 0) { offsetX = -spreadAmount; offsetY = 0; }
            else if (playerIndexInSquare === 1) { offsetX = 0; offsetY = 0; }
            else { offsetX = spreadAmount; offsetY = 0; }
        } else if (numAvatarsInSquare >= 4) { // For 4 or more, a 2x2 grid or similar
            const row = Math.floor(playerIndexInSquare / 2);
            const col = playerIndexInSquare % 2;
            offsetX = (col === 0 ? -spreadAmount / 2 : spreadAmount / 2);
            offsetY = (row === 0 ? -spreadAmount / 2 : spreadAmount / 2);
            if (numAvatarsInSquare > 4) { // Further reduce spread if too many
                offsetX *= 0.8;
                offsetY *= 0.8;
            }
        }
        
        avatarElement.style.left = `calc(50% + ${offsetX}px)`;
        avatarElement.style.top = `calc(50% + ${offsetY}px)`;
        avatarElement.style.transform = `translate(-50%, -50%)`; // Always center initially, then offset

        // Update eliminated visual state
        if (player.isEliminated) {
            avatarElement.classList.add('eliminated-avatar');
        } else {
            avatarElement.classList.remove('eliminated-avatar');
        }
    }
}

/**
 * Atualiza a interface do utilizador com as pontuações e a posição dos avatares.
 */
function updateUI() {
    // Apenas atualiza a posição dos avatares no tabuleiro
    players.forEach(player => positionAvatar(player));
}

/**
 * Inicia uma nova rodada, preparando para a entrada de números.
 */
function startRound() {
    // Reinicia os números escolhidos para a rodada
    players.forEach(player => player.chosenNumber = null);
    currentPlayerIndex = 0;
    startRoundBtn.classList.add('disabled-button');
    startRoundBtn.disabled = true;
    roundResultsDisplay.style.display = 'none'; // Esconde resultados da rodada anterior
    duplicatePenaltyMessage.classList.add('hidden'); // Esconde a mensagem de duplicata
    roundPenaltyDetails.innerHTML = ''; // Limpa as mensagens de penalidade da rodada
    hintDisplay.textContent = ''; // Limpa a dica para a nova rodada
    rulesDisplay.style.display = 'none'; // Esconde as regras
    hideWinnerAnimation(); // Garante que a animação esteja escondida ao iniciar uma nova rodada
    hidePunishmentPopup(); // Garante que o popup de castigo esteja escondido

    promptNextPlayer();
}

/**
 * Solicita ao próximo jogador ativo que insira o seu número.
 */
function promptNextPlayer() {
    // Pula jogadores eliminados
    while (currentPlayerIndex < numPlayers && players[currentPlayerIndex].isEliminated) {
        currentPlayerIndex++;
    }

    if (currentPlayerIndex < numPlayers) {
        // Se ainda há jogadores para inserir números
        inputSection.classList.remove('hidden');
        currentPlayerName.textContent = `É a vez do ${players[currentPlayerIndex].name}:`;
        playerNumberInput.value = ''; // Limpa o campo de input
        playerNumberInput.focus(); // Coloca o foco no input
        messageArea.textContent = `Aguardando ${players[currentPlayerIndex].name} escolher um número.`;
        hintDisplay.textContent = ''; // Limpa qualquer dica anterior ao mudar de jogador
        rulesDisplay.style.display = 'none'; // Esconde as regras
    } else {
        // Todos os jogadores ativos inseriram os seus números, agora calcula a rodada
        inputSection.classList.add('hidden');
        calculateRoundResults();
    }
}

/**
 * Processa o número submetido pelo jogador atual.
 */
function submitNumber() {
    const num = parseInt(playerNumberInput.value);

    if (isNaN(num) || num < 0 || num > 100) {
        messageArea.textContent = `Erro: Por favor, ${players[currentPlayerIndex].name}, escolha um número entre 0 e 100.`;
        return;
    }

    players[currentPlayerIndex].chosenNumber = num;
    currentPlayerIndex++; // Passa para o próximo jogador
    promptNextPlayer(); // Chama para o próximo jogador ou calcula resultados
}

/**
 * Calcula os resultados da rodada e atualiza as pontuações.
 */
function calculateRoundResults() {
    let activeRoundNumbers = [];
    players.forEach(player => {
        if (!player.isEliminated && player.chosenNumber !== null) {
            activeRoundNumbers.push(player.chosenNumber);
        }
    });

    if (activeRoundNumbers.length === 0) {
        messageArea.textContent = 'Todos os jogadores foram eliminados ou o jogo já terminou!';
        endGame();
        return;
    }

    // 1. Calcular penalidades por números duplicados e identificar inelegíveis para vencer
    const numberCounts = {};
    players.forEach(player => {
        if (!player.isEliminated && player.chosenNumber !== null) {
            numberCounts[player.chosenNumber] = (numberCounts[player.chosenNumber] || 0) + 1;
        }
    });

    let playersWithDuplicatePenalty = [];
    // Flag para rastrear se o jogador pode vencer a rodada por proximidade
    players.forEach(player => {
        if (!player.isEliminated && player.chosenNumber !== null) {
            player.canWinRound = true; // Assume que pode vencer inicialmente
            if (numberCounts[player.chosenNumber] > 1) {
                player.score -= 1; // Perde 1 ponto adicional
                playersWithDuplicatePenalty.push(player.name);
                player.canWinRound = false; // Não pode vencer a rodada por proximidade
            }
        }
    });

    if (playersWithDuplicatePenalty.length > 0) {
        duplicatePenaltyMessage.classList.remove('hidden');
        duplicatePenaltyMessage.textContent = `Penalidade por duplicata: ${playersWithDuplicatePenalty.join(', ')} perderam 1 ponto adicional e não podem vencer a rodada!`;
    } else {
        duplicatePenaltyMessage.classList.add('hidden');
    }


    // 2. Calcular o número-alvo e o vencedor da rodada (apenas entre os que podem vencer)
    const sumOfNumbers = activeRoundNumbers.reduce((sum, num) => sum + num, 0);
    const averageOfNumbers = sumOfNumbers / activeRoundNumbers.length; // CALCULANDO A MÉDIA
    const targetNumber = averageOfNumbers * 0.8; // USANDO A MÉDIA AQUI

    let minDifference = Infinity;
    let winningPlayer = null;

    // Filtra apenas jogadores elegíveis para vencer esta rodada por proximidade
    const eligiblePlayersForProximityWin = players.filter(player => !player.isEliminated && player.chosenNumber !== null && player.canWinRound);

    if (eligiblePlayersForProximityWin.length > 0) {
        eligiblePlayersForProximityWin.forEach(player => {
            const diff = Math.abs(player.chosenNumber - targetNumber);
            if (diff < minDifference) {
                minDifference = diff;
                winningPlayer = player;
            } else if (diff === minDifference) {
                // Regra de desempate: quem tiver o menor ID vence
                if (winningPlayer === null || player.id < winningPlayer.id) {
                    winningPlayer = player;
                }
            }
        });
    }


    // Exibe os resultados da rodada
    roundResultsDisplay.style.display = 'flex';
    targetNumberDisplay.textContent = `Número-alvo: ${targetNumber.toFixed(2)}`;
    
    if (winningPlayer) {
        winnerMessageDisplay.textContent = `Vencedor da Rodada: ${winningPlayer.name} (escolheu ${winningPlayer.chosenNumber})`;
    } else {
        winnerMessageDisplay.textContent = `Não houve vencedor por proximidade nesta rodada (apenas penalidades aplicadas).`;
    }

    // 3. Atualiza as pontuações pela vitória/derrota da rodada e verifica condições de vitória/eliminação
    let gameEnded = false;
    let finalWinner = null; // Para guardar o jogador que venceu
    let playersWhoNeedPunishmentPopup = []; // Para coletar quem vai pro castigo no popup

    players.forEach(player => {
        if (!player.isEliminated) {
            let lostPointThisRound = false; // Flag para saber se perdeu ponto nesta fase
            // Aplica ponto de vitória APENAS se houver um vencedor e for ele
            if (winningPlayer && player.id === winningPlayer.id) {
                player.score += 1;
                player.consecutiveLostRounds = 0; // Reset consecutive losses on win
            } else if (winningPlayer && player.id !== winningPlayer.id) {
                // Se houve vencedor por proximidade e não é este jogador, ele perde 1 ponto
                player.score -= 1;
                lostPointThisRound = true;
                player.consecutiveLostRounds++; // Increment consecutive losses
            } else if (!winningPlayer && player.canWinRound === true) {
                // Se não houve vencedor por proximidade, e este jogador não teve duplicata, ele perde 1 ponto
                player.score -= 1;
                lostPointThisRound = true;
                player.consecutiveLostRounds++; // Increment consecutive losses
            } else if (!winningPlayer && !player.canWinRound) {
                // If no winner and player had duplicate number, they still lost a point due to duplicate.
                // Their consecutiveLostRounds should still increment as they did not win.
                lostPointThisRound = true;
                player.consecutiveLostRounds++;
            } else { // Player neither won nor lost (e.g., eliminated or no relevant action for the round)
                player.consecutiveLostRounds = 0; // Reset if they didn't actively lose a point this round
            }


            // Coletar jogadores que perderam pontos para o pop-up de castigo
            if (lostPointThisRound || (numberCounts[player.chosenNumber] > 1 && !player.canWinRound)) {
                if (gameMode === 'bebedeira') {
                     // Every lost round triggers a punishment, amount depends on consecutive losses
                     playersWhoNeedPunishmentPopup.push(player);
                } else if (gameMode === 'fitness') { // Fitness, always adds for popup
                    playersWhoNeedPunishmentPopup.push(player);
                }
            }

            // Verifica condição de eliminação
            if (player.score <= losingScore) {
                player.isEliminated = true;
                messageArea.textContent = `${player.name} foi ELIMINADO na casa ${player.score}!`;
            }
            // Verifica condição de vitória
            if (player.score >= winningScore) {
                finalWinner = player; // Define o vencedor final
                gameEnded = true;
            }
        }
    });
    
    // Exibe as penalidades da rodada (apenas texto, o popup é separado)
    roundPenaltyDetails.innerHTML = '';
    if (playersWhoNeedPunishmentPopup.length > 0 && gameMode !== 'normal') {
        roundPenaltyDetails.innerHTML += `<p class="text-md text-red-200 mt-2">Castigo(s) para:</p>`;
        playersWhoNeedPunishmentPopup.forEach(p => {
            let penaltyText = '';
            if (gameMode === 'fitness') {
                penaltyText = `Um exercício Fitness!`;
            } else if (gameMode === 'bebedeira') {
                const doses = p.consecutiveLostRounds >= 3 ? 'Duas doses!' : 'Uma dose!';
                penaltyText = `${doses}`;
            }
            roundPenaltyDetails.innerHTML += `<p class="text-sm text-red-200">- ${p.name}: ${penaltyText}</p>`;
        });
    }


    updateUI(); // Atualiza a UI após a rodada (posiciona avatares)

    // Verifica se o jogo deve terminar e aciona a animação ou os castigos
    if (gameEnded) {
        showWinnerAnimation(finalWinner.name); // Mostra a animação do vencedor
        endGame();
    } else {
        const activePlayers = players.filter(p => !p.isEliminated);
        if (activePlayers.length <= 1) { // Se restou 1 ou nenhum jogador ativo
            if (activePlayers.length === 1 && activePlayers[0].score < winningScore) {
                 messageArea.textContent = `${activePlayers[0].name} é o último jogador restante e venceu por eliminação dos outros!`;
                 showWinnerAnimation(activePlayers[0].name); // Mostra animação mesmo se for por eliminação
            } else if (activePlayers.length === 0) {
                 messageArea.textContent = `Todos os jogadores foram eliminados! O jogo terminou sem um vencedor por pontos.`;
            }
            endGame();
        } else {
            // Se o jogo não terminou e há castigos para serem exibidos, mostra o popup
            if (playersWhoNeedPunishmentPopup.length > 0) { 
                showPunishmentPopup(playersWhoNeedPunishmentPopup);
            } else { // Se não há castigos a exibir, libera o botão de nova rodada
                startRoundBtn.classList.remove('disabled-button');
                startRoundBtn.disabled = false;
                if (!messageArea.textContent.includes("ELIMINADO") && !messageArea.textContent.includes("VENCEU")) {
                    messageArea.textContent = 'Clique em "Iniciar Nova Rodada" para a próxima rodada.';
                }
            }
        }
    }
}

/**
 * Exibe a animação de vitória com confetes.
 * @param {string} winnerName - O nome do jogador vencedor.
 */
function showWinnerAnimation(winnerName) {
    winnerNameDisplay.textContent = winnerName;
    winnerAnimationOverlay.classList.remove('hidden');
    winnerAnimationOverlay.classList.add('show');

    const myCanvas = document.createElement('canvas');
    myCanvas.id = 'confettiCanvas';
    myCanvas.className = 'absolute inset-0 w-full h-full pointer-events-none';
    winnerAnimationOverlay.appendChild(myCanvas);

    const myConfetti = confetti.create(myCanvas, { resize: true, useWorker: true });

    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    (function frame() {
        myConfetti(Object.assign({}, defaults, {
            particleCount: 2,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        myConfetti(Object.assign({}, defaults, {
            particleCount: 2,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));

        if (Date.now() < animationEnd) {
            confettiInterval = requestAnimationFrame(frame);
        } else {
            if (myCanvas) {
                myConfetti.reset();
                myCanvas.remove();
            }
        }
    }());

    setTimeout(() => {
        hideWinnerAnimation();
    }, duration + 500);
}

/**
 * Esconde a animação de vitória e limpa os confetes.
 */
function hideWinnerAnimation() {
    winnerAnimationOverlay.classList.remove('show');
    winnerAnimationOverlay.classList.add('hidden');
    if (confettiInterval) {
        cancelAnimationFrame(confettiInterval);
        confettiInterval = null;
    }
    const existingCanvas = document.getElementById('confettiCanvas');
    if (existingCanvas) {
        confetti.reset();
        existingCanvas.remove();
    }
}

/**
 * Exibe o pop-up de castigo para os jogadores que perderam pontos.
 * @param {Array<Object>} playersToPunish - Array de objetos de jogadores que perderam pontos.
 */
function showPunishmentPopup(playersToPunish) {
    // Filtra jogadores que ainda não estão eliminados para os castigos
    punishmentPlayersQueue = playersToPunish.filter(player => !player.isEliminated); 
    if (punishmentPlayersQueue.length === 0) {
        // Se não há mais jogadores para castigar, libera o botão de nova rodada
        startRoundBtn.classList.remove('disabled-button');
        startRoundBtn.disabled = false;
        messageArea.textContent = 'Clique em "Iniciar Nova Rodada" para a próxima rodada.';
        return;
    }

    currentPunishmentPlayerIndex = 0; // Começa pelo primeiro jogador na fila
    punishmentOverlay.classList.remove('hidden');
    punishmentOverlay.classList.add('show');
    displayNextPunishment(); // Inicia a exibição dos castigos
}

/**
 * Exibe o próximo castigo na fila ou para o próximo jogador.
 */
function displayNextPunishment() {
    if (currentPunishmentPlayerIndex >= punishmentPlayersQueue.length) {
        // Todos os castigos foram aplicados, esconde o pop-up
        hidePunishmentPopup();
        startRoundBtn.classList.remove('disabled-button');
        startRoundBtn.disabled = false;
        messageArea.textContent = 'Clique em "Iniciar Nova Rodada" para a próxima rodada.';
        return;
    }

    const currentPlayer = punishmentPlayersQueue[currentPunishmentPlayerIndex];
    punishmentPlayerName.textContent = currentPlayer.name; // Nome do jogador no pop-up

    if (gameMode === 'fitness') {
        // Sorteia um castigo de fitness aleatoriamente
        const randomPunishment = fitnessPunishments[Math.floor(Math.random() * fitnessPunishments.length)];
        punishmentDescription.textContent = randomPunishment;
        punishmentActionButton.textContent = "Ok, Entendi!";
        punishmentActionButton.onclick = () => {
            currentPunishmentPlayerIndex++; // Vai para o próximo jogador na fila
            displayNextPunishment(); // Chama para o próximo jogador ou esconde o pop-up
        };
    } else if (gameMode === 'bebedeira') {
        // Determina as doses com base nas rodadas consecutivas perdidas
        if (currentPlayer.consecutiveLostRounds >= 3) {
            punishmentDescription.textContent = "Tomar duas doses!";
        } else {
            punishmentDescription.textContent = "Tomar uma dose!";
        }
        punishmentActionButton.textContent = "Ok, Entendi!";
        punishmentActionButton.onclick = () => {
            currentPunishmentPlayerIndex++;
            displayNextPunishment();
        };
    }
}

/**
 * Esconde o pop-up de castigo.
 */
function hidePunishmentPopup() {
    punishmentOverlay.classList.remove('show');
    punishmentOverlay.classList.add('hidden');
    punishmentPlayersQueue = []; // Limpa a fila
    currentPunishmentPlayerIndex = 0;
}

/**
 * Finaliza o jogo, desabilitando os botões de ação e retornando ao setup.
 */
function endGame() {
    startRoundBtn.classList.add('disabled-button');
    startRoundBtn.disabled = true;
    inputSection.classList.add('hidden');
    hidePunishmentPopup(); // Garante que o popup de castigo esteja escondido ao fim do jogo
}

/**
 * Alterna a visibilidade da seção de regras.
 */
function toggleRulesDisplay() {
    if (rulesDisplay.style.display === 'none' || rulesDisplay.style.display === '') {
        rulesDisplay.style.display = 'flex';
        messageArea.textContent = 'Aqui estão as regras do jogo. Divirta-se!';
        hidePunishmentPopup(); // Esconde o popup de castigo se as regras forem abertas
    } else {
        rulesDisplay.style.display = 'none';
        messageArea.textContent = 'Regras escondidas. Clique em "Regras" para vê-las novamente.';
    }
}

/**
 * Chama a API do Gemini para obter uma dica de estratégia.
 */
async function getStrategyHint() {
    hintDisplay.textContent = 'A gerar dica...';
    getHintBtn.disabled = true;

    const prompt = "Estou a jogar um jogo onde vários participantes escolhem um número de 0 a 100. A média de todos os números escolhidos é multiplicada por 0.8 para obter um 'número-alvo'. O participante que escolher o número mais próximo desse 'número-alvo' ganha a rodada. Quais são as melhores estratégias para escolher um número para maximizar as minhas chances de ganhar? Por favor, forneça uma dica concisa e direta, com foco numa estratégia numérica ou de comportamento.";

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will automatically provide the API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    let retries = 0;
    const maxRetries = 5;
    let delay = 1000;

    while (retries < maxRetries) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                hintDisplay.textContent = `Dica: ${text}`;
                break;
            } else {
                hintDisplay.textContent = 'Não foi possível obter uma dica no momento. Tente novamente.';
                console.error('Unexpected API response structure:', result);
                break;
            }
        } catch (error) {
            console.error('Error fetching strategy hint:', error);
            retries++;
            if (retries < maxRetries) {
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
            } else {
                hintDisplay.textContent = 'Não foi possível obter uma dica. Verifique a sua conexão ou tente mais tarde.';
            }
        }
    }
    getHintBtn.disabled = false;
}

// Adiciona event listeners aos botões
confirmModeBtn.addEventListener('click', confirmGameMode); // Primeiro passo: confirmar modo
startGameBtn.addEventListener('click', promptForPlayerNames); // Segundo passo: pedir nomes
confirmNamesBtn.addEventListener('click', confirmPlayerNames); // Terceiro passo: confirmar nomes e iniciar
backToPlayerCountBtn.addEventListener('click', () => { // Voltar da seleção de nomes para quantidade
    nameInputSection.classList.add('hidden');
    initialSetup.classList.remove('hidden');
    messageArea.textContent = 'Defina a quantidade de jogadores e clique em "Iniciar Jogo".';
});
backToModeSelectionBtn.addEventListener('click', initializeSetup); // Voltar da quantidade para seleção de modo

startRoundBtn.addEventListener('click', startRound);
submitNumberBtn.addEventListener('click', submitNumber);
getHintBtn.addEventListener('click', getStrategyHint);
rulesBtn.addEventListener('click', toggleRulesDisplay);
resetGameBtn.addEventListener('click', initializeSetup); // Reset volta para o início (seleção de modo)

// Inicializa o setup do jogo quando a página carrega
window.onload = initializeSetup;
