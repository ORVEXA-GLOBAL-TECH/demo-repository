import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/return_model.dart';
import '../../../providers/return_provider.dart';
import '../../widgets/empty_state_view.dart';
import '../../widgets/report_export_sheet.dart';
import 'add_return_screen.dart';

class ReturnManagementScreen extends StatelessWidget {
  const ReturnManagementScreen({super.key});

  Color _statusColor(String status) {
    switch (status) {
      case 'Approved':
        return AppColors.success;
      case 'Depot Received':
        return const Color(0xFF0288D1);
      case 'Credit Settled':
        return Colors.teal;
      case 'Rejected':
        return AppColors.error;
      case 'Submitted':
      default:
        return AppColors.goldDark;
    }
  }

  Color _statusBgColor(String status) {
    switch (status) {
      case 'Approved':
        return AppColors.successContainer;
      case 'Depot Received':
        return const Color(0xFFE1F5FE);
      case 'Credit Settled':
        return const Color(0xFFE0F2F1);
      case 'Rejected':
        return AppColors.errorContainer;
      case 'Submitted':
      default:
        return AppColors.goldContainer;
    }
  }

  @override
  Widget build(BuildContext context) {
    final returnProvider = context.watch<ReturnProvider>();
    final returns = returnProvider.filteredReturns;
    final totalCount = returnProvider.totalReturnsCount;
    final totalValue = returnProvider.totalReturnValue;
    final pendingCount = returnProvider.pendingReturnsCount;
    final settledValue = returnProvider.settledCreditValue;

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
          'Return Management',
          style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline_rounded, color: Colors.white),
            tooltip: 'Log Return Claim',
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const AddReturnScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Return Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Commercial & Sample Return Audit Report',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'Total Return Claims': '$totalCount Claims',
                  'Total Claim Value': CurrencyFormatter.formatInr(totalValue),
                  'Pending ASM Approvals': '$pendingCount Claims',
                  'Credit Notes Settled': CurrencyFormatter.formatInr(settledValue),
                },
                headers: [
                  'Claim ID',
                  'Date',
                  'Party / Source',
                  'Entity Type',
                  'Product / Sample Name',
                  'Batch No',
                  'Expiry',
                  'Qty',
                  'Total Value',
                  'Reason',
                  'Status',
                ],
                rows: returns.map((r) {
                  return [
                    r.id,
                    DateFormatter.formatDisplayDate(r.date),
                    r.entityName,
                    r.entityType.label,
                    r.productName,
                    r.batchNumber,
                    r.expiryDate,
                    '${r.quantity} ${r.unit}',
                    r.isSampleReturn ? 'Sample (\$0)' : CurrencyFormatter.formatUsd(r.totalClaimValue),
                    r.reason.label,
                    r.status,
                  ];
                }).toList(),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Executive Summary KPI Card
          Container(
            margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFEA580C), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.08),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'TOTAL RETURN CLAIMS VALUE',
                      style: TextStyle(color: Colors.white70, fontSize: 10.5, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '$totalCount Claims Logged',
                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  CurrencyFormatter.formatInr(totalValue),
                  style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Credit Settled', style: TextStyle(color: Colors.white70, fontSize: 10)),
                            Text(
                              CurrencyFormatter.formatInr(settledValue),
                              style: const TextStyle(color: Colors.tealAccent, fontWeight: FontWeight.bold, fontSize: 12.5),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Pending ASM Review', style: TextStyle(color: Colors.white70, fontSize: 10)),
                            Text(
                              '$pendingCount Claims',
                              style: const TextStyle(color: Colors.amberAccent, fontWeight: FontWeight.bold, fontSize: 12.5),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // 2. Search Box
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: TextField(
              onChanged: (val) => returnProvider.setSearchQuery(val),
              decoration: InputDecoration(
                hintText: 'Search by Chemist, Stockist, Doctor, Batch or Product...',
                hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                prefixIcon: const Icon(Icons.search_rounded, size: 19, color: Color(0xFF64748B)),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
              ),
            ),
          ),

          // 3. Entity Source Filter Bar
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              children: ['All', 'Chemist', 'Stockist', 'Hospital / Clinic', 'Doctor Sample'].map((filter) {
                final sel = returnProvider.selectedEntityFilter == filter;
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: ChoiceChip(
                    label: Text(filter == 'All'
                        ? 'All Sources'
                        : (filter == 'Chemist'
                            ? '🏪 Chemist'
                            : (filter == 'Stockist'
                                ? '🏢 Stockist'
                                : (filter == 'Hospital / Clinic' ? '🏥 Hospital/Clinic' : '👨‍⚕️ Doctor Sample')))),
                    selected: sel,
                    selectedColor: const Color(0xFF0B172E),
                    backgroundColor: Colors.white,
                    side: BorderSide(color: sel ? const Color(0xFF0B172E) : const Color(0xFFE2E8F0)),
                    labelStyle: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: sel ? Colors.white : const Color(0xFF334155),
                    ),
                    onSelected: (s) => s ? returnProvider.setEntityFilter(filter) : null,
                  ),
                );
              }).toList(),
            ),
          ),

          // 4. Status Filter Bar
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
            child: Row(
              children: ['All', 'Pending', 'Approved', 'Depot Received', 'Credit Settled', 'Rejected'].map((filter) {
                final sel = returnProvider.selectedStatusFilter == filter;
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: ChoiceChip(
                    label: Text(filter == 'All'
                        ? 'All Status'
                        : (filter == 'Pending'
                            ? '⏳ Pending'
                            : (filter == 'Approved'
                                ? '✅ Approved'
                                : (filter == 'Depot Received'
                                    ? '📦 Depot Received'
                                    : (filter == 'Credit Settled' ? '💵 Credit Settled' : '❌ Rejected'))))),
                    selected: sel,
                    selectedColor: AppColors.primary,
                    backgroundColor: Colors.white,
                    side: BorderSide(color: sel ? AppColors.primary : const Color(0xFFE2E8F0)),
                    labelStyle: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: sel ? Colors.white : const Color(0xFF334155),
                    ),
                    onSelected: (s) => s ? returnProvider.setStatusFilter(filter) : null,
                  ),
                );
              }).toList(),
            ),
          ),

          // 5. Returns List
          Expanded(
            child: returns.isEmpty
                ? const EmptyStateView(
                    icon: Icons.assignment_return_outlined,
                    title: 'No Returns in this View',
                    description: 'No commercial or sample returns match your active filter criteria.',
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: returns.length,
                    itemBuilder: (ctx, index) {
                      final item = returns[index];
                      final stCol = _statusColor(item.status);
                      final stBg = _statusBgColor(item.status);

                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.025),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Header
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: const BoxDecoration(
                                color: Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                                border: Border(bottom: BorderSide(color: Color(0xFFF1F5F9))),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: item.entityType.badgeColor,
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            item.id,
                                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                item.entityName,
                                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: Color(0xFF0F172A)),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                              Text(
                                                '${item.entityType.label} • ${item.patch}',
                                                style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Chip(
                                    label: Text(
                                      item.status,
                                      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: stCol),
                                    ),
                                    backgroundColor: stBg,
                                    side: BorderSide.none,
                                    padding: EdgeInsets.zero,
                                  ),
                                ],
                              ),
                            ),

                            // Product & Return Claim Info
                            Padding(
                              padding: const EdgeInsets.all(14),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              item.productName,
                                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A)),
                                            ),
                                            const SizedBox(height: 5),
                                            Wrap(
                                              spacing: 6,
                                              runSpacing: 4,
                                              children: [
                                                _pill('Batch: ${item.batchNumber}'),
                                                _pill('Exp: ${item.expiryDate}'),
                                                _pill('Qty: ${item.quantity} ${item.unit}'),
                                                _pill('Type: ${item.settlementPreference.label}'),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: [
                                          Text(
                                            item.isSampleReturn ? 'Physician Sample' : CurrencyFormatter.formatUsd(item.totalClaimValue),
                                            style: TextStyle(
                                              fontSize: item.isSampleReturn ? 12 : 16.5,
                                              fontWeight: FontWeight.w800,
                                              color: item.isSampleReturn ? const Color(0xFF0284C7) : const Color(0xFFEA580C),
                                            ),
                                          ),
                                          if (!item.isSampleReturn)
                                            Text(
                                              '\$${item.unitPrice.toStringAsFixed(1)}/${item.unit}',
                                              style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                                            ),
                                        ],
                                      ),
                                    ],
                                  ),

                                  // Reason Pill
                                  const SizedBox(height: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: item.reason.color.withValues(alpha: 0.1),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(Icons.warning_amber_rounded, size: 14, color: item.reason.color),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Reason: ${item.reason.label}',
                                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: item.reason.color),
                                        ),
                                      ],
                                    ),
                                  ),

                                  if (item.reasonDescription != null) ...[
                                    const SizedBox(height: 4),
                                    Text(
                                      item.reasonDescription!,
                                      style: const TextStyle(fontSize: 11, color: Color(0xFF475569)),
                                    ),
                                  ],

                                  // Bill Photo Badge
                                  if (item.billPhotoName != null) ...[
                                    const SizedBox(height: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFF1F5F9),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(Icons.image_outlined, size: 13, color: Color(0xFF64748B)),
                                          const SizedBox(width: 4),
                                          Text(
                                            'Proof Attached: ${item.billPhotoName}',
                                            style: const TextStyle(fontSize: 10.5, color: Color(0xFF475569), fontWeight: FontWeight.w500),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],

                                  // Manager / Warehouse Approval Status Card
                                  Container(
                                    margin: const EdgeInsets.only(top: 10),
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
                                    decoration: BoxDecoration(
                                      color: item.status == 'Approved'
                                          ? const Color(0xFFE8F5E9)
                                          : (item.status == 'Depot Received'
                                              ? const Color(0xFFE1F5FE)
                                              : (item.status == 'Credit Settled'
                                                  ? const Color(0xFFE0F2F1)
                                                  : (item.status == 'Rejected' ? const Color(0xFFFFEBEE) : const Color(0xFFFFF8E1)))),
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: item.status == 'Approved'
                                            ? const Color(0xFFA5D6A7)
                                            : (item.status == 'Depot Received'
                                                ? const Color(0xFF81D4FA)
                                                : (item.status == 'Credit Settled'
                                                    ? const Color(0xFF80CBC4)
                                                    : (item.status == 'Rejected' ? const Color(0xFFEF9A9A) : const Color(0xFFFFE082)))),
                                        width: 0.9,
                                      ),
                                    ),
                                    child: Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Icon(
                                          item.status == 'Approved'
                                              ? Icons.check_circle_rounded
                                              : (item.status == 'Depot Received'
                                                  ? Icons.inventory_rounded
                                                  : (item.status == 'Credit Settled'
                                                      ? Icons.receipt_long_rounded
                                                      : (item.status == 'Rejected' ? Icons.cancel_rounded : Icons.hourglass_top_rounded))),
                                          size: 17,
                                          color: item.status == 'Approved'
                                              ? const Color(0xFF2E7D32)
                                              : (item.status == 'Depot Received'
                                                  ? const Color(0xFF0288D1)
                                                  : (item.status == 'Credit Settled'
                                                      ? const Color(0xFF00695C)
                                                      : (item.status == 'Rejected' ? const Color(0xFFC62828) : const Color(0xFFF57F17)))),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                item.status == 'Approved'
                                                    ? '✅ Approved by Area Sales Manager (ASM)'
                                                    : (item.status == 'Depot Received'
                                                        ? '📦 Received & Audited at Central Depot'
                                                        : (item.status == 'Credit Settled'
                                                            ? '💵 Credit Note Issued & Ledger Settled'
                                                            : (item.status == 'Rejected'
                                                                ? '❌ Return Claim Rejected by ASM / Depot'
                                                                : '⏳ Claim Submitted • Pending ASM Verification'))),
                                                style: TextStyle(
                                                  fontSize: 11.5,
                                                  fontWeight: FontWeight.bold,
                                                  color: item.status == 'Approved'
                                                      ? const Color(0xFF1B5E20)
                                                      : (item.status == 'Depot Received'
                                                          ? const Color(0xFF01579B)
                                                          : (item.status == 'Credit Settled'
                                                              ? const Color(0xFF004D40)
                                                              : (item.status == 'Rejected'
                                                                  ? const Color(0xFFB71C1C)
                                                                  : const Color(0xFFE65100)))),
                                                ),
                                              ),
                                              if (item.creditNoteNumber != null) ...[
                                                const SizedBox(height: 2),
                                                Text(
                                                  'Ref / CN No: ${item.creditNoteNumber}',
                                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                                ),
                                              ],
                                              if (item.managerRemarks != null && item.managerRemarks!.isNotEmpty) ...[
                                                const SizedBox(height: 3),
                                                Text(
                                                  item.status == 'Rejected'
                                                      ? 'Reason: "${item.managerRemarks}"'
                                                      : 'Note: "${item.managerRemarks}"',
                                                  style: TextStyle(
                                                    fontSize: 11,
                                                    fontWeight: item.status == 'Rejected' ? FontWeight.w600 : FontWeight.normal,
                                                    fontStyle: item.status == 'Rejected' ? FontStyle.normal : FontStyle.italic,
                                                    color: item.status == 'Approved'
                                                        ? const Color(0xFF2E7D32)
                                                        : (item.status == 'Depot Received'
                                                            ? const Color(0xFF0288D1)
                                                            : (item.status == 'Credit Settled'
                                                                ? const Color(0xFF00695C)
                                                                : (item.status == 'Rejected'
                                                                    ? const Color(0xFFC62828)
                                                                    : const Color(0xFFB45309)))),
                                                  ),
                                                ),
                                              ],
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'add_return_fab',
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AddReturnScreen()));
        },
        backgroundColor: const Color(0xFFEA580C),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.assignment_return_rounded, size: 20),
        label: const Text(
          'Log Return Claim',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, letterSpacing: 0.3),
        ),
      ),
    );
  }

  Widget _pill(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: const TextStyle(fontSize: 10, color: Color(0xFF334155), fontWeight: FontWeight.w600),
      ),
    );
  }
}
