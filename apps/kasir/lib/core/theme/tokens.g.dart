// Dibuat otomatis dari packages/design-tokens/tokens.json. Jangan diedit manual; jalankan `pnpm gen:tokens`.

import 'package:flutter/painting.dart';

abstract final class AppColors {
  /// Nila: aksi utama; bawaan, bisa diganti super admin
  static const brand = Color(0xFF3B35B5);
  /// Nila tua: hover/tekan tombol utama, tautan
  static const brandStrong = Color(0xFF2A2590);
  /// Nila muda: latar pilihan aktif
  static const brandSoft = Color(0xFFF1F0FD);
  /// Nila garis: garis pilihan aktif
  static const brandLine = Color(0xFFE6E5FA);
  /// Putih: teks di atas warna brand
  static const onBrand = Color(0xFFFFFFFF);
  /// Tinta: teks utama
  static const ink = Color(0xFF181A2E);
  /// Abu tinta: teks kedua
  static const inkMuted = Color(0xFF51546F);
  /// Abu muda: teks nonaktif, placeholder ikon
  static const inkFaint = Color(0xFFB9BCD3);
  /// Garis: garis kartu dan kolom
  static const line = Color(0xFFD9DBEA);
  /// Garis halus: pemisah baris
  static const lineSoft = Color(0xFFEDEEF7);
  /// Latar: latar halaman
  static const canvas = Color(0xFFF6F6FB);
  /// Permukaan: kartu, panel
  static const surface = Color(0xFFFFFFFF);
  /// Kunyit: sorotan; selalu dengan teks gelap
  static const highlight = Color(0xFFE39D00);
  /// Kunyit muda: latar peringatan
  static const highlightSoft = Color(0xFFFFF2D2);
  /// Kunyit tua: teks di latar kunyit muda
  static const highlightInk = Color(0xFF6B4600);
  /// Fokus: garis fokus keyboard
  static const focus = Color(0xFFE39D00);
  /// Hijau: berhasil, online
  static const success = Color(0xFF16774A);
  /// Hijau muda: latar status berhasil
  static const successSoft = Color(0xFFDDF3E7);
  /// Merah bata: bahaya, batalkan, selisih
  static const danger = Color(0xFFB42318);
  /// Merah muda: latar status bahaya
  static const dangerSoft = Color(0xFFFBE3E0);
}

/// Warna tombol uang cepat, mengikuti warna uang kertas Rupiah.
abstract final class MoneyColors {
  static const Map<int, Color> byNominal = {
    100000: Color(0xFFC2185B),
    50000: Color(0xFF1565C0),
    20000: Color(0xFF2E7D32),
    10000: Color(0xFF6A1B9A),
    5000: Color(0xFF8D6E63),
    2000: Color(0xFF546E7A),
  };
}

abstract final class TouchSize {
  static const double min = 48;
  static const double category = 56;
  static const double primary = 64;
}

abstract final class AppRadius {
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 14;
  static const double xl = 20;
  static const double pill = 999;
}

abstract final class AppSpace {
  static const double s1 = 4;
  static const double s2 = 8;
  static const double s3 = 12;
  static const double s4 = 16;
  static const double s5 = 20;
  static const double s6 = 24;
  static const double s8 = 32;
  static const double s10 = 40;
}

const String appFontFamily = 'Plus Jakarta Sans';

/// Ukuran teks untuk satu pilihan (A / A+ / A++).
class TextSizes {
  const TextSizes({
    required this.body,
    required this.productName,
    required this.cardPrice,
    required this.total,
    required this.productColumns,
  });

  final double body;
  final double productName;
  final double cardPrice;
  final double total;
  final int productColumns;
}

enum TextSizeLevel {
  normal('A', TextSizes(body: 16, productName: 15, cardPrice: 17, total: 36, productColumns: 4)),
  large('A+', TextSizes(body: 18, productName: 17, cardPrice: 19, total: 40, productColumns: 4)),
  xlarge('A++', TextSizes(body: 20, productName: 19, cardPrice: 22, total: 44, productColumns: 3));

  const TextSizeLevel(this.label, this.sizes);

  final String label;
  final TextSizes sizes;
}
