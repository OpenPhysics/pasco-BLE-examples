/**
 * Character Library for PASCO Code.Node LED Matrix
 *
 * Provides character definitions for the 5x5 LED matrix display.
 * Each character is defined as a mapping from column (0-4) to a set of active rows.
 */

/**
 * LED matrix character definition
 * Key is column (0-4), value is set of active row positions (0-4)
 */
export type CharacterMatrix = Record<number, Set<number>>;

/**
 * Coordinate pair for LED matrix [column, row]
 */
export type LEDCoordinate = [number, number];

/**
 * Alphabet character definitions
 * Each character maps column index (0-4) to set of active row indices (0-4)
 */
export const alphabet: Record<string, CharacterMatrix> = {
  ' ': {
    0: new Set(),
    1: new Set(),
    2: new Set(),
    3: new Set(),
    4: new Set(),
  },
  'A': {
    0: new Set([1, 2, 3, 4]),
    1: new Set([0, 2]),
    2: new Set([0, 2]),
    3: new Set([1, 2, 3, 4]),
    4: new Set(),
  },
  'B': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([0, 2, 4]),
    3: new Set([1, 3]),
    4: new Set(),
  },
  'C': {
    0: new Set([1, 2, 3]),
    1: new Set([0, 4]),
    2: new Set([0, 4]),
    3: new Set([0, 4]),
    4: new Set(),
  },
  'D': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([0, 4]),
    2: new Set([0, 4]),
    3: new Set([1, 2, 3]),
    4: new Set(),
  },
  'E': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([0, 4]),
    3: new Set(),
    4: new Set(),
  },
  'F': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([0]),
    3: new Set(),
    4: new Set(),
  },
  'G': {
    0: new Set([1, 2, 3]),
    1: new Set([0, 4]),
    2: new Set([0, 2, 4]),
    3: new Set([0, 2, 3]),
    4: new Set(),
  },
  'H': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([2]),
    2: new Set([2]),
    3: new Set([0, 1, 2, 3, 4]),
    4: new Set(),
  },
  'I': {
    0: new Set([0, 4]),
    1: new Set([0, 1, 2, 3, 4]),
    2: new Set([0, 4]),
    3: new Set(),
    4: new Set(),
  },
  'J': {
    0: new Set([3]),
    1: new Set([0, 4]),
    2: new Set([0, 1, 2, 3]),
    3: new Set([0]),
    4: new Set(),
  },
  'K': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([3]),
    2: new Set([1, 3]),
    3: new Set([0, 4]),
    4: new Set(),
  },
  'L': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([4]),
    2: new Set([4]),
    3: new Set(),
    4: new Set(),
  },
  'M': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([1]),
    2: new Set([2]),
    3: new Set([1]),
    4: new Set([0, 1, 2, 3, 4]),
  },
  'N': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([1]),
    2: new Set([2]),
    3: new Set([3]),
    4: new Set([0, 1, 2, 3, 4]),
  },
  'O': {
    0: new Set([1, 2, 3]),
    1: new Set([0, 4]),
    2: new Set([0, 4]),
    3: new Set([1, 2, 3]),
    4: new Set(),
  },
  'P': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([0, 2]),
    2: new Set([0, 2]),
    3: new Set([1]),
    4: new Set(),
  },
  'Q': {
    0: new Set([1, 2, 3]),
    1: new Set([0, 4]),
    2: new Set([0, 4]),
    3: new Set([1, 2, 3, 4]),
    4: new Set([4]),
  },
  'R': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([0, 2]),
    2: new Set([0, 2]),
    3: new Set([1, 3, 4]),
    4: new Set(),
  },
  'S': {
    0: new Set([1, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([0, 2, 4]),
    3: new Set([0, 3]),
    4: new Set(),
  },
  'T': {
    0: new Set([0]),
    1: new Set([0]),
    2: new Set([0, 1, 2, 3, 4]),
    3: new Set([0]),
    4: new Set([0]),
  },
  'U': {
    0: new Set([0, 1, 2, 3]),
    1: new Set([4]),
    2: new Set([4]),
    3: new Set([0, 1, 2, 3]),
    4: new Set(),
  },
  'V': {
    0: new Set([0, 1, 2]),
    1: new Set([3]),
    2: new Set([4]),
    3: new Set([3]),
    4: new Set([0, 1, 2]),
  },
  'W': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([3]),
    2: new Set([2]),
    3: new Set([3]),
    4: new Set([0, 1, 2, 3, 4]),
  },
  'X': {
    0: new Set([0, 4]),
    1: new Set([1, 3]),
    2: new Set([2]),
    3: new Set([1, 3]),
    4: new Set([0, 4]),
  },
  'Y': {
    0: new Set([0, 1]),
    1: new Set([2, 3, 4]),
    2: new Set([0, 1]),
    3: new Set(),
    4: new Set(),
  },
  'Z': {
    0: new Set([0, 3, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([0, 1, 4]),
    3: new Set([0, 4]),
    4: new Set(),
  },
  '0': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([0, 4]),
    2: new Set([0, 1, 2, 3, 4]),
    3: new Set(),
    4: new Set(),
  },
  '1': {
    0: new Set([1, 4]),
    1: new Set([0, 1, 2, 3, 4]),
    2: new Set([4]),
    3: new Set(),
    4: new Set(),
  },
  '2': {
    0: new Set([1, 4]),
    1: new Set([0, 3, 4]),
    2: new Set([0, 2, 4]),
    3: new Set([1, 4]),
    4: new Set(),
  },
  '3': {
    0: new Set([0, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([1, 3]),
    3: new Set(),
    4: new Set(),
  },
  '4': {
    0: new Set([0, 1, 2]),
    1: new Set([2]),
    2: new Set([0, 1, 2, 3, 4]),
    3: new Set(),
    4: new Set(),
  },
  '5': {
    0: new Set([0, 1, 2, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([0, 2, 3, 4]),
    3: new Set(),
    4: new Set(),
  },
  '6': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([0, 2, 3, 4]),
    3: new Set(),
    4: new Set(),
  },
  '7': {
    0: new Set([0]),
    1: new Set([0]),
    2: new Set([0, 1, 2, 3, 4]),
    3: new Set(),
    4: new Set(),
  },
  '8': {
    0: new Set([0, 1, 2, 3, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([0, 1, 2, 3, 4]),
    3: new Set(),
    4: new Set(),
  },
  '9': {
    0: new Set([0, 1, 2, 4]),
    1: new Set([0, 2, 4]),
    2: new Set([0, 1, 2, 3, 4]),
    3: new Set(),
    4: new Set(),
  },
  '.': {
    0: new Set([4]),
    1: new Set(),
    2: new Set(),
    3: new Set(),
    4: new Set(),
  },
  ',': {
    0: new Set([4]),
    1: new Set([3, 4]),
    2: new Set(),
    3: new Set(),
    4: new Set(),
  },
  '-': {
    0: new Set([2]),
    1: new Set([2]),
    2: new Set(),
    3: new Set(),
    4: new Set(),
  },
  '+': {
    0: new Set([2]),
    1: new Set([1, 2, 3]),
    2: new Set([2]),
    3: new Set(),
    4: new Set(),
  },
  '=': {
    0: new Set([1, 3]),
    1: new Set([1, 3]),
    2: new Set([1, 3]),
    3: new Set(),
    4: new Set(),
  },
};

/**
 * Icon definitions for the LED matrix
 */
export const Icons = {
  heart: {
    0: new Set([1, 2]),
    1: new Set([0, 3]),
    2: new Set([1, 4]),
    3: new Set([0, 3]),
    4: new Set([1, 2]),
  } as CharacterMatrix,

  heartSmall: {
    0: new Set(),
    1: new Set([1, 2]),
    2: new Set([2, 3]),
    3: new Set([1, 2]),
    4: new Set(),
  } as CharacterMatrix,

  smile: {
    0: new Set([3]),
    1: new Set([0, 4]),
    2: new Set([2, 4]),
    3: new Set([0, 4]),
    4: new Set([3]),
  } as CharacterMatrix,

  sad: {
    0: new Set([4]),
    1: new Set([0, 3]),
    2: new Set([3]),
    3: new Set([0, 3]),
    4: new Set([4]),
  } as CharacterMatrix,

  surprise: {
    0: new Set([3]),
    1: new Set([0, 2, 4]),
    2: new Set([2, 4]),
    3: new Set([0, 2, 4]),
    4: new Set([3]),
  } as CharacterMatrix,

  star: {
    0: new Set([1, 4]),
    1: new Set([1, 3]),
    2: new Set([0, 1, 2]),
    3: new Set([1, 3]),
    4: new Set([1, 4]),
  } as CharacterMatrix,

  arrowTop: {
    0: new Set([2]),
    1: new Set([1]),
    2: new Set([0, 1, 2, 3, 4]),
    3: new Set([1]),
    4: new Set([2]),
  } as CharacterMatrix,

  arrowLeft: {
    0: new Set([2]),
    1: new Set([1, 2, 3]),
    2: new Set([0, 2, 4]),
    3: new Set([2]),
    4: new Set([2]),
  } as CharacterMatrix,

  arrowBottom: {
    0: new Set([2]),
    1: new Set([3]),
    2: new Set([0, 1, 2, 3, 4]),
    3: new Set([3]),
    4: new Set([2]),
  } as CharacterMatrix,

  arrowRight: {
    0: new Set([2]),
    1: new Set([2]),
    2: new Set([0, 2, 4]),
    3: new Set([1, 2, 3]),
    4: new Set([2]),
  } as CharacterMatrix,

  arrowTopLeft: {
    0: new Set([0, 1, 2]),
    1: new Set([0, 1]),
    2: new Set([0, 2]),
    3: new Set([3]),
    4: new Set([4]),
  } as CharacterMatrix,

  arrowTopRight: {
    0: new Set([4]),
    1: new Set([3]),
    2: new Set([0, 2]),
    3: new Set([0, 1]),
    4: new Set([0, 1, 2]),
  } as CharacterMatrix,

  arrowBottomLeft: {
    0: new Set([2, 3, 4]),
    1: new Set([3, 4]),
    2: new Set([2, 4]),
    3: new Set([1]),
    4: new Set([0]),
  } as CharacterMatrix,

  arrowBottomRight: {
    0: new Set([0]),
    1: new Set([1]),
    2: new Set([2, 4]),
    3: new Set([3, 4]),
    4: new Set([2, 3, 4]),
  } as CharacterMatrix,

  alien: {
    0: new Set([1, 2, 3, 4]),
    1: new Set([0, 1, 3]),
    2: new Set([0, 1, 2, 3, 4]),
    3: new Set([0, 1, 3]),
    4: new Set([1, 2, 3, 4]),
  } as CharacterMatrix,
};

/**
 * Convert an icon/character matrix to an array of LED coordinates
 * @param icon The character matrix to convert
 * @returns Array of [column, row] coordinates
 */
export function getIcon(icon: CharacterMatrix): LEDCoordinate[] {
  const matrix: LEDCoordinate[] = [];
  for (const col of Object.keys(icon)) {
    const colNum = parseInt(col, 10);
    const rows = icon[colNum];
    if (rows) {
      for (const row of rows) {
        matrix.push([colNum, row]);
      }
    }
  }
  return matrix;
}

/**
 * Convert a text string to a sequence of LED coordinate frames for scrolling display
 * @param word The text to convert
 * @returns Array of frames, where each frame is an array of [column, row] coordinates
 */
export function getWord(word: string): LEDCoordinate[][] {
  const displayScreenshots: LEDCoordinate[][] = [];

  if (word.length === 0) {
    return [];
  }

  if (word.length === 1) {
    const upperWord = word.toUpperCase();
    const letter = alphabet[upperWord];
    if (!letter) {
      console.warn(`Letter ${word} not found`);
      return [];
    }

    const matrix = getIcon(letter);
    return [matrix];
  }

  // For multi-character strings, create a scrolling sequence
  const paddedWord = ` ${word.toUpperCase()}`;
  const wordDict: Set<number>[] = [];

  for (const char of paddedWord) {
    const letterDict = alphabet[char];
    if (!letterDict) {
      console.warn(`Letter ${char} not found`);
      continue;
    }

    for (const col of Object.keys(letterDict)) {
      const colNum = parseInt(col, 10);
      const rows = letterDict[colNum];
      if (rows && (rows.size > 0 || char === ' ')) {
        wordDict.push(rows);
      } else if (char !== ' ') {
        break;
      }
    }
    wordDict.push(new Set()); // Space between characters
  }

  // Create frames for scrolling
  for (let i = 0; i < wordDict.length; i++) {
    const displayDict = wordDict.slice(i, i + 5);
    const displayList: LEDCoordinate[] = [];

    for (let col = 0; col < displayDict.length; col++) {
      const rows = displayDict[col];
      if (rows) {
        for (const row of rows) {
          displayList.push([col, row]);
        }
      }
    }
    displayScreenshots.push(displayList);
  }

  return displayScreenshots;
}
