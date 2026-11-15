import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kasir/core/theme/app_theme.dart';
import 'package:kasir/core/theme/tokens.g.dart';
import 'package:kasir/features/auth/pin_screen.dart';
import 'package:kasir/features/sell/sell_screen.dart';

Widget _wrap(Widget child) => ProviderScope(
      child: MaterialApp(theme: buildAppTheme(TextSizeLevel.normal), home: child),
    );

void main() {
  testWidgets('PIN 4 digit memanggil onCompleted', (tester) async {
    String? entered;
    await tester.pumpWidget(_wrap(PinScreen(employeeName: 'Rina', onCompleted: (pin) => entered = pin)));

    expect(find.text('Halo, Rina'), findsOneWidget);
    for (final d in ['1', '9', '0', '4']) {
      await tester.tap(find.text(d));
      await tester.pump();
    }
    expect(entered, '1904');
  });

  testWidgets('Hapus menghapus satu angka', (tester) async {
    String? entered;
    await tester.pumpWidget(_wrap(PinScreen(employeeName: 'Rina', onCompleted: (pin) => entered = pin)));

    await tester.tap(find.text('1'));
    await tester.tap(find.text('2'));
    await tester.tap(find.text('Hapus'));
    await tester.tap(find.text('3'));
    await tester.tap(find.text('4'));
    await tester.tap(find.text('5'));
    await tester.pump();
    expect(entered, '1345');
  });

  testWidgets('ketuk produk menambah ke pesanan dan total', (tester) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(_wrap(const SellScreen()));
    expect(find.text('Ketuk produk untuk menambah ke pesanan'), findsOneWidget);

    await tester.tap(find.text('Es Kopi Susu Aren'));
    await tester.tap(find.text('Es Kopi Susu Aren').first);
    await tester.pump();

    expect(find.text('Bayar · 2 item'), findsOneWidget);
    expect(find.text('Rp36.000'), findsWidgets);
  });

  testWidgets('pilih kategori menyaring produk', (tester) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(_wrap(const SellScreen()));
    await tester.tap(find.text('Camilan'));
    await tester.pump();

    expect(find.text('Pisang Goreng Keju'), findsOneWidget);
    expect(find.text('Es Kopi Susu Aren'), findsNothing);
  });
}
