// Shared pricing logic — used by client-side preview and server-side API

export interface PriceBreakdown {
  unit_price: number
  quantity: number
  subtotal: number
  discount_percentage: number
  discount_amount: number
  taxable_amount: number
  gst_rate: number
  gst_amount: number
  total: number
  currency: string
}

const VOLUME_DISCOUNTS = [
  { min: 1000, discount: 0.15 },
  { min: 500,  discount: 0.10 },
  { min: 100,  discount: 0.05 },
]

export const GST_RATE = 0.18

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function getVolumeDiscount(quantity: number): number {
  for (const tier of VOLUME_DISCOUNTS) {
    if (quantity >= tier.min) return tier.discount
  }
  return 0
}

export function calculatePrice(
  basePrice: number,
  optionModifiers: number,
  sizeModifier: number,
  quantity: number,
  currency = 'INR'
): PriceBreakdown {
  const unit_price = round2(basePrice + optionModifiers + sizeModifier)
  const subtotal = round2(unit_price * quantity)
  const discount_percentage = getVolumeDiscount(quantity)
  const discount_amount = round2(subtotal * discount_percentage)
  const taxable_amount = round2(subtotal - discount_amount)
  const gst_amount = round2(taxable_amount * GST_RATE)
  const total = round2(taxable_amount + gst_amount)

  return { unit_price, quantity, subtotal, discount_percentage, discount_amount, taxable_amount, gst_rate: GST_RATE, gst_amount, total, currency }
}
