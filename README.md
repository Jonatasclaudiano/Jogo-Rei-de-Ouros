Jogo dos Números
Este é um jogo interativo baseado em navegador onde os jogadores escolhem números para competir por pontos e evitar penalidades. O objetivo é ser o primeiro a alcançar a casa 10 no tabuleiro ou ser o último jogador restante.

Como Jogar
Clone o repositório:

git clone https://github.com/SEU_USUARIO/jogo-dos-numeros.git
cd jogo-dos-numeros

Abra o index.html: Simplesmente abra o arquivo index.html no seu navegador web preferido.

Regras do Jogo
Objetivo: Ser o primeiro jogador a atingir a casa 10 no tabuleiro.

Número de Jogadores: O jogo pode ser jogado por 2 a 10 participantes.

Início do Jogo: Todos os jogadores começam na casa 0 (ponto de partida).

Escolha do Número por Rodada:

Em cada rodada, cada participante ativo deve escolher um número inteiro de 0 a 100.

A escolha do número é feita individualmente, em turnos, para que os outros jogadores não vejam a opção selecionada.

Cálculo do Número-Alvo:

Após todos os jogadores ativos terem escolhido seus números, a média de todos os números escolhidos na rodada é calculada.

Essa média é então multiplicada por 0.8 para determinar o número-alvo da rodada.

Movimento no Tabuleiro (Pontuação da Rodada):

O jogador que escolheu o número mais próximo do número-alvo da rodada avança 1 casa no tabuleiro (ganha 1 ponto).

Em caso de empate na proximidade com o número-alvo, o jogador com o menor ID (Jogador 1, depois Jogador 2, etc.) vence o desempate.

Todos os outros jogadores (que não foram o vencedor da rodada) retrocedem 1 casa no tabuleiro (perdem 1 ponto).

Regra de Números Duplicados:

Se dois ou mais jogadores escolherem o mesmo número em uma rodada, todos esses jogadores que escolheram o número duplicado retrocedem 1 casa adicional (perdem 1 ponto adicional).

Além da penalidade de ponto, jogadores que escolheram números duplicados não podem vencer a rodada por proximidade, mesmo que o número deles seja o mais próximo do número-alvo.

Penalidades Adicionais por Modo de Jogo:

No modo Fitness, quem perde pontos na rodada deve cumprir um castigo de exercício físico aleatório (sorteado entre flexões, polichinelos e abdominais).

No modo Bebedeira:

Quem perde pontos na rodada deve tomar uma dose.

Se um jogador perder pontos por três rodadas consecutivas, a penalidade para essa rodada (e qualquer rodada perdida subsequente enquanto a sequência de perdas continuar) será de duas doses.

No modo Normal, não há penalidades adicionais, apenas a perda de pontos no tabuleiro.

As penalidades são apresentadas em um pop-up individualmente para cada perdedor da rodada que se qualificar.

Condição de Eliminação: Um participante é eliminado do jogo se sua pontuação atingir a casa -10 ou menos. Jogadores eliminados permanecem na casa -10, mas não participam das rodadas futuras e são visualmente marcados.

Condição de Vitória: O jogo termina e um jogador vence quando:

Um participante alcança a casa 10 no tabuleiro ou mais.

Todos os outros participantes são eliminados, restando apenas um jogador ativo.

Reiniciar Jogo: O jogo pode ser reiniciado a qualquer momento, voltando à tela de seleção de modo de jogo.

Estrutura do Projeto
jogo-dos-numeros/
├── index.html
├── style.css
├── script.js
└── README.md

Tecnologias Utilizadas
HTML5: Estrutura do jogo.

CSS3 (com Tailwind CSS): Estilização e responsividade.

JavaScript: Lógica do jogo e interatividade.

Canvas Confetti: Para animações de vitória.

Google Gemini API: Para gerar dicas de estratégia (requer chave de API).

Contribuição
Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novos recursos.

Licença
Este projeto está licenciado sob a licença MIT.
