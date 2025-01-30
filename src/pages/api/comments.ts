import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const comments = [
    {
      id: "1",
      text: "Great post!",
      author: "John Doe",
      alterName: "JD",
      isDeprecated: false,
      createdAt: "2025-02-01T12:00:00Z",
    },
    {
      id: "2",
      text: "I disagree with the points made.",
      author: "Jane Smith",
      alterName: "JS",
      isDeprecated: false,
      createdAt: "2025-02-02T14:00:00Z",
    },
    {
      id: "3",
      text: "Nice article, very informative.",
      author: "Alice Johnson",
      alterName: "AJ",
      isDeprecated: true,
      createdAt: "2025-02-03T16:00:00Z",
    },
  ];

  return new Response(JSON.stringify(comments), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
