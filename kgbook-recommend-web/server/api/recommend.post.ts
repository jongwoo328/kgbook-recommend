import { bookRecommendByUserAgent, bookSchemaParser } from "~/server/ai";

export default defineEventHandler(
  async (event): Promise<RecommendBookItem[]> => {
    const body = await readBody<PersonalRecommendRequest>(event);

    const { userPreference } = body;

    const message = `- 유저의 직업: ${userPreference.job ?? "설정하지 않음"}
    - 유저의 관심 분야: ${userPreference.interests?.toString() ?? "설정하지 않음"}
    - 유저의 독서 시간: ${userPreference.readTime ?? "설정하지 않음"}
    - 유저의 독서 스타일: ${userPreference.style?.toString() ?? "설정하지 않음"}
    - 유저가 최근 읽은 책: ${userPreference.recentBook ?? "설정하지 않음"}
    위 정보를 바탕으로 최대 6개 까지 책을 추천해 주세요.
     제공된 사용자 정보가 부족하거나, 사용자의 명시적 요청이 있지 않는 한, 화면에 표시되는 책으로만 추천하지 말고 주어진 다양한 도구를 적극적으로 사용하세요.
     추천을 위한 정보가 부족하다면, 일반적으로 좋아할만 한 책을 추천해주세요. 다만 베스트셀러 위주로 포함하기 보다는 주어진 다양한 도구를 적극적으로 사용해서 여러 책을 수집한 후 추천하세요.`;

    const r = await bookRecommendByUserAgent.invoke({
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

    return parsed.books;
  },
);
