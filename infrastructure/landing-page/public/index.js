(() => {
  const RANDOM_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

  const INTERVAL_TIME = 50;
  const CHANCE = 0.05;

  const content = document.querySelector('#content');
  const paragraphs = Array.from(content.querySelectorAll('p'));
  const originalText = paragraphs.map(p => p.innerText);
  let randomizedText = randomizeText(originalText);

  const intervalId = setInterval(() => {
    let matchedCount = 0;

    randomizedText = randomizedText.map((paragraph, i) =>
      Array.from(paragraph).map((char, j) => {
        const origChar = originalText[i][j];
        
        if (char === origChar || Math.random() < CHANCE) {
          matchedCount++;
          return origChar;
        }
        
        return RANDOM_CHARACTERS[Math.floor(Math.random() * RANDOM_CHARACTERS.length)];
      }).join('')
    );

    paragraphs.forEach((p, i) => {
      p.innerText = randomizedText[i];
    });

    if (matchedCount === originalText.join('').length) {
      clearInterval(intervalId);
    }
  }, INTERVAL_TIME);

  function randomizeText(texts) {
    return texts.map(text => 
      Array.from(text).map(char => 
        RANDOM_CHARACTERS.includes(char) ? RANDOM_CHARACTERS[Math.floor(Math.random() * RANDOM_CHARACTERS.length)] : char
      ).join('')
    );
  }
})();
