const QR_CODE_SIZE = 21;
const FINDER_PATTERN_SIZE = 7;
const FINDER_PATTERN_ORIGINS = [
  [0, 0],
  [QR_CODE_SIZE - FINDER_PATTERN_SIZE, 0],
  [0, QR_CODE_SIZE - FINDER_PATTERN_SIZE],
];

function getFinderPatternCell(column: number, row: number): boolean | null {
  for (const [originColumn, originRow] of FINDER_PATTERN_ORIGINS) {
    const localColumn = column - originColumn;
    const localRow = row - originRow;
    const isInsideArea =
      localColumn >= -1 &&
      localColumn <= FINDER_PATTERN_SIZE &&
      localRow >= -1 &&
      localRow <= FINDER_PATTERN_SIZE;

    if (isInsideArea) {
      const lastIndex = FINDER_PATTERN_SIZE - 1;
      const isSeparator =
        localColumn < 0 || localRow < 0 || localColumn > lastIndex || localRow > lastIndex;
      const isBorder =
        localColumn === 0 || localRow === 0 || localColumn === lastIndex || localRow === lastIndex;
      const isCenter = localColumn >= 2 && localColumn <= 4 && localRow >= 2 && localRow <= 4;
      return !isSeparator && (isBorder || isCenter);
    }
  }
  return null;
}

/** Builds an SVG path that looks like a QR Code. It is not scannable. */
export function createSimulatedQrCodePath(seed: string): string {
  let path = '';

  for (let row = 0; row < QR_CODE_SIZE; row++) {
    for (let column = 0; column < QR_CODE_SIZE; column++) {
      const finderPatternCell = getFinderPatternCell(column, row);
      const seedCharacterCode = seed.charCodeAt((column * 31 + row * 17) % seed.length);
      const isFilled = finderPatternCell ?? (seedCharacterCode * (column + 1) * (row + 3)) % 7 < 3;

      if (isFilled) {
        path += `M${column} ${row}h1v1h-1z`;
      }
    }
  }

  return path;
}
