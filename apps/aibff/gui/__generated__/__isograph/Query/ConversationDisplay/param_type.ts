
export type Query__ConversationDisplay__param = {
  readonly data: {
    readonly conversations: ReadonlyArray<{
      readonly id: string,
      readonly createdAt: string,
      readonly messages: ReadonlyArray<{
        readonly id: string,
        readonly content: string,
        readonly role: string,
        readonly createdAt: string,
      }>,
    }>,
  },
  readonly parameters: Record<PropertyKey, never>,
};
