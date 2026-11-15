/** Format Rupiah seperti di struk: Rp18.000, -Rp5.500. Uang selalu bilangan bulat. */
export function formatRupiah(value: number): string {
  if (!Number.isInteger(value)) throw new Error(`Nominal uang harus bilangan bulat: ${value}`);
  const sign = value < 0 ? "-" : "";
  const digits = Math.abs(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}Rp${digits}`;
}
