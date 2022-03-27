(() => {
  const RANDOM_CHARACTERS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0'
  ];

  const INTERVAL_TIME = 50;
  const CHANCE = 0.05;

  const intervalId = setInterval(siftContent, INTERVAL_TIME);

  const content = document.querySelector('#content');
  const paragraphs = Array.from(content.querySelectorAll('p'));
  const originalContentHTML = content.innerHTML;
  const originalText = paragraphs.map((par) => par.innerText);
  const originalCount = originalText.reduce((a, c) => a + c.length, 0);

  let text = randomizeText();

  function siftContent() {
    let count = 0;
    text = text.map((paragraph, i) =>
      paragraph.map((char, j) => {
        const originalChar = originalText[i][j];

        if (char === originalChar || Math.random() < CHANCE) {
          count += 1;
          return originalChar;
        }

        return generateRandomChar();
      })
    );

    if (count !== originalCount) {
      paragraphs.forEach((p, i) => {
        p.innerText = text[i].join('');
      });
    } else {
      content.innerHTML = originalContentHTML;
      clearInterval(intervalId);
    }
  }

  function randomizeText() {
    return originalText.map((par) =>
      Array.from(par).map((char) =>
        RANDOM_CHARACTERS.includes(char) ? generateRandomChar() : char
      )
    );
  }

  function generateRandomChar() {
    return RANDOM_CHARACTERS[
      Math.ceil(Math.random() * RANDOM_CHARACTERS.length) - 1
    ];
  }
})();
