import 'package:flutter_test/flutter_test.dart';
import 'package:kasir/features/sell/cart.dart';
import 'package:kasir/features/sell/sample_catalog.dart';

void main() {
  final kopi = sampleProducts[0]; // Rp18.000
  final teh = sampleProducts[3]; // Rp6.000

  test('menambah produk yang sama menaikkan jumlah', () {
    final cart = const Cart().add(kopi).add(kopi).add(teh);
    expect(cart.lines.length, 2);
    expect(cart.qtyOf(kopi.id), 2);
    expect(cart.itemCount, 3);
    expect(cart.total, 42000);
  });

  test('mengurangi sampai nol menghapus baris', () {
    final cart = const Cart().add(kopi).add(teh).decrement(teh.id);
    expect(cart.qtyOf(teh.id), 0);
    expect(cart.lines.length, 1);
    expect(cart.total, 18000);
  });

  test('keranjang lama tidak berubah (immutable)', () {
    const empty = Cart();
    empty.add(kopi);
    expect(empty.isEmpty, isTrue);
  });
}
