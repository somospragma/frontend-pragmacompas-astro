export interface UserStatistics {
  mentorshipsGiven: number;
  mentorshipsReceived: number;
  totalHours: number;
}

export async function getBasicUserStatistics(): Promise<UserStatistics> {
  //TODO:  Simulate API call with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        mentorshipsGiven: Math.floor(Math.random() * 50) + 5, // 5-55
        mentorshipsReceived: Math.floor(Math.random() * 30) + 2, // 2-32
        totalHours: Math.floor(Math.random() * 200) + 20, // 20-220
      });
    }, 500);
  });
}
