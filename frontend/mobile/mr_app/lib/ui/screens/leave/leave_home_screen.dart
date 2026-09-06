import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/leave_model.dart';
import '../../../providers/leave_provider.dart';
import '../../widgets/app_section_card.dart';
import 'apply_leave_screen.dart';

class LeaveHomeScreen extends StatefulWidget {
  const LeaveHomeScreen({super.key});

  @override
  State<LeaveHomeScreen> createState() => _LeaveHomeScreenState();
}

class _LeaveHomeScreenState extends State<LeaveHomeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final leaveProvider = context.watch<LeaveProvider>();
    final balances = leaveProvider.balances;
    final totalAvail = leaveProvider.totalAvailableLeaves;
    final totalUsed = leaveProvider.totalUsedLeaves;
    final pendingCount = leaveProvider.pendingApplicationsCount;
    final unreadNotifs = leaveProvider.unreadNotificationsCount;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Color(0xFF0F172A)),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Leave Management', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
            Text('Applications, balances, approvals & holidays', style: TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w600)),
          ],
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined, color: AppColors.primary),
                onPressed: () => _tabController.animateTo(2),
              ),
              if (unreadNotifs > 0)
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle),
                    child: Text('$unreadNotifs', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Leave Balance Master Card
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
                    const Text('ANNUAL LEAVE QUOTA (FY 2026-27)', style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    if (pendingCount > 0)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(color: Colors.amber.shade700, borderRadius: BorderRadius.circular(6)),
                        child: Text('$pendingCount Pending Approval', style: const TextStyle(color: Colors.white, fontSize: 9.5, fontWeight: FontWeight.bold)),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('$totalAvail Days', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800)),
                    Text('$totalUsed Days Taken', style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _balancePill('CL', '${balances[LeaveType.casual]?.availableBalance ?? 0} Left', 'Casual'),
                    const SizedBox(width: 6),
                    _balancePill('SL', '${balances[LeaveType.sick]?.availableBalance ?? 0} Left', 'Sick'),
                    const SizedBox(width: 6),
                    _balancePill('PL', '${balances[LeaveType.paid]?.availableBalance ?? 0} Left', 'Paid'),
                    const SizedBox(width: 6),
                    _balancePill('EL', '${balances[LeaveType.emergency]?.availableBalance ?? 0} Left', 'Emergency'),
                  ],
                ),
              ],
            ),
          ),

          // Tabs
          TabBar(
            controller: _tabController,
            isScrollable: true,
            labelColor: AppColors.primary,
            unselectedLabelColor: const Color(0xFF64748B),
            indicatorColor: AppColors.primary,
            labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
            tabs: [
              const Tab(text: '📝 Applications & History'),
              const Tab(text: '📅 Calendar & Holidays'),
              Tab(text: '🔔 Notifications ${unreadNotifs > 0 ? "($unreadNotifs)" : ""}'),
            ],
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Applications & History
                _buildApplicationsList(leaveProvider),

                // 2. Calendar & Holidays
                _buildHolidaysCalendar(leaveProvider),

                // 3. Notifications Inbox
                _buildNotificationsList(leaveProvider),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'leave_fab',
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const ApplyLeaveScreen()));
        },
        icon: const Icon(Icons.add_task_rounded),
        label: const Text('Apply Leave', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _balancePill(String code, String count, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 2),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
        child: Column(
          children: [
            Text(code, style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
            Text(count, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 11.5)),
            Text(label, style: const TextStyle(color: Colors.white60, fontSize: 7.5, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  // TAB 1: Applications & History
  Widget _buildApplicationsList(LeaveProvider provider) {
    final apps = provider.applications;

    if (apps.isEmpty) {
      return const Center(child: Text('No leave applications recorded yet.'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: apps.length,
      itemBuilder: (ctx, idx) {
        final app = apps[idx];
        final isPending = app.status == 'Pending Approval';
        final isApproved = app.status == 'Approved';

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: isApproved ? Colors.green.shade200 : (isPending ? Colors.amber.shade300 : const Color(0xFFE2E8F0))),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(app.leaveType.displayName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isApproved ? AppColors.successContainer : (isPending ? AppColors.goldContainer : AppColors.errorContainer),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      app.status,
                      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: isApproved ? AppColors.success : (isPending ? AppColors.goldDark : AppColors.error)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('${DateFormatter.formatDisplayDate(app.startDate)} - ${DateFormatter.formatDisplayDate(app.endDate)}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF334155))),
                  Text('${app.totalDays} Day(s) ${app.isHalfDay ? "(Half Day)" : ""}', style: const TextStyle(fontSize: 11.5, color: AppColors.primary, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 6),
              Text('Reason: “${app.reason}”', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontStyle: FontStyle.italic)),
              if (app.managerRemarks != null) ...[
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(8)),
                  child: Row(
                    children: [
                      const Icon(Icons.person_pin_rounded, size: 14, color: AppColors.primary),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text('Manager Note: ${app.managerRemarks}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF334155), fontWeight: FontWeight.w600)),
                      ),
                    ],
                  ),
                ),
              ],
              if (isPending) ...[
                const Divider(height: 16),
                Text('Applied on ${DateFormatter.formatDisplayDate(app.appliedDate)} • Awaiting ASM Approval', style: const TextStyle(fontSize: 11, color: Color(0xFFD97706), fontWeight: FontWeight.w600)),
              ],
            ],
          ),
        );
      },
    );
  }

  // TAB 2: Calendar & Holidays
  Widget _buildHolidaysCalendar(LeaveProvider provider) {
    final holidays = provider.holidays;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        AppSectionCard(
          title: 'Upcoming Company Statutory Holidays',
          subtitle: 'Pharma field operations holiday list (2026)',
          icon: Icons.celebration_rounded,
          child: Column(
            children: holidays.map((h) => Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(10)),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(color: AppColors.primaryContainer, borderRadius: BorderRadius.circular(8)),
                    child: Center(
                      child: Text(DateFormatter.formatShortDate(h.date), textAlign: TextAlign.center, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(h.holidayName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                        Text('${h.dayOfWeek} • ${h.type}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(5)),
                    child: const Text('Field Off', style: TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            )).toList(),
          ),
        ),
      ],
    );
  }

  // TAB 3: Notifications Inbox
  Widget _buildNotificationsList(LeaveProvider provider) {
    final notifs = provider.notifications;

    if (notifs.isEmpty) {
      return const Center(child: Text('No leave notifications.'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: notifs.length,
      itemBuilder: (ctx, idx) {
        final n = notifs[idx];

        return InkWell(
          onTap: () => provider.markNotificationRead(n.id),
          child: Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: n.isRead ? Colors.white : const Color(0xFFF0F9FF),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: n.isRead ? const Color(0xFFE2E8F0) : const Color(0xFFBAE6FD)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  n.type == 'Approval' ? Icons.check_circle_rounded : (n.type == 'Rejection' ? Icons.cancel_rounded : Icons.info_rounded),
                  color: n.type == 'Approval' ? AppColors.success : (n.type == 'Rejection' ? AppColors.error : AppColors.primary),
                  size: 20,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(n.title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: n.isRead ? const Color(0xFF334155) : const Color(0xFF0F172A))),
                      const SizedBox(height: 2),
                      Text(n.message, style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                      const SizedBox(height: 4),
                      Text(DateFormatter.formatDisplayDate(n.timestamp), style: const TextStyle(fontSize: 9.5, color: Color(0xFF94A3B8))),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
