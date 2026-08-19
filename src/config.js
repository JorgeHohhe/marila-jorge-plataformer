/*
  Edite este arquivo para personalizar a história.
  - START_DATE: data/hora em que o namoro começou.
  - soundtrack: trilha sonora original do jogo.
  - photos: caminhos das fotos da galeria.
  - chapters: capítulos, cenários e textos das memórias do jogo.
*/

window.LOVE_STORY = {
  title: "Marila & Jorge: 3 meses da nossa história",
  couple: {
    her: "Marila",
    him: "Jorge",
  },
  // Ajuste para a data/hora real do pedido de namoro.
  startDate: "2026-05-20T01:00:00-03:00",
  soundtrack: {
    src: "assets/audio/marila-jorge-theme.wav",
    volume: 0.40,
  },
  finalMessage:
    "Amor, isso tudo foi apenas o que eu lembrei para esta surpresa, porque eu adorei todos os momentos que passamos juntos, mesmo os que eu esqueci de falar aqui, pode ter certeza. Esse é só o nosso terceiro mês, mas ainda temos inúmeros outros capítulos, momentos, viagens, e eu ainda quero viver vários meses e até anos ao seu lado. Você é uma pessoa completamente incrível, que tenho muita sorte de ter como namorada. Gosto muito muito MUITO de você.",
  photos: [
    {
      src: "assets/photos/BH-primeira.jpeg",
      caption: "Nossa primeira foto de todas",
    },
    {
      src: "assets/photos/Teresina.jpeg",
      caption: "Nossa primeira foto em Teresina",
    },
    {
      src: "assets/photos/Natal.jpeg",
      caption: "Nossa primeira foto em Natal",
    },
    {
      src: "assets/photos/Fortaleza.jpeg",
      caption: "Nossa primeira viagem juntos (e na praia)",
    },
  ],
  chapters: [
    {
      id: "antes-de-tudo",
      title: "Antes De Tudo",
      place: "Estudos para concurso",
      mood: "study",
      text: `Duas rotas diferentes, uma mesma aproximação.

Éramos dois jovens simples, cada um tentando abrir uma porta diferente na própria vida. Você estudava com dedicação para sair de Minas, e eu estudava querendo sair do mercado financeiro para encontrar um caminho com mais qualidade de vida.
A gente ainda não sabia, mas enquanto cada um corria atrás do próprio futuro, a vida já estava preparando um encontro entre nós dois. O improvável já estava se organizando. Entre você estudando em Minas Gerais e eu estudando no Piauí, entre várias matérias e questões, a vida foi criando uma ponte silenciosa que estava unindo cada um de nós.`,
    },
    {
      id: "como-tudo-comecou",
      title: "Como tudo começou",
      place: "Como Tudo Começou: Curso De Formação No Piauí",
      mood: "training",
      text: `Foi ali, nossa primeira interação começou no Piauí, no meio do Curso de Formação, quando tudo ainda parecia só mais uma etapa importante da vida de cada um de nós.

Você lembra melhor do que eu da nossa primeira interação, alguma fala sobre LoL ainda naquele primeiro auditório. Eu confesso que não lembro exatamente da nossa primeira conversa, mas lembro bem de ter te convencido a ir para o karaokê.
Aquele dia ficou marcado e foi muito importante. Assim como, para mim, também ficou marcado o dia do churrasco do sindicato no clube dos auditores.

Eram para ser momentos simples no meio daquelas conversas do dia a dia, mas eu sentia que ali já existia alguma coisa querendo se aproximar. (Todo mundo já sabia, menos o Thales).`,
    },
    {
      id: "bh-encontro",
      title: "Viagem para Belo Horizonte",
      place: "Belo Horizonte: Onde Eu Fui Te Buscar",
      mood: "city",
      text: `No meio de tantas dúvidas e incertezas, em Belo Horizonte, eu fui te buscar.

Depois de muito tempo de voo e de Uber, perto das 22h, te vi pela primeira vez após o Curso de Formação. Ali já foi um momento de felicidade, te ver com um sorriso de orelha a orelha depois de muita ansiedade.
Na grande padaria Dupão, teve nosso primeiro encontro só nós dois, disse minha primeira declaração e aconteceu nosso primeiro beijo. Foi um momento mágico, com vários lembretes de "Jorge, padaria".

Impossível esquecer também que, no outro dia, tinha um pudim especial feito só para mim, memória que guardo com muito carinho. Tive que retribuir com um cappuccino especial feito só pra você.

Além disso, veio o Topo do Mundo, eu te tirando de BH e te levando para Nova Lima, nosso primeiro fondue, com uma vista de BH para se perder no horizonte da cidade e uma madrugada que viraria lembrança para sempre. Naquele momento, dia 20 de maio de 2026, houve o pedido de namoro. Depois que você aceitou, viramos os primeiros namorados um do outro.

Eu ainda não sabia, mas meu mundo ficaria cada vez mais bonito, mais legal e melhor ao seu lado.`,
    },
    {
      id: "teresina",
      title: "Teresina",
      place: "Teresina: Onde Consolidamos Nossa Relação",
      mood: "warm",
      text: `Teresina foi onde a nossa relação ganhou ainda mais forma, presença e certeza.

No Monã, rooftop especial igual o Topo do Mundo, veio a "segunda parte" do pedido de namoro, agora com a nossa linda aliança que tenho orgulho de carregar todos os dias, o que já era sentimento naquele dia também virou símbolo. E, com ela, aquela certeza: eu queria te escolher de verdade. Vontade de cuidar, de rir, de somar, de ficar e de construir um futuro lindo ao seu lado. Eu queria que você fizesse parte do meu futuro, e você aceitou que eu fizesse parte do seu.

Você também conheceu o Malagueta, com sua famosa picanha e o famoso baião de dois ensopado que deixa qualquer um ratinho gorducho.

No meio desses lugares, comidas e cafés da manhã preparados com todo o carinho, eu fui percebendo o quanto era bom dividir minha rotina com você.`,
    },
    {
      id: "divinopolis",
      title: "Divinópolis",
      place: "Viagem corrida, mas perfeita",
      mood: "road",
      text: `Divinópolis foi uma viagem apressada, mas perfeita do nosso jeito. Às vezes, o tempo é curto, mas um encontro contigo não precisa de muito tempo para virar lembrança boa.

Foi onde conheci sua tia, Liana, e seus avós, Cleide e Carlos, no sítio mais bonito que eu já vi na minha vida, em uma atmosfera de paz suprema. Vivi um pedacinho da sua família, conhecer quem fez parte da sua história também foi uma forma de me aproximar ainda mais do seu mundo.

Por que não pedimos uma mantinha de casal mesmo?`,
    },
    {
      id: "teresina-de-novo",
      title: "Teresina (parte 2)",
      place: "Teresina: Antes Da Mudança Para Natal",
      mood: "stars",
      text: `Antes mesmo de você vir para Teresina, com um mês de namoro, chegaram flores, chocolate e uma cartinha que eu queria muito ter entregado pessoalmente. Era meu jeito de tentar estar perto, mesmo quando a distância ainda insistia em aparecer. Nesse mesmo tempo, veio mais uma felicidade enorme para a minha vida: tomei posse como auditor no Piauí, consegui a qualidade de vida que eu tanto buscava.

Quando você já estava em Teresina, ganhou mais uma surpresa: uma massagem completa no Buddah SPA para aproveitar a manhã de esposa-troféu enquanto o namorado se matava de trabalhar na Sefaz-PI. "Esse moço faz todas as suas vontades mesmo".`,
    },
    {
      id: "natal",
      title: "Conhecendo Natal",
      place: "Natal: Posse, Caicó E Camarões",
      mood: "study",
      text: `Foi a primeira vez conhecendo a terra da minha mulher, e eu tive a alegria de estar ao seu lado em um momento importante (abençoado Januário): sua posse no concurso que você sempre sonhou tanto.

Teve festa na beira do mar, teve Caicó, com eu provando língua pela primeira vez, teve o camarão do Camarões, eterno rival do Coco Bambu. Além de conhecer seus pais, que são pessoas muito boas e gentis.

Minha primeira passagem por Natal foi curta, mas com memórias para sempre.`,
    },
    {
      id: "fortaleza",
      title: "Fortaleza",
      place: "Fortaleza: Nossa Primeira Viagem Para A Praia",
      mood: "training",
      text: `Incrivelmente, nossa primeira praia juntos não foi no Piauí e nem no Rio Grande do Norte. Foi no Ceará. Aproveitamos a Praia do Futuro, com direito a frescobol, banho de mar e, no fim, um crepe de morango, porque eu claramente não ganho uma discussão. Depois vimos a melhor vista para o pôr do sol (mesmo sem conseguirmos a foto perfeita) e comemos um camarão delicioso no Estalleiro.

Foi muito legal e muito nosso. Rendeu demais, mesmo com o tempo curto.`,
    },
    {
      id: "teresina-aniversario",
      title: "Até daqui uns dias",
      place: "Teresina: Aniversário De 26 Anos",
      mood: "city",
      text: `Agora meu amorzinho vai me ver ficando mais velho. E, pelo visto, também vai continuar dizendo que meu tempo acabou. Mas se o tempo vai acabar, que bom que vai ser assim: com você perto, rindo de mim e convivendo comigo.

Do começo do nosso namoro pra cá, a cada dia que passa só aumenta a minha certeza de que eu fiz a escolha certa e de que eu quero estar com você. Eu adoro nosso convívio leve e sincero. A gente se dá bem demais, combinamos muito! Eu quero sempre te dar o meu carinho, o meu cuidado, a minha atenção, te trazer segurança, de ser uma parte feliz do seu dia a dia e tenho a vontade real de construir algo verdadeiro com você.

O presente está sendo ótimo e, quebrando a barreira da distância, nosso futuro juntos é ainda mais promissor.`,
    },
  ],
};
