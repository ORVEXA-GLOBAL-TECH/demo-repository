import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../providers/sales_provider.dart';
import '../../widgets/app_section_card.dart';
import 'add_sales_entry_screen.dart';

class SalesHomeScreen extends StatefulWidget {
  const SalesHomeScreen({super.key});

  @override
  State<SalesHomeScreen> createState() => _SalesHomeScreenState();
}

class _SalesHomeScreenState extends State<SalesHomeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showExportReportDialog(BuildContext context, SalesProvider provider) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.analytics_rounded, color: AppColors.primary),
            SizedBox(width: 8),
            Text('Territory Sales Audit Report', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFF009CBF), Color(0xFF0F172A)]),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('MONTHLY REVENUE SUMMARY', style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(CurrencyFormatter.formatInr(provider.currentMonthAchievedSales), style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800)),
                    Text('Target Achievement: ${provider.targetAchievementPercentage.toStringAsFixed(1)}%', style: const TextStyle(color: Colors.amberAccent, fontSize: 11.5, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              const Text('Top Performing Products:', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
              const SizedBox(height: 6),
              ...provider.productWiseSales.map((p) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 3),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('${p.productName} (${p.unitsSold} pcs)', style: const TextStyle(fontSize: 11.5, color: Color(0xFF334155))),
                    Text(CurrencyFormatter.formatInr(p.totalRevenue), style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  ],
                ),
              )),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Monthly Sales Report exported to PDF & shared!'), backgroundColor: AppColors.success),
              );
            },
            icon: const Icon(Icons.share_rounded, size: 16),
            label: const Text('Share PDF Report'),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final salesProvider = context.watch<SalesProvider>();
    final achieved = salesProvider.currentMonthAchievedSales;
    final target = salesProvider.monthlyTarget;
    final progress = (target > 0) ? (achieved / target).clamp(0.0, 1.0) : 0.0;
    final achievePct = salesProvider.targetAchievementPercentage;

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
        title: const Text(
          'Secondary Sales & Invoices',
          style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.insert_chart_outlined_rounded, color: Colors.white),
            tooltip: 'Export Sales Report',
            onPressed: () => _showExportReportDialog(context, salesProvider),
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Monthly Sales & Target Performance Card
          Container(
            margin: const EdgeInsets.fromLTRB(16, 10, 16, 8),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF009CBF), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('MONTHLY SALES PERFORMANCE', style: TextStyle(color: Colors.white70, fontSize: 10.5, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: achievePct >= 95 ? AppColors.success : AppColors.gold,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '${achievePct.toStringAsFixed(1)}% Achieved',
                        style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(CurrencyFormatter.formatInr(achieved), style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800)),
                    Text('Target: ${CurrencyFormatter.formatInr(target)}', style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600)),
                  ],
                ),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: Colors.white24,
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.greenAccent),
                    minHeight: 6,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _kpiChip('INVOICES', '${salesProvider.totalInvoicesCount} Bills'),
                    const SizedBox(width: 8),
                    _kpiChip('UNITS SOLD', '${salesProvider.totalUnitsSold} Pcs'),
                    const SizedBox(width: 8),
                    _kpiChip('GROWTH', '+14.5% MoM'),
                  ],
                ),
              ],
            ),
          ),

          // 2. Sales Trend Ribbon (Month-on-Month)
          Container(
            height: 60,
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: salesProvider.monthlyTrends.length,
              itemBuilder: (ctx, idx) {
                final pt = salesProvider.monthlyTrends[idx];
                final isCur = pt.isCurrentMonth;

                return Container(
                  width: 92,
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isCur ? AppColors.primary : Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: isCur ? AppColors.primary : const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(pt.monthLabel, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isCur ? Colors.white70 : const Color(0xFF64748B))),
                      const SizedBox(height: 2),
                      Text(CurrencyFormatter.formatCompactInr(pt.achievedAmount), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: isCur ? Colors.white : const Color(0xFF0F172A))),
                    ],
                  ),
                );
              },
            ),
          ),

          // Tabs: Chemist Trade, Stockist Orders, Product-Wise Sales, Territory Target
          TabBar(
            controller: _tabController,
            labelColor: AppColors.primary,
            unselectedLabelColor: const Color(0xFF64748B),
            indicatorColor: AppColors.primary,
            isScrollable: true,
            tabAlignment: TabAlignment.start,
            labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
            tabs: [
              Tab(text: '🏪 Chemists (${salesProvider.invoices.where((i) => i.buyerType == 'Chemist').length})'),
              Tab(text: '🏢 Stockists (${salesProvider.invoices.where((i) => i.buyerType == 'Stockist').length})'),
              const Tab(text: '📊 Products'),
              const Tab(text: '🗺️ Targets & Patches'),
            ],
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Chemist Secondary Orders & Trade Invoices
                _buildInvoiceRegisterList(salesProvider, filterBuyerType: 'Chemist'),

                // 2. Stockist Invoices & Movement
                _buildInvoiceRegisterList(salesProvider, filterBuyerType: 'Stockist'),

                // 3. Product-Wise Sales
                _buildProductWiseList(salesProvider),

                // 4. Territory-Wise Sales & Target Achievement
                _buildTerritoryWiseList(salesProvider),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'sales_fab',
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AddSalesEntryScreen()));
        },
        icon: const Icon(Icons.add_shopping_cart_rounded),
        label: const Text('Add Sales Entry', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _kpiChip(String label, String val) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(6)),
        child: Column(
          children: [
            Text(val, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11.5)),
            Text(label, style: const TextStyle(color: Colors.white60, fontSize: 8.5, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  Widget _buildProductWiseList(SalesProvider provider) {
    final products = provider.productWiseSales;

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: products.length,
      itemBuilder: (ctx, idx) {
        final prod = products[idx];

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(prod.productName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
                  ),
                  Text(CurrencyFormatter.formatInr(prod.totalRevenue), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14.5, color: AppColors.primary)),
                ],
              ),
              Text(prod.molecule, style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
                    child: Text('${prod.unitsSold} Units Sold', style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF334155))),
                  ),
                  Text('Share: ${prod.percentageShare.toStringAsFixed(1)}%', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                  Row(
                    children: [
                      const Icon(Icons.trending_up_rounded, size: 14, color: AppColors.success),
                      const SizedBox(width: 2),
                      Text('+${prod.growthPercentage}%', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.success)),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: (prod.percentageShare / 100).clamp(0.0, 1.0),
                  backgroundColor: const Color(0xFFF1F5F9),
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF009CBF)),
                  minHeight: 4,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTerritoryWiseList(SalesProvider provider) {
    final patches = provider.territoryWiseSales;

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: patches.length,
      itemBuilder: (ctx, idx) {
        final patch = patches[idx];
        final pct = patch.achievementPercent;

        return AppSectionCard(
          title: patch.patchName,
          subtitle: '${patch.chemistsCount} Chemists • ${patch.stockistsCount} Stockists Mapped',
          icon: Icons.map_rounded,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Achieved: ${CurrencyFormatter.formatInr(patch.achievedSales)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                  Text('Target: ${CurrencyFormatter.formatInr(patch.targetSales)}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: (pct / 100).clamp(0.0, 1.0),
                  backgroundColor: const Color(0xFFE2E8F0),
                  valueColor: AlwaysStoppedAnimation<Color>(pct >= 100 ? AppColors.success : const Color(0xFF009CBF)),
                  minHeight: 6,
                ),
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('${pct.toStringAsFixed(1)}% Target Achievement', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: pct >= 100 ? AppColors.success : const Color(0xFF334155))),
                  const Text('Top Demand: CardioVasc-AM', style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildInvoiceRegisterList(SalesProvider provider, {String? filterBuyerType}) {
    final list = filterBuyerType != null
        ? provider.invoices.where((i) => i.buyerType.toLowerCase() == filterBuyerType.toLowerCase()).toList()
        : provider.invoices;

    if (list.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(filterBuyerType == 'Stockist' ? Icons.warehouse_rounded : Icons.local_pharmacy_rounded, size: 48, color: Colors.grey.shade400),
              const SizedBox(height: 12),
              Text('No ${filterBuyerType ?? 'Secondary'} Invoices Recorded', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 4),
              Text('Tap "+ Add Sales Entry" to record trade sales and bills.', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: list.length,
      itemBuilder: (ctx, idx) {
        final inv = list[idx];

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: inv.buyerType.toLowerCase() == 'stockist' ? AppColors.warning : AppColors.primary,
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Text(inv.buyerType.toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 9.5, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 8),
                      Text(inv.invoiceNumber, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                    ],
                  ),
                  Text(CurrencyFormatter.formatInr(inv.grandTotal), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: AppColors.primary)),
                ],
              ),
              const SizedBox(height: 4),
              Text(inv.buyerName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12.5, color: Color(0xFF334155))),
              Text('${inv.territoryPatch} • ${DateFormatter.formatDisplayDate(inv.date)}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              const Divider(height: 14),
              Wrap(
                spacing: 6,
                runSpacing: 4,
                children: inv.items.map((it) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
                  child: Text('${it.productName} (${it.quantity} + ${it.freeQuantity} free)', style: const TextStyle(fontSize: 10, color: Color(0xFF334155), fontWeight: FontWeight.w500)),
                )).toList(),
              ),
              if (inv.invoicePhotoName != null) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(6), border: Border.all(color: Colors.green.shade200)),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.receipt_rounded, size: 13, color: AppColors.success),
                      const SizedBox(width: 4),
                      Text('Bill Attached: ${inv.invoicePhotoName}', style: const TextStyle(fontSize: 10.5, color: AppColors.success, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
