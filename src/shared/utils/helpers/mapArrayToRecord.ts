export const mapArrayToRecord = <T extends object, K extends keyof T>(values: T[], property: K): Record<K, T> => {
  return values.reduce(
    (acc, value) => {
      const key = value[property] as K;
      acc[key] = value;
      return acc;
    },
    {} as Record<K, T>
  );
};
