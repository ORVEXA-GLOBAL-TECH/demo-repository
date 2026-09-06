import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/chemist_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/product_provider.dart';
import '../../../providers/order_provider.dart';
import 'pob_cart_screen.dart';
import 'pob_history_screen.dart';

class PobCatalogScreen extends StatefulWidget {
  final ChemistModel? initialChemist;

  const PobCatalogScreen({super.key, this.initialChemist});

  @override
  State<PobCatalogScreen> createState() => _PobCatalogScreenState();
}

class _PobCatalogScreenState extends State<PobCatalogScreen> {
  final TextEditingController _searchController = TextEditingController();
  final Map<String, int> _quantities = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final orderProvider = context.read<OrderProvider>();
      final doctorProvider = context.read<DoctorProvider>();
      if (widget.initialChemist != null) {
        orderProvider.selectChemist(widget.initialChemist!, doctorProvider.stockists);
      } else if (orderProvider.selectedChemist == null && doctorProvider.chemists.isNotEmpty) {
        orderProvider.selectChemist(doctorProvider.chemists.first, doctorProvider.stockists);
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final productProvider = context.watch<ProductProvider>();
    final doctorProvider = context.watch<DoctorProvider>();
    final orderProvider = context.watch<OrderProvider>();
    final products = productProvider.filteredProducts;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('POB Order Booking', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.history_rounded),
            tooltip: 'POB Orders History',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const PobHistoryScreen()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Chemist Selector Header
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant,
              border: Border(bottom: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Select Chemist / Pharmacy', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    if (orderProvider.selectedStockist != null)
                      Text(
                        'Stockist: ${orderProvider.selectedStockist!.agencyName}',
                        style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w600),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                DropdownButtonFormField<ChemistModel>(
                  initialValue: orderProvider.selectedChemist,
                  isExpanded: true,
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    prefixIcon: Icon(Icons.local_pharmacy_rounded, color: AppColors.secondary, size: 20),
                  ),
                  items: doctorProvider.chemists.map((chem) {
                    return DropdownMenuItem(
                      value: chem,
                      child: Text('${chem.shopName} (${chem.patch})', overflow: TextOverflow.ellipsis),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      orderProvider.selectChemist(val, doctorProvider.stockists);
                    }
                  },
                ),
              ],
            ),
          ),

          // Search Field
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
            child: TextField(
              controller: _searchController,
              onChanged: productProvider.setSearchQuery,
              decoration: const InputDecoration(
                hintText: 'Search products by brand, salt or category...',
                prefixIcon: Icon(Icons.search_rounded, size: 20),
                contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              ),
            ),
          ),

          // Product Catalog List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                final qty = _quantities[product.id] ?? 0;

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  product.brandName,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  product.genericName,
                                  style: TextStyle(
                                    fontSize: 11.5,
                                    color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  product.packing,
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                'PTR: \$${product.ptr.toStringAsFixed(2)}',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: AppColors.primary),
                              ),
                              Text(
                                'MRP: \$${product.mrp.toStringAsFixed(2)}',
                                style: TextStyle(
                                  fontSize: 11,
                                  decoration: TextDecoration.lineThrough,
                                  color: isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          if (product.currentScheme != 'None')
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.amber.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: Colors.amber.shade700, width: 0.8),
                              ),
                              child: Text(
                                'Scheme: ${product.currentScheme}',
                                style: TextStyle(
                                  color: Colors.amber.shade800,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                              ),
                            )
                          else
                            const SizedBox(),

                          // Quantity Stepper
                          Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline, size: 22),
                                onPressed: qty > 0 ? () => setState(() => _quantities[product.id] = qty - 5) : null,
                              ),
                              Container(
                                width: 36,
                                alignment: Alignment.center,
                                child: Text(
                                  '$qty',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline, size: 22),
                                onPressed: () => setState(() => _quantities[product.id] = qty + 5),
                              ),
                              const SizedBox(width: 4),
                              ElevatedButton(
                                onPressed: qty > 0
                                    ? () {
                                        // Calculate free units based on scheme
                                        int freeQty = 0;
                                        if (product.currentScheme.contains('+ 1')) {
                                          freeQty = (qty ~/ 10) * 1;
                                        } else if (product.currentScheme.contains('+ 2')) {
                                          freeQty = (qty ~/ 10) * 2;
                                        } else if (product.currentScheme.contains('+ 3')) {
                                          freeQty = (qty ~/ 20) * 3;
                                        }

                                        orderProvider.addToCart(
                                          product,
                                          qty,
                                          freeQty: freeQty,
                                          discount: 2.0,
                                        );

                                        setState(() => _quantities[product.id] = 0);

                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(
                                            content: Text('Added $qty units of ${product.brandName} to cart!'),
                                            duration: const Duration(seconds: 1),
                                          ),
                                        );
                                      }
                                    : null,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  visualDensity: VisualDensity.compact,
                                ),
                                child: const Text('Add', style: TextStyle(fontSize: 12)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: orderProvider.cartCount > 0
          ? Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                border: Border(top: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder)),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 8, offset: const Offset(0, -3)),
                ],
              ),
              child: SafeArea(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${orderProvider.cartCount} Products in Cart',
                          style: const TextStyle(fontSize: 11.5, color: Colors.grey),
                        ),
                        Text(
                          CurrencyFormatter.formatInr(orderProvider.cartGrandTotal),
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const PobCartScreen()),
                        );
                      },
                      icon: const Icon(Icons.shopping_cart_checkout_rounded, size: 18),
                      label: const Text('View Cart & Checkout'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : null,
    );
  }
}
