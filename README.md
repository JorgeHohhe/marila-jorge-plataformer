# Marila & Jorge: 1 mês da nossa história

Um site/jogo plataforma simples, feito em **HTML + CSS + JavaScript puro**, pensado para rodar direto no **GitHub Pages**.

A proposta é uma experiência romântica e jogável: a personagem atravessa capítulos da história, coleta memórias brilhantes, abre diálogos, destranca salas em sequência, passa pela galeria de fotos e chega a uma mensagem final interativa.

> Observação: o visual é uma floresta/cidade luminosa original, inspirado em atmosfera de fantasia, sem uso de artes, personagens ou assets de jogos existentes.

---

## Estrutura do projeto

```text
marila-jorge-platformer/
├── index.html
├── README.md
├── .nojekyll
├── assets/
│   ├── audio/
│   │   ├── .gitkeep
│   │   └── marila-jorge-theme.wav
│   └── photos/
│       └── .gitkeep
├── scripts/
│   └── generate_soundtrack.py
└── src/
    ├── audio.js
    ├── config.js
    ├── game.js
    └── styles.css
```

---

## Como testar no computador

Você pode abrir o `index.html` direto no navegador.

Se preferir simular melhor um site publicado, rode um servidor local na pasta do projeto:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

---

## Como personalizar

### 1. Alterar a data do início do namoro

Abra `src/config.js` e edite:

```js
startDate: "2026-05-16T20:00:00-03:00",
```

Use a data e hora real do pedido de namoro.

### 2. Alterar textos e capítulos

No mesmo arquivo, edite o array `chapters`.

Cada capítulo tem este formato:

```js
{
  id: "antes-de-tudo",
  // Aparece antes de interagir com a memória.
  title: "Antes de tudo começar",
  // Aparece como título grande quando a memória é aberta.
  place: "Estudos concurso PI e RN",
  mood: "study",
  text: "Texto da memória aqui...",
}
```

Você pode acrescentar, remover ou reescrever capítulos e textos.

### 3. Colocar as fotos de vocês

Coloque as fotos dentro de:

```text
assets/photos/
```

Com estes nomes:

```text
foto-01.jpg
foto-02.jpg
foto-03.jpg
foto-04.jpg
```

Se preferir outros nomes, altere os caminhos em `src/config.js`:

```js
photos: [
  { src: "assets/photos/foto-01.jpg", caption: "Nossa primeira foto favorita" },
]
```

---

## Trilha sonora

O jogo usa uma trilha original em loop:

```text
assets/audio/marila-jorge-theme.wav
```

Para recriar a trilha, rode:

```bash
python scripts/generate_soundtrack.py
```

---

## Controles

- Andar: `A` / `D` ou setas do teclado
- Pular: `Espaço`, `W` ou seta para cima
- Interagir: `E` ou `Enter`
- Celular: botões na tela
- Progresso: cada sala nova abre somente depois que a memória anterior for guardada

---

## Como publicar no GitHub Pages

### 1. Criar repositório e enviar arquivos

Na pasta do projeto:

```bash
git init
git add .
git commit -m "Primeira versão do jogo"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/marila-jorge-platformer.git
git push -u origin main
```

Troque `SEU-USUARIO` pelo seu usuário do GitHub.

### 2. Ativar o GitHub Pages

No GitHub:

1. Entre no repositório.
2. Vá em **Settings**.
3. Clique em **Pages**.
4. Em **Source**, escolha **Deploy from a branch**.
5. Em **Branch**, selecione `main` e a pasta `/root`.
6. Clique em **Save**.

O site ficará em um endereço parecido com:

```text
https://SEU-USUARIO.github.io/marila-jorge-platformer/
```

---

## Ideias para evoluir depois

- Adicionar música em arquivo `.mp3` no lugar da ambiência gerada.
- Criar sprites personalizados do casal.
- Adicionar uma tela de senha com uma data especial.
- Inserir novas fases para os próximos meses.
- Fazer uma versão com React/Vite se quiser componentes mais complexos.
