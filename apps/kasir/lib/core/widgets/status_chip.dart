import 'package:flutter/material.dart';

import '../theme/tokens.g.dart';

enum StatusTone { success, warning, danger }

/// Status selalu warna + ikon + teks, tidak boleh warna saja.
class StatusChip extends StatelessWidget {
  const StatusChip({super.key, required this.tone, required this.label});

  final StatusTone tone;
  final String label;

  @override
  Widget build(BuildContext context) {
    final (Color bg, Color fg, IconData icon) = switch (tone) {
      StatusTone.success => (AppColors.successSoft, AppColors.success, Icons.check_circle),
      StatusTone.warning => (AppColors.highlightSoft, AppColors.highlightInk, Icons.schedule),
      StatusTone.danger => (AppColors.dangerSoft, AppColors.danger, Icons.error),
    };

    return Semantics(
      liveRegion: true,
      child: Container(
        constraints: const BoxConstraints(minHeight: 40),
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(AppRadius.pill),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: fg, size: 20),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                label,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: fg, fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
