import 'package:flutter/material.dart';

import 'tokens.g.dart';

/// Tema dari design tokens. Ukuran teks mengikuti pilihan A / A+ / A++.
ThemeData buildAppTheme(TextSizeLevel level) {
  final s = level.sizes;
  final scheme = ColorScheme.fromSeed(
    seedColor: AppColors.brand,
    primary: AppColors.brand,
    onPrimary: AppColors.onBrand,
    error: AppColors.danger,
    surface: AppColors.surface,
    onSurface: AppColors.ink,
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    fontFamily: appFontFamily,
    scaffoldBackgroundColor: AppColors.canvas,
    textTheme: TextTheme(
      bodyLarge: TextStyle(fontSize: s.body, color: AppColors.ink),
      bodyMedium: TextStyle(fontSize: s.body, color: AppColors.ink),
      titleMedium: TextStyle(
        fontSize: s.productName,
        fontWeight: FontWeight.w700,
        color: AppColors.ink,
      ),
      titleLarge: TextStyle(
        fontSize: s.body + 4,
        fontWeight: FontWeight.w800,
        color: AppColors.ink,
      ),
      labelLarge: TextStyle(fontSize: s.body, fontWeight: FontWeight.w700),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(TouchSize.min, TouchSize.primary),
        backgroundColor: AppColors.brand,
        foregroundColor: AppColors.onBrand,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        textStyle: TextStyle(fontSize: s.body + 2, fontWeight: FontWeight.w800),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(TouchSize.min, TouchSize.min),
        foregroundColor: AppColors.brandStrong,
        side: const BorderSide(color: AppColors.brand, width: 2),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
      ),
    ),
    dividerColor: AppColors.lineSoft,
  );
}

/// Gaya angka uang: digit tabular supaya kolom angka rata.
TextStyle moneyStyle(double fontSize, {FontWeight weight = FontWeight.w800}) =>
    TextStyle(
      fontSize: fontSize,
      fontWeight: weight,
      fontFeatures: const [FontFeature.tabularFigures()],
      color: AppColors.ink,
    );
