/// Uang selalu bilangan bulat Rupiah. Jangan pernah memakai double untuk uang.
library;

/// Format seperti di struk: Rp18.000, -Rp5.500.
String formatRupiah(int value) {
  final digits = value.abs().toString();
  final buffer = StringBuffer(value < 0 ? '-Rp' : 'Rp');
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) buffer.write('.');
    buffer.write(digits[i]);
  }
  return buffer.toString();
}

/// Kembalian, atau null kalau uang yang diterima kurang.
int? changeDue({required int total, required int paid}) =>
    paid >= total ? paid - total : null;

/// Pecahan uang kertas Rupiah untuk tombol uang cepat.
const banknotes = [2000, 5000, 10000, 20000, 50000, 100000];

/// Pilihan uang cepat: uang pas, lalu nominal pecahan terdekat di atas total.
/// Contoh total Rp62.700 → 62.700, 64.000, 65.000, 70.000, 80.000.
List<int> quickCashOptions(int total, {int max = 5}) {
  if (total <= 0) return const [];
  final options = <int>{total};
  for (final note in banknotes) {
    options.add(((total + note - 1) ~/ note) * note);
  }
  final sorted = options.toList()..sort();
  return sorted.take(max).toList();
}
