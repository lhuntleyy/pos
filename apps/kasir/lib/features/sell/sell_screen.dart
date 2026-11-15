import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/money.dart';
import '../../core/text_size.dart';
import '../../core/theme/app_theme.dart';
import '../../core/theme/tokens.g.dart';
import '../../core/widgets/status_chip.dart';
import 'cart.dart';
import 'sample_catalog.dart';

/// Layar jualan (kerangka story C-01). Tablet: grid + keranjang di kanan. HP: grid + bar total di bawah.
class SellScreen extends ConsumerStatefulWidget {
  const SellScreen({super.key});

  @override
  ConsumerState<SellScreen> createState() => _SellScreenState();
}

class _SellScreenState extends ConsumerState<SellScreen> {
  String _category = 'semua';

  @override
  Widget build(BuildContext context) {
    final products = _category == 'semua'
        ? sampleProducts
        : sampleProducts.where((p) => p.categoryId == _category).toList();

    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final wide = constraints.maxWidth >= 840;
            final catalog = Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const _TopBar(),
                _CategoryBar(
                  selected: _category,
                  onSelected: (id) => setState(() => _category = id),
                ),
                Expanded(child: _ProductGrid(products: products)),
              ],
            );
            if (wide) {
              return Row(
                children: [
                  Expanded(child: catalog),
                  const SizedBox(width: 380, child: _CartPanel()),
                ],
              );
            }
            return Column(
              children: [
                Expanded(child: catalog),
                const _PayBar(),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _TopBar extends ConsumerWidget {
  const _TopBar();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final level = ref.watch(textSizeProvider);
    return Padding(
      padding: const EdgeInsets.fromLTRB(AppSpace.s4, AppSpace.s3, AppSpace.s4, 0),
      child: Wrap(
        spacing: AppSpace.s3,
        runSpacing: AppSpace.s2,
        crossAxisAlignment: WrapCrossAlignment.center,
        alignment: WrapAlignment.spaceBetween,
        children: [
          // Nanti membaca status outbox sinkron (story S-04).
          const StatusChip(tone: StatusTone.success, label: 'Online · semua data terkirim'),
          SegmentedButton<TextSizeLevel>(
            showSelectedIcon: false,
            segments: [
              for (final l in TextSizeLevel.values)
                ButtonSegment(value: l, label: Text(l.label), tooltip: 'Ukuran teks ${l.label}'),
            ],
            selected: {level},
            onSelectionChanged: (s) => ref.read(textSizeProvider.notifier).select(s.first),
          ),
        ],
      ),
    );
  }
}

class _CategoryBar extends StatelessWidget {
  const _CategoryBar({required this.selected, required this.onSelected});

  final String selected;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: TouchSize.category + AppSpace.s6,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpace.s4, vertical: AppSpace.s3),
        itemCount: sampleCategories.length,
        separatorBuilder: (_, _) => const SizedBox(width: AppSpace.s2),
        itemBuilder: (context, i) {
          final c = sampleCategories[i];
          final active = c.id == selected;
          return Semantics(
            selected: active,
            button: true,
            child: Material(
              color: active ? AppColors.brand : AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.pill),
                side: BorderSide(color: active ? AppColors.brand : AppColors.line),
              ),
              child: InkWell(
                borderRadius: BorderRadius.circular(AppRadius.pill),
                onTap: () => onSelected(c.id),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpace.s5),
                  child: Center(
                    child: Text(
                      c.name,
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: active ? AppColors.onBrand : AppColors.ink,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _ProductGrid extends ConsumerWidget {
  const _ProductGrid({required this.products});

  final List<Product> products;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sizes = ref.watch(textSizeProvider).sizes;
    final cart = ref.watch(cartProvider);

    return LayoutBuilder(
      builder: (context, constraints) {
        // HP: 2 kolom. Tablet: jumlah kolom dari token (4 / 4 / 3).
        final columns = constraints.maxWidth < 600 ? 2 : sizes.productColumns;
        return GridView.builder(
          padding: const EdgeInsets.all(AppSpace.s4),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: columns,
            mainAxisSpacing: AppSpace.s3,
            crossAxisSpacing: AppSpace.s3,
            childAspectRatio: 1.2,
          ),
          itemCount: products.length,
          itemBuilder: (context, i) {
            final p = products[i];
            final qty = cart.qtyOf(p.id);
            return _ProductCard(
              product: p,
              qty: qty,
              nameSize: sizes.productName,
              priceSize: sizes.cardPrice,
              onTap: () => ref.read(cartProvider.notifier).add(p),
            );
          },
        );
      },
    );
  }
}

class _ProductCard extends StatelessWidget {
  const _ProductCard({
    required this.product,
    required this.qty,
    required this.nameSize,
    required this.priceSize,
    required this.onTap,
  });

  final Product product;
  final int qty;
  final double nameSize;
  final double priceSize;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: '${product.name}, ${formatRupiah(product.price)}${qty > 0 ? ', $qty di keranjang' : ''}',
      excludeSemantics: true,
      child: Material(
        color: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.lg),
          side: BorderSide(color: qty > 0 ? AppColors.brand : AppColors.line, width: qty > 0 ? 2 : 1),
        ),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: Container(
                  color: product.tint,
                  alignment: Alignment.topRight,
                  padding: const EdgeInsets.all(AppSpace.s2),
                  child: qty > 0
                      ? Container(
                          constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: AppColors.brand,
                            borderRadius: BorderRadius.circular(AppRadius.pill),
                          ),
                          child: Text(
                            '$qty',
                            style: const TextStyle(color: AppColors.onBrand, fontWeight: FontWeight.w800),
                          ),
                        )
                      : null,
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(AppSpace.s3, AppSpace.s2, AppSpace.s3, AppSpace.s3),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: nameSize, fontWeight: FontWeight.w700),
                    ),
                    Text(formatRupiah(product.price), style: moneyStyle(priceSize)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CartPanel extends ConsumerWidget {
  const _CartPanel();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    final sizes = ref.watch(textSizeProvider).sizes;

    return DecoratedBox(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(left: BorderSide(color: AppColors.line)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpace.s4),
            child: Text('Pesanan', style: Theme.of(context).textTheme.titleLarge),
          ),
          Expanded(
            child: cart.isEmpty
                ? const Center(child: Text('Ketuk produk untuk menambah ke pesanan'))
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpace.s4),
                    itemCount: cart.lines.length,
                    separatorBuilder: (_, _) => const Divider(height: 1),
                    itemBuilder: (context, i) {
                      final line = cart.lines[i];
                      return SizedBox(
                        height: TouchSize.category,
                        child: Row(
                          children: [
                            IconButton(
                              tooltip: 'Kurangi ${line.product.name}',
                              constraints: const BoxConstraints(
                                minWidth: TouchSize.min,
                                minHeight: TouchSize.min,
                              ),
                              icon: const Icon(Icons.remove_circle_outline),
                              onPressed: () => ref.read(cartProvider.notifier).decrement(line.product.id),
                            ),
                            Text('${line.qty}×', style: moneyStyle(sizes.body, weight: FontWeight.w700)),
                            const SizedBox(width: AppSpace.s2),
                            Expanded(
                              child: Text(line.product.name, maxLines: 1, overflow: TextOverflow.ellipsis),
                            ),
                            Text(formatRupiah(line.subtotal), style: moneyStyle(sizes.body, weight: FontWeight.w700)),
                          ],
                        ),
                      );
                    },
                  ),
          ),
          const _PayBar(),
        ],
      ),
    );
  }
}

class _PayBar extends ConsumerWidget {
  const _PayBar();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    return Container(
      padding: const EdgeInsets.all(AppSpace.s4),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.line)),
      ),
      child: FilledButton(
        key: const ValueKey('pay-button'),
        onPressed: cart.isEmpty
            ? null
            : () => ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Layar bayar dikerjakan di story C-02')),
                ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(cart.isEmpty ? 'Bayar' : 'Bayar · ${cart.itemCount} item'),
            Text(formatRupiah(cart.total), style: const TextStyle(fontFeatures: [FontFeature.tabularFigures()])),
          ],
        ),
      ),
    );
  }
}
