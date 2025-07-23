import { bookSchemaParser, jsonOutputParserAgent } from "~/server/ai";

export default defineEventHandler(
  async (event): Promise<RecommendBookResponse> => {
    const body = await readBody<PersonalRecommendRequest>(event);

    const { userPreference } = body;

    const message = `- 유저의 직업: ${userPreference.job ?? "설정하지 않음"}
    - 유저의 관심 분야: ${userPreference.interests?.toString() ?? "설정하지 않음"}
    - 유저의 독서 시간: ${userPreference.readTime ?? "설정하지 않음"}
    - 유저의 독서 스타일: ${userPreference.style?.toString() ?? "설정하지 않음"}
    - 유저가 최근 읽은 책: ${userPreference.recentBook ?? "설정하지 않음"}
    위 정보를 바탕으로 최대 6개 까지 책을 추천해 주세요. 추천을 위한 정보가 부족하다면, 베스트 셀러를 제외한 일반적으로 좋아할만 한 책을 추천해주세요`;

    const r = await jsonOutputParserAgent.invoke({
      messages: [
        {
          role: "human",
          content: message,
        },
      ],
    });
    if (r.messages.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: "No response from the agent.",
      });
    }

    const responseMessage = r.messages[r.messages.length - 1];
    const parsed = await bookSchemaParser.parse(responseMessage.text);

    return {
      response: parsed.books,
    };
  },
);
