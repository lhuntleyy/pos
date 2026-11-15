import 'package:flutter/painting.dart';

import 'cart.dart';

/// Data contoh untuk kerangka layar. Diganti data dari database lokal di story S-01/C-01.
class Category {
  const Category(this.id, this.name);
  final String id;
  final String name;
}

const sampleCategories = [
  Category('semua', 'Semua'),
  Category('kopi', 'Kopi'),
  Category('non-kopi', 'Non-kopi'),
  Category('makanan', 'Makanan'),
  Category('camilan', 'Camilan'),
];

const sampleProducts = [
  Product(id: 'p1', name: 'Es Kopi Susu Aren', price: 18000, categoryId: 'kopi', tint: Color(0xFFF3E6DA)),
  Product(id: 'p2', name: 'Kopi Latte Panas', price: 22000, categoryId: 'kopi', tint: Color(0xFFF3E6DA)),
  Product(id: 'p3', name: 'Americano', price: 16000, categoryId: 'kopi', tint: Color(0xFFF3E6DA)),
  Product(id: 'p4', name: 'Es Teh Manis', price: 6000, categoryId: 'non-kopi', tint: Color(0xFFDDF0EA)),
  Product(id: 'p5', name: 'Cokelat Dingin', price: 20000, categoryId: 'non-kopi', tint: Color(0xFFDDF0EA)),
  Product(id: 'p6', name: 'Nasi Goreng Spesial', price: 25000, categoryId: 'makanan', tint: Color(0xFFFCE3D6)),
  Product(id: 'p7', name: 'Mie Goreng Telur', price: 20000, categoryId: 'makanan', tint: Color(0xFFFCE3D6)),
  Product(id: 'p8', name: 'Pisang Goreng Keju', price: 15000, categoryId: 'camilan', tint: Color(0xFFFFF0C7)),
  Product(id: 'p9', name: 'Roti Bakar Cokelat', price: 14000, categoryId: 'camilan', tint: Color(0xFFFFF0C7)),
];
