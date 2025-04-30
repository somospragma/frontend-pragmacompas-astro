type Shape = {
  hasTopTab: boolean;
  hasRightTab: boolean;
  hasBottomTab: boolean;
  hasLeftTab: boolean;
};

export const generateShapeForIndex = (index: number, total: number, columns = 3): Shape => {
  const row = Math.floor(index / columns);
  const col = index % columns;
  const totalRows = Math.ceil(total / columns);

  return {
    hasTopTab: row < totalRows - 1,
    hasRightTab: col > 0,
    hasBottomTab: row > 0,
    hasLeftTab: col < columns - 1,
  };
};
