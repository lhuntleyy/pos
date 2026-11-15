import 'package:flutter/material.dart';

import '../../core/theme/tokens.g.dart';

/// Masuk dengan PIN 4 digit. Tombol angka 72 px supaya mudah ditekan semua umur.
class PinScreen extends StatefulWidget {
  const PinScreen({super.key, required this.employeeName, required this.onCompleted});

  final String employeeName;
  final ValueChanged<String> onCompleted;

  static const pinLength = 4;

  @override
  State<PinScreen> createState() => _PinScreenState();
}

class _PinScreenState extends State<PinScreen> {
  String _pin = '';

  void _press(String digit) {
    if (_pin.length >= PinScreen.pinLength) return;
    setState(() => _pin += digit);
    if (_pin.length == PinScreen.pinLength) {
      final pin = _pin;
      setState(() => _pin = '');
      widget.onCompleted(pin);
    }
  }

  void _delete() {
    if (_pin.isEmpty) return;
    setState(() => _pin = _pin.substring(0, _pin.length - 1));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpace.s6),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 360),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('Halo, ${widget.employeeName}', style: theme.textTheme.titleLarge),
                  const SizedBox(height: AppSpace.s2),
                  const Text('Masukkan PIN untuk mulai jualan'),
                  const SizedBox(height: AppSpace.s6),
                  Semantics(
                    label: '${_pin.length} dari ${PinScreen.pinLength} angka PIN diisi',
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        for (var i = 0; i < PinScreen.pinLength; i++)
                          Container(
                            key: ValueKey('pin-dot-$i'),
                            width: 20,
                            height: 20,
                            margin: const EdgeInsets.symmetric(horizontal: 10),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: i < _pin.length ? AppColors.brand : AppColors.surface,
                              border: Border.all(color: AppColors.brand, width: 2),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpace.s8),
                  GridView.count(
                    crossAxisCount: 3,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: AppSpace.s3,
                    crossAxisSpacing: AppSpace.s3,
                    childAspectRatio: 1.4,
                    children: [
                      for (final d in ['1', '2', '3', '4', '5', '6', '7', '8', '9'])
                        _KeyButton(label: d, onTap: () => _press(d)),
                      const SizedBox.shrink(),
                      _KeyButton(label: '0', onTap: () => _press('0')),
                      _KeyButton(label: 'Hapus', semantic: 'Hapus satu angka', onTap: _delete),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _KeyButton extends StatelessWidget {
  const _KeyButton({required this.label, required this.onTap, this.semantic});

  final String label;
  final String? semantic;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isDigit = label.length == 1;
    return Semantics(
      button: true,
      label: semantic ?? label,
      excludeSemantics: true,
      child: Material(
        color: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.lg),
          side: const BorderSide(color: AppColors.line),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(AppRadius.lg),
          onTap: onTap,
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: isDigit ? 28 : 18,
                fontWeight: FontWeight.w800,
                color: AppColors.ink,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
