import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/expense_model.dart';
import '../../../providers/expense_provider.dart';
import '../../widgets/empty_state_view.dart';
import '../../widgets/report_export_sheet.dart';
import 'add_expense_screen.dart';

class ExpenseHomeScreen extends StatelessWidget {
  const ExpenseHomeScreen({super.key});

  void _showReportDialog(BuildContext context, ExpenseProvider provider) {
    final breakdown = provider.categoryBreakdown;
    final total = provider.currentMonthExpenseTotal;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.analytics_rounded, color: AppColors.primary),
            SizedBox(width: 8),
            Text('Monthly Expense Report', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold)),
          ],
        ),
        content: SizedBox(
          width: double.maxFinite,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFF009CBF), Color(0xFF0F172A)]),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Monthly Claim:', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    Text(CurrencyFormatter.formatInr(total), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 18)),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              ...breakdown.entries.map((entry) {
                if (entry.value <= 0) return const SizedBox.shrink();
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(entry.key, style: const TextStyle(fontSize: 12.5, color: Color(0xFF334155), fontWeight: FontWeight.w500)),
                      Text(CurrencyFormatter.formatInr(entry.value), style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
      ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close Report', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
          ),
        ],
      ),
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'Approved':
        return AppColors.success;
      case 'Settled':
        return Colors.teal;
      case 'Rejected':
        return AppColors.error;
      case 'Submitted':
      case 'Draft':
      default:
        return AppColors.goldDark;
    }
  }

  Color _statusBgColor(String status) {
    switch (status) {
      case 'Approved':
        return AppColors.successContainer;
      case 'Settled':
        return const Color(0xFFE0F2F1);
      case 'Rejected':
        return AppColors.errorContainer;
      case 'Submitted':
      case 'Draft':
      default:
        return AppColors.goldContainer;
    }
  }

  @override
  Widget build(BuildContext context) {
    final expenseProvider = context.watch<ExpenseProvider>();
    final expenses = expenseProvider.filteredExpenses;
    final totalExpense = expenseProvider.currentMonthExpenseTotal;
    final approvedTotal = expenseProvider.approvedExpenseTotal;
    final pendingTotal = expenseProvider.pendingExpenseTotal;

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
          'Expense Report & Claims',
          style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined, color: Colors.white),
            tooltip: 'Download Report (PDF / Excel)',
            onPressed: () {
              ReportExportSheet.show(
                context: context,
                reportTitle: 'Monthly Field Expense Report',
                period: 'August 2026 (Month-to-Date)',
                summaryMetrics: {
                  'Total Monthly Expense': CurrencyFormatter.formatInr(totalExpense),
                  'Approved Claims': CurrencyFormatter.formatInr(approvedTotal),
                  'Pending Approval': CurrencyFormatter.formatInr(pendingTotal),
                },
                headers: ['Expense Date', 'Work Place Type', 'Distance (km)', 'DA Amount', 'TA Amount', 'Hotel & Misc', 'Total Claim', 'Status'],
                rows: expenses.map((c) {
                  return [
                    DateFormatter.formatDisplayDate(c.date),
                    c.workPlaceType.label,
                    '${c.travelDistanceKm.toStringAsFixed(1)} km',
                    CurrencyFormatter.formatInr(c.dailyAllowance),
                    CurrencyFormatter.formatInr(c.travelAllowance),
                    CurrencyFormatter.formatInr(c.hotelLodging + c.totalMiscExpense),
                    CurrencyFormatter.formatInr(c.grandTotal),
                    c.status,
                  ];
                }).toList(),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.insert_chart_outlined_rounded, color: Colors.white),
            tooltip: 'Monthly Expense Report',
            onPressed: () => _showReportDialog(context, expenseProvider),
          ),
        ],
      ),
      body: Column(
        children: [
          // Summary Header Banner
          Container(
            margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF009CBF), Color(0xFF0F172A)],
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
                    const Text('MONTHLY EXPENSE SUMMARY', style: TextStyle(color: Colors.white70, fontSize: 10.5, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                  ],
                ),
                const SizedBox(height: 4),
                Text(CurrencyFormatter.formatInr(totalExpense), style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800)),
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
                            const Text('Approved / Settled', style: TextStyle(color: Colors.white70, fontSize: 10)),
                            Text(CurrencyFormatter.formatInr(approvedTotal), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12.5)),
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
                            Text(CurrencyFormatter.formatInr(pendingTotal), style: const TextStyle(color: Colors.amberAccent, fontWeight: FontWeight.bold, fontSize: 12.5)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Reimbursement Status Filter Bar
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: Row(
              children: ['All', 'Pending', 'Approved', 'Rejected', 'Settled'].map((filter) {
                final sel = expenseProvider.selectedStatusFilter == filter;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(filter == 'All' ? 'All Claims' : (filter == 'Pending' ? '⏳ Pending' : (filter == 'Approved' ? '✅ Approved' : (filter == 'Rejected' ? '❌ Rejected' : '💵 Settled')))),
                    selected: sel,
                    selectedColor: AppColors.primary,
                    backgroundColor: Colors.white,
                    side: BorderSide(color: sel ? AppColors.primary : const Color(0xFFE2E8F0)),
                    labelStyle: TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.bold,
                      color: sel ? Colors.white : const Color(0xFF334155),
                    ),
                    onSelected: (s) => s ? expenseProvider.setStatusFilter(filter) : null,
                  ),
                );
              }).toList(),
            ),
          ),

          // Expenses List
          Expanded(
            child: expenses.isEmpty
                ? const EmptyStateView(
                    icon: Icons.receipt_long_outlined,
                    title: 'No Expense Claims in this View',
                    description: 'No expense claims recorded for this selected filter period.',
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: expenses.length,
                    itemBuilder: (ctx, index) {
                      final claim = expenses[index];
                      final stCol = _statusColor(claim.status);
                      final stBg = _statusBgColor(claim.status);

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
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: AppColors.primary,
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          DateFormatter.formatShortDate(claim.date).toUpperCase(),
                                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            DateFormatter.formatDisplayDate(claim.date),
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: Color(0xFF0F172A)),
                                          ),
                                          Text(
                                            claim.workPlaceType.label,
                                            style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  Chip(
                                    label: Text(
                                      claim.status == 'Settled' ? 'Reimbursed' : claim.status,
                                      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: stCol),
                                    ),
                                    backgroundColor: stBg,
                                    side: BorderSide.none,
                                    padding: EdgeInsets.zero,
                                  ),
                                ],
                              ),
                            ),

                            // Details
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
                                              claim.routeCovered,
                                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                                            ),
                                            const SizedBox(height: 4),
                                            Wrap(
                                              spacing: 6,
                                              runSpacing: 4,
                                              children: [
                                                _pill('DA \$${claim.dailyAllowance.toStringAsFixed(0)} (Fixed)'),
                                                if (claim.travelAllowance > 0) _pill('TA ${claim.travelDistanceKm.toInt()}km (\$${claim.travelAllowance.toStringAsFixed(1)})'),
                                                if (claim.fuelAmount > 0) _pill('⛽ \$${claim.fuelAmount.toStringAsFixed(1)}'),
                                                if (claim.taxiAmount > 0) _pill('🚕 \$${claim.taxiAmount.toStringAsFixed(1)}'),
                                                if (claim.hotelLodging > 0) _pill('🏨 \$${claim.hotelLodging.toStringAsFixed(1)}'),
                                                if (claim.foodAmount > 0) _pill('🍲 \$${claim.foodAmount.toStringAsFixed(1)}'),
                                                if (claim.trainAmount > 0) _pill('🚆 \$${claim.trainAmount.toStringAsFixed(1)}'),
                                                if (claim.flightAmount > 0) _pill('✈️ \$${claim.flightAmount.toStringAsFixed(1)}'),
                                                if (claim.totalMiscExpense > 0) _pill('📦 \$${claim.totalMiscExpense.toStringAsFixed(1)}'),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        CurrencyFormatter.formatUsd(claim.grandTotal),
                                        style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.primary),
                                      ),
                                    ],
                                  ),

                                  // Bill Photo Badge
                                  if (claim.billPhotoName != null) ...[
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
                                          const Icon(Icons.image_outlined, size: 14, color: Color(0xFF64748B)),
                                          const SizedBox(width: 4),
                                          Text(
                                            'Bill Attached: ${claim.billPhotoName}',
                                            style: const TextStyle(fontSize: 10.5, color: Color(0xFF475569), fontWeight: FontWeight.w500),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                  // Manager Status & Remarks Card
                                  Container(
                                    margin: const EdgeInsets.only(top: 10),
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
                                    decoration: BoxDecoration(
                                      color: claim.isApproved
                                          ? const Color(0xFFE8F5E9)
                                          : (claim.isRejected
                                              ? const Color(0xFFFFEBEE)
                                              : (claim.isSettled ? const Color(0xFFE0F2F1) : const Color(0xFFFFF8E1))),
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: claim.isApproved
                                            ? const Color(0xFFA5D6A7)
                                            : (claim.isRejected
                                                ? const Color(0xFFEF9A9A)
                                                : (claim.isSettled ? const Color(0xFF80CBC4) : const Color(0xFFFFE082))),
                                        width: 0.9,
                                      ),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Icon(
                                              claim.isApproved
                                                  ? Icons.check_circle_rounded
                                                  : (claim.isRejected
                                                      ? Icons.cancel_rounded
                                                      : (claim.isSettled ? Icons.account_balance_wallet_rounded : Icons.hourglass_top_rounded)),
                                              size: 17,
                                              color: claim.isApproved
                                                  ? const Color(0xFF2E7D32)
                                                  : (claim.isRejected
                                                      ? const Color(0xFFC62828)
                                                      : (claim.isSettled ? const Color(0xFF00695C) : const Color(0xFFF57F17))),
                                            ),
                                            const SizedBox(width: 8),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    claim.isApproved
                                                        ? '✅ Approved by Area Sales Manager (ASM)'
                                                        : (claim.isRejected
                                                            ? '❌ Rejected by Area Sales Manager (ASM)'
                                                            : (claim.isSettled
                                                                ? '💵 Reimbursed & Settled via NEFT Direct Credit'
                                                                : '⏳ Submitted • Pending Review by Area Sales Manager')),
                                                    style: TextStyle(
                                                      fontSize: 11.5,
                                                      fontWeight: FontWeight.bold,
                                                      color: claim.isApproved
                                                          ? const Color(0xFF1B5E20)
                                                          : (claim.isRejected
                                                              ? const Color(0xFFB71C1C)
                                                              : (claim.isSettled ? const Color(0xFF004D40) : const Color(0xFFE65100))),
                                                    ),
                                                  ),
                                                  if (claim.managerRemarks != null && claim.managerRemarks!.isNotEmpty) ...[
                                                    const SizedBox(height: 3),
                                                    Text(
                                                      claim.isRejected
                                                          ? 'Reason: "${claim.managerRemarks}"'
                                                          : 'Manager Note: "${claim.managerRemarks}"',
                                                      style: TextStyle(
                                                        fontSize: 11,
                                                        fontWeight: claim.isRejected ? FontWeight.w600 : FontWeight.normal,
                                                        fontStyle: claim.isRejected ? FontStyle.normal : FontStyle.italic,
                                                        color: claim.isApproved
                                                            ? const Color(0xFF2E7D32)
                                                            : (claim.isRejected
                                                                ? const Color(0xFFC62828)
                                                                : (claim.isSettled ? const Color(0xFF00695C) : const Color(0xFFB45309))),
                                                      ),
                                                    ),
                                                  ],
                                                ],
                                              ),
                                            ),
                                            // Locked badge for Approved / Settled
                                            if (claim.isLocked)
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                                decoration: BoxDecoration(
                                                  color: claim.isApproved ? const Color(0xFF2E7D32) : const Color(0xFF00695C),
                                                  borderRadius: BorderRadius.circular(8),
                                                ),
                                                child: const Row(
                                                  mainAxisSize: MainAxisSize.min,
                                                  children: [
                                                    Icon(Icons.lock_rounded, color: Colors.white, size: 12),
                                                    SizedBox(width: 4),
                                                    Text('Locked', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                                                  ],
                                                ),
                                              ),
                                          ],
                                        ),

                                        // Edit & Resubmit button for Rejected claims
                                        if (claim.isRejected) ...[
                                          const SizedBox(height: 10),
                                          SizedBox(
                                            width: double.infinity,
                                            child: ElevatedButton.icon(
                                              onPressed: () {
                                                Navigator.push(
                                                  context,
                                                  MaterialPageRoute(
                                                    builder: (_) => AddExpenseScreen(initialClaim: claim),
                                                  ),
                                                );
                                              },
                                              icon: const Icon(Icons.edit_note_rounded, size: 16),
                                              label: const Text('Edit & Resubmit Claim', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5)),
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: const Color(0xFF0288D1),
                                                foregroundColor: Colors.white,
                                                padding: const EdgeInsets.symmetric(vertical: 10),
                                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                              ),
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
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        heroTag: 'add_expense_fab',
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AddExpenseScreen()));
        },
        backgroundColor: const Color(0xFF009CBF),
        foregroundColor: Colors.white,
        tooltip: 'Add Expense',
        child: const Icon(Icons.add_rounded, size: 28),
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
