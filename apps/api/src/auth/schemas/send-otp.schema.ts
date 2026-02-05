import { type Static, Type } from "@sinclair/typebox";

export const sendOtpSchema = Type.Object({
  phone: Type.String({ pattern: "^\\+[1-9]\\d{6,14}$" }),
  context: Type.Optional(Type.Union([Type.Literal("login"), Type.Literal("register")])),
  source: Type.Optional(Type.Union([Type.Literal("register"), Type.Literal("checkout")])),
  cartSnapshot: Type.Optional(
    Type.Array(
      Type.Object({
        courseId: Type.String(),
        title: Type.String(),
        priceInCents: Type.Number(),
        mercadopagoPriceInCents: Type.Optional(Type.Number()),
        currency: Type.String(),
      }),
    ),
  ),
  termsAccepted: Type.Optional(Type.Boolean()),
});

export type SendOtpBody = Static<typeof sendOtpSchema>;
