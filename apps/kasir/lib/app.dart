import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/text_size.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/pin_screen.dart';
import 'features/sell/sell_screen.dart';

class KasirApp extends ConsumerWidget {
  const KasirApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final level = ref.watch(textSizeProvider);
    return MaterialApp(
      title: 'POS Kita',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(level),
      home: Builder(
        builder: (context) => PinScreen(
          employeeName: 'Rina',
          // Verifikasi PIN dengan hash argon2id di perangkat dikerjakan di story A-04.
          onCompleted: (_) => Navigator.of(context).pushReplacement(
            MaterialPageRoute<void>(builder: (_) => const SellScreen()),
          ),
        ),
      ),
    );
  }
}
