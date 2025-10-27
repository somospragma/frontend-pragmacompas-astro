const useNotification = () => {
  const doNotification = async (targetEmail: string, message: string) => {
    const response = await fetch(
      "https://hooks.slack.com/triggers/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",
      {
        body: JSON.stringify({
          targetEmail,
          message,
        }),
        method: "POST",
      }
    );

    const data = await response.json();

    return data;
  };

  return {
    doNotification,
  };
};

export default useNotification;
