import 'package:flutter/painting.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Produk di layar jualan. Nanti dibaca dari database lokal drift (S-01).
class Product {
  const Product({
    required this.id,
    required this.name,
    required this.price,
    required this.categoryId,
    required this.tint,
  });

  final String id;
  final String name;

  /// Harga dalam Rupiah bulat.
  final int price;
  final String categoryId;
  final Color tint;
}

class CartLine {
  const CartLine({required this.product, required this.qty});

  final Product product;
  final int qty;

  int get subtotal => product.price * qty;

  CartLine copyWith({int? qty}) => CartLine(product: product, qty: qty ?? this.qty);
}

/// Keranjang belanja. Tidak bisa diubah langsung (immutable): setiap aksi menghasilkan keranjang baru.
class Cart {
  const Cart([this.lines = const []]);

  final List<CartLine> lines;

  int get total => lines.fold(0, (sum, line) => sum + line.subtotal);
  int get itemCount => lines.fold(0, (sum, line) => sum + line.qty);
  bool get isEmpty => lines.isEmpty;

  int qtyOf(String productId) {
    for (final line in lines) {
      if (line.product.id == productId) return line.qty;
    }
    return 0;
  }

  Cart add(Product product) {
    final index = lines.indexWhere((l) => l.product.id == product.id);
    if (index < 0) return Cart([...lines, CartLine(product: product, qty: 1)]);
    final updated = [...lines];
    updated[index] = updated[index].copyWith(qty: updated[index].qty + 1);
    return Cart(updated);
  }

  Cart decrement(String productId) {
    final updated = <CartLine>[];
    for (final line in lines) {
      if (line.product.id != productId) {
        updated.add(line);
      } else if (line.qty > 1) {
        updated.add(line.copyWith(qty: line.qty - 1));
      }
    }
    return Cart(updated);
  }
}

class CartNotifier extends Notifier<Cart> {
  @override
  Cart build() => const Cart();

  void add(Product product) => state = state.add(product);
  void decrement(String productId) => state = state.decrement(productId);
  void clear() => state = const Cart();
}

final cartProvider = NotifierProvider<CartNotifier, Cart>(CartNotifier.new);
