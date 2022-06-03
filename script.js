const inputBar = document.querySelector("#input");
const letterNodes = Array.from(document.querySelectorAll(".letterDisplay"));
const finalDisplay = document.querySelector("#display");

inputBar.addEventListener("keyup", (e) => {
  const stringithing = inputBar.value;

  const arrayedStringithing = stringithing.split("");

  letterNodes.map((span, number) => {
    if (!(arrayedStringithing[number] === undefined)) {
      span.innerHTML = arrayedStringithing[number].toUpperCase();
    } else {
      span.innerHTML = " ";
    }
  });

  if (e.key === "Enter") {
    const inputData = stringithing.match(/.{1,4}/g).map((row) => {
      return row.split("");
    });

    class Letter {
      constructor(letter, row, column) {
        this.interactable = true;
        this.row = row;
        this.column = column;
        this.letter = letter.toUpperCase();
      }
    }

    const gameBoard = inputData.map((row, rowNumber) => {
      return row.map((letter, columnNumber) => {
        return new Letter(letter, rowNumber, columnNumber);
      });
    });

    gameBoard.map((row) => {
      row.map((letterObj) => {
        let possibleLetters;
        if (letterObj.row === 0) {
          possibleLetters = [
            gameBoard[letterObj.row][letterObj.column + 1],
            gameBoard[letterObj.row][letterObj.column - 1],
            gameBoard[letterObj.row + 1][letterObj.column],
            gameBoard[letterObj.row + 1][letterObj.column + 1],
            gameBoard[letterObj.row + 1][letterObj.column - 1],
          ];
        } else if (letterObj.row === 3) {
          possibleLetters = [
            gameBoard[letterObj.row][letterObj.column + 1],
            gameBoard[letterObj.row][letterObj.column - 1],
            gameBoard[letterObj.row - 1][letterObj.column],
            gameBoard[letterObj.row - 1][letterObj.column - 1],
            gameBoard[letterObj.row - 1][letterObj.column + 1],
          ];
        } else {
          possibleLetters = [
            gameBoard[letterObj.row][letterObj.column + 1],
            gameBoard[letterObj.row][letterObj.column - 1],
            gameBoard[letterObj.row + 1][letterObj.column],
            gameBoard[letterObj.row - 1][letterObj.column],
            gameBoard[letterObj.row + 1][letterObj.column + 1],
            gameBoard[letterObj.row - 1][letterObj.column - 1],
            gameBoard[letterObj.row + 1][letterObj.column - 1],
            gameBoard[letterObj.row - 1][letterObj.column + 1],
          ];
        }
        letterObj.possibleLetters = possibleLetters.filter((letter) => {
          return letter;
        });
      });
    });

    const doesThisWordWork = (letterObj, word) => {
      let lettersWeAreOn = [letterObj];
      Array.from(word).map((letterInWord) => {
        let pathsThatWork = lettersWeAreOn.filter((possibleLetter) => {
          return possibleLetter.letter == letterInWord;
        });
        lettersWeAreOn = [];
        pathsThatWork.map((letterThatWorked) => {
          if (letterThatWorked.interactable) {
            lettersWeAreOn.push.apply(
              lettersWeAreOn,
              letterThatWorked.possibleLetters
            );
          }
          letterThatWorked.interactable = false;
        });

        if (!(lettersWeAreOn.length > 0)) {
          gameBoard.map((row) => {
            row.map((letterObj) => {
              letterObj.interactable = true;
            });
          });
          return false;
        }
      });
      gameBoard.map((row) => {
        row.map((letterObj) => {
          letterObj.interactable = true;
        });
      });
      if (lettersWeAreOn.length > 0) {
        return true;
      } else {
        return false;
      }
    };

    findWords = async () => {
      let words = [];
      await fetch("words_alpha.txt")
        .then((response) => response.text())
        .then((data) => {
          // Do something with your data
          const realData = data.split("\n").filter((word) => {
            return word.length >= 3;
          });
          gameBoard.map((row) => {
            row.map((letterObj) => {
              realData.map((word) => {
                if (doesThisWordWork(letterObj, word)) {
                  words.push(word);
                }
              });
            });
          });
        });
      console.log(words.sort((a, b) => b.length - a.length));
      finalDisplay.innerHTML = words.sort((a, b) => b.length - a.length);
    };

    findWords();
  }
});
