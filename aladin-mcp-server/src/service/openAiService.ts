// OpenAI 임베딩 응답 구조 정의
interface OpenAiEmbeddingData {
  object: string;
  index: number;
  embedding: number[];
}

interface OpenAiUsage {
  prompt_tokens: number;
  total_tokens: number;
}

interface OpenAiEmbeddingResponse {
  data: OpenAiEmbeddingData[];
  object: string;
  model: string;
  usage: OpenAiUsage;
}

export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    const json = (await res.json()) as OpenAiEmbeddingResponse;
    return json.data[0].embedding;
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Error creating embedding: ${message}`);
  }
}
