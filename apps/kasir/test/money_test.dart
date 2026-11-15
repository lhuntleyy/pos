import 'package:flutter_test/flutter_test.dart';
import 'package:kasir/core/money.dart';

void main() {
  group('formatRupiah', () {
    test('memformat seperti di struk', () {
      expect(formatRupiah(0), 'Rp0');
      expect(formatRupiah(500), 'Rp500');
      expect(formatRupiah(18000), 'Rp18.000');
      expect(formatRupiah(2402000), 'Rp2.402.000');
      expect(formatRupiah(-5500), '-Rp5.500');
    });
  });

  group('changeDue', () {
    test('menghitung kembalian', () {
      expect(changeDue(total: 62700, paid: 100000), 37300);
      expect(changeDue(total: 62700, paid: 62700), 0);
    });

    test('null kalau uang kurang', () {
      expect(changeDue(total: 62700, paid: 50000), isNull);
    });
  });

  group('quickCashOptions', () {
    test('uang pas lalu pecahan terdekat di atas total', () {
      expect(quickCashOptions(62700), [62700, 64000, 65000, 70000, 80000]);
    });

    test('tidak ada duplikat saat total sudah bulat', () {
      // 50.000 sudah pas untuk pecahan 2rb/5rb/10rb/50rb, jadi hanya 20rb (60.000) dan 100rb yang tambah.
      expect(quickCashOptions(50000), [50000, 60000, 100000]);
    });

    test('kosong untuk total nol', () {
      expect(quickCashOptions(0), isEmpty);
    });
  });
}
