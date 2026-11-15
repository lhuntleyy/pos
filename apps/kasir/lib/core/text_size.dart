import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'theme/tokens.g.dart';

/// Ukuran teks A / A+ / A++ yang dipilih kasir. Nanti disimpan di database lokal (S-01).
class TextSizeNotifier extends Notifier<TextSizeLevel> {
  @override
  TextSizeLevel build() => TextSizeLevel.normal;

  void select(TextSizeLevel level) => state = level;
}

final textSizeProvider =
    NotifierProvider<TextSizeNotifier, TextSizeLevel>(TextSizeNotifier.new);
