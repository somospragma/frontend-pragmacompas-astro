export const cypher = {
  encrypt: (text: string) => {
    const encodedText = btoa(text);
    return encodedText;
  },
  decrypt: (text: string) => {
    const decodedText = atob(text);
    return decodedText;
  },
};
