export function formatedNumberInCents(amount: number): number {
  const amountInCents = Math.round(amount * 100);
  return amountInCents;
}
