import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/dcr_model.dart';
import '../../../providers/dcr_provider.dart';
import 'dcr_summary_screen.dart';

class CallHistoryScreen extends StatefulWidget {
  const CallHistoryScreen({super.key});

  @override
  State<CallHistoryScreen> createState() => _CallHistoryScreenState();
}

class _CallHistoryScreenState extends State<CallHistoryScreen> with SingleTickerProviderStateMixin {
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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final dcrProvider = context.watch<DcrProvider>();
    final history = dcrProvider.dcrHistory;

    final approvedDcrs = history.where((d) => d.status == 'Approved').toList();
    final rejectedDcrs = history.where((d) => d.status == 'Rejected').toList();
    final pendingDcrs = history.where((d) => d.status == 'Submitted' || d.status == 'Resubmitted' || d.status == 'Draft').toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('DCR Submission & Approval History', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
        backgroundColor: const Color(0xFF0B172E),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabAlignment: TabAlignment.start,
          indicatorColor: const Color(0xFF29B6F6),
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          tabs: [
            Tab(text: 'All Reports (${history.length})'),
            Tab(text: 'Approved (${approvedDcrs.length})'),
            Tab(text: 'Rejected (${rejectedDcrs.length})'),
            Tab(text: 'Pending (${pendingDcrs.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDcrList(context, history, isDark),
          _buildDcrList(context, approvedDcrs, isDark, emptyMsg: 'No approved DCRs yet.'),
          _buildDcrList(context, rejectedDcrs, isDark, emptyMsg: 'No rejected DCRs. Excellent compliance!'),
          _buildDcrList(context, pendingDcrs, isDark, emptyMsg: 'No pending DCR submissions.'),
        ],
      ),
    );
  }

  Widget _buildDcrList(BuildContext context, List<DailyDcrSummary> list, bool isDark, {String emptyMsg = 'No DCR submissions found.'}) {
    if (list.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.history_toggle_off_rounded, size: 48, color: Color(0xFF94A3B8)),
              const SizedBox(height: 12),
              Text(emptyMsg, style: const TextStyle(color: Color(0xFF64748B), fontSize: 13), textAlign: TextAlign.center),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      itemCount: list.length,
      itemBuilder: (context, index) {
        final dcr = list[index];
        final isApproved = dcr.status == 'Approved';
        final isRejected = dcr.status == 'Rejected';
        final isResubmitted = dcr.status == 'Resubmitted';

        Color statusColor;
        Color statusBgColor;
        IconData statusIcon;
        String statusLabel = dcr.status;

        if (isApproved) {
          statusColor = const Color(0xFF16A34A);
          statusBgColor = const Color(0xFFDCFCE7);
          statusIcon = Icons.check_circle_rounded;
          statusLabel = 'Approved by Manager';
        } else if (isRejected) {
          statusColor = const Color(0xFFDC2626);
          statusBgColor = const Color(0xFFFEE2E2);
          statusIcon = Icons.cancel_rounded;
          statusLabel = 'Rejected (Action Required)';
        } else if (isResubmitted) {
          statusColor = const Color(0xFF0288D1);
          statusBgColor = const Color(0xFFE0F2FE);
          statusIcon = Icons.published_with_changes_rounded;
          statusLabel = 'Resubmitted (Pending Review)';
        } else {
          statusColor = const Color(0xFFD97706);
          statusBgColor = const Color(0xFFFEF3C7);
          statusIcon = Icons.hourglass_top_rounded;
          statusLabel = dcr.status == 'Submitted' ? 'Submitted (Pending Review)' : 'Draft Report';
        }

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isRejected ? const Color(0xFFFCA5A5) : (isApproved ? const Color(0xFF86EFAC) : const Color(0xFFE2E8F0)),
              width: isRejected || isApproved ? 1.5 : 1.0,
            ),
            boxShadow: [
              BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 6, offset: const Offset(0, 2)),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Header: Date & Status Badge with perfect vertical alignment
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Icon(Icons.calendar_today_rounded, size: 14, color: Color(0xFF64748B)),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        DateFormatter.formatDisplayDate(dcr.date),
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A)),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                      decoration: BoxDecoration(
                        color: statusBgColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(statusIcon, size: 12, color: statusColor),
                          const SizedBox(width: 4),
                          Text(
                            statusLabel,
                            style: TextStyle(color: statusColor, fontSize: 10.5, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Territory & Call Metrics (Wrapped to prevent any horizontal overflow)
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.pin_drop_outlined, size: 12, color: Color(0xFF475569)),
                          const SizedBox(width: 3),
                          Text(dcr.routePatch, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.medical_services_outlined, size: 12, color: Color(0xFF475569)),
                          const SizedBox(width: 3),
                          Text('${dcr.doctorCalls.length} Doctor Calls', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.inventory_2_outlined, size: 12, color: Color(0xFF475569)),
                          const SizedBox(width: 3),
                          Text('${dcr.totalSamplesGiven} Samples Given', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Manager Remark Box (Approved / Rejected / Pending)
                if (dcr.managerRemark != null && dcr.managerRemark!.isNotEmpty) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: isRejected ? const Color(0xFFFEF2F2) : (isApproved ? const Color(0xFFF0FDF4) : const Color(0xFFF8FAFC)),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: isRejected ? const Color(0xFFFECACA) : (isApproved ? const Color(0xFFBBF7D0) : const Color(0xFFE2E8F0)),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              isRejected ? Icons.warning_amber_rounded : (isApproved ? Icons.verified_rounded : Icons.info_outline_rounded),
                              size: 14,
                              color: isRejected ? const Color(0xFFDC2626) : (isApproved ? const Color(0xFF16A34A) : const Color(0xFF64748B)),
                            ),
                            const SizedBox(width: 5),
                            Expanded(
                              child: Text(
                                isRejected ? 'Manager Rejection Remark:' : (isApproved ? 'Manager Approval Note:' : 'Manager Status:'),
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                  color: isRejected ? const Color(0xFFDC2626) : (isApproved ? const Color(0xFF16A34A) : const Color(0xFF334155)),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          dcr.managerRemark!,
                          style: TextStyle(
                            fontSize: 11.5,
                            height: 1.35,
                            color: isRejected ? const Color(0xFF991B1B) : (isApproved ? const Color(0xFF166534) : const Color(0xFF475569)),
                          ),
                        ),
                        if (dcr.reviewedByManager != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            'Reviewed by: ${dcr.reviewedByManager}',
                            style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B), fontStyle: FontStyle.italic),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                ],

                // Action Buttons Row with clean alignment for MR
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    // Edit & Resubmit button when Rejected or Draft
                    if (isRejected || dcr.status == 'Draft') ...[
                      ElevatedButton.icon(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => DcrSummaryScreen(summary: dcr)),
                          );
                        },
                        icon: const Icon(Icons.edit_note_rounded, size: 15),
                        label: const Text('Edit & Resubmit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFDC2626),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          minimumSize: const Size(0, 32),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                      const SizedBox(width: 8),
                    ],

                    // View Details Button
                    OutlinedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => DcrSummaryScreen(summary: dcr)),
                        );
                      },
                      icon: const Icon(Icons.remove_red_eye_outlined, size: 14),
                      label: const Text('View Report', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.primary,
                        side: const BorderSide(color: AppColors.primary),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        minimumSize: const Size(0, 32),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
