export const payments = {
  holder: process.env.NEXT_PUBLIC_BARIDI_HOLDER?.trim() ?? "",
  rip: process.env.NEXT_PUBLIC_BARIDI_RIP?.trim() ?? "",
  account: process.env.NEXT_PUBLIC_BARIDI_ACCOUNT?.trim() ?? "",
  trc20: process.env.NEXT_PUBLIC_USDT_TRC20?.trim() ?? "",
  bep20: process.env.NEXT_PUBLIC_USDT_BEP20?.trim() ?? "",
};

export const paymentMethods = ["baridi", "usdt", "cash"] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

export function isPaymentMethod(value: string): value is PaymentMethod {
  return paymentMethods.includes(value as PaymentMethod);
}
