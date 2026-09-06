import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/tour_plan_model.dart';
import '../../../providers/tour_plan_provider.dart';
import 'add_tour_plan_screen.dart';

class TourPlanScreen extends StatefulWidget {
  const TourPlanScreen({super.key});

  @override
  State<TourPlanScreen> createState() => _TourPlanScreenState();
}

class _TourPlanScreenState extends State<TourPlanScreen> {
  String _historyFilter = 'All';

  Map<String, dynamic> _getEntityMeta(String entityType) {
    final lower = entityType.toLowerCase();
    if (lower.contains('doctor') || lower.contains('physician')) {
      return {
        'icon': Icons.medical_services_rounded,
        'label': 'DOCTOR',
        'color': const Color(0xFF1E88E5),
        'bgColor': const Color(0xFFEFF6FF),
        'borderColor': const Color(0xFFBFDBFE),
      };
    } else if (lower.contains('chemist') || lower.contains('retail')) {
      return {
        'icon': Icons.local_pharmacy_rounded,
        'label': 'RETAILER',
        'color': const Color(0xFF0D9488),
        'bgColor': const Color(0xFFF0FDF4),
        'borderColor': const Color(0xFFBBF7D0),
      };
    } else if (lower.contains('clinic') || lower.contains('poly')) {
      return {
        'icon': Icons.health_and_safety_rounded,
        'label': 'PVT CLINIC',
        'color': const Color(0xFF6366F1),
        'bgColor': const Color(0xFFEEF2FF),
        'borderColor': const Color(0xFFC7D2FE),
      };
    } else if (lower.contains('govt') || lower.contains('phc') || lower.contains('dispensary')) {
      return {
        'icon': Icons.account_balance_rounded,
        'label': 'GOVT HOSPITAL',
        'color': const Color(0xFFD97706),
        'bgColor': const Color(0xFFFFFBEB),
        'borderColor': const Color(0xFFFDE68A),
      };
    } else if (lower.contains('hospital') || lower.contains('medical center')) {
      return {
        'icon': Icons.local_hospital_rounded,
        'label': 'HOSPITAL',
        'color': const Color(0xFF9333EA),
        'bgColor': const Color(0xFFFAF5FF),
        'borderColor': const Color(0xFFE9D5FF),
      };
    } else {
      return {
        'icon': Icons.warehouse_rounded,
        'label': 'STOCKIST',
        'color': const Color(0xFFB45309),
        'bgColor': const Color(0xFFFFF7ED),
        'borderColor': const Color(0xFFFED7AA),
      };
    }
  }

  void _showDeviationRequestModal(
    BuildContext context,
    TourPlanDay plan,
    TourPlanProvider tourProvider,
  ) {
    String selectedReason = 'Doctor On Leave / Chamber Closed';
    String replacementPatch = 'Central Hospital Zone Hub';
    final remarksCtrl = TextEditingController(text: 'Doctor is out of station. Rescheduling planned visits.');
    final customCtrl = TextEditingController();

    final reasons = [
      'Doctor On Leave / Chamber Closed',
      'Doctor Requested Rescheduled Appointment',
      'Emergency Hospital Critical Case',
      'Territory Roadblock / Transit Issue',
      'Joint Field Work Reassignment with ASM',
      'Urgent Chemist Stockist Order Settlement',
      'Other (Specify custom reason)',
    ];

    final patches = [
      'Central Hospital Zone Hub',
      'North Medical Corridor Patch',
      'East Market Route Hub',
      'South Zone Territory',
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetCtx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          padding: EdgeInsets.only(
            top: 18,
            left: 18,
            right: 18,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(children: [
                      Icon(Icons.alt_route_rounded, color: Color(0xFFD97706), size: 22),
                      SizedBox(width: 8),
                      Text('Request Tour Deviation / Reschedule', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    ]),
                    IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(sheetCtx)),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFFBEB),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFFDE68A)),
                  ),
                  child: const Row(children: [
                    Icon(Icons.info_outline, color: Color(0xFFD97706), size: 16),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Company Compliance: Deviation requests are routed to ASM Rajesh Sharma for validation.',
                        style: TextStyle(fontSize: 11, color: Color(0xFF92400E), fontWeight: FontWeight.w600),
                      ),
                    ),
                  ]),
                ),
                const SizedBox(height: 14),
                const Text('Deviation Reason', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                const SizedBox(height: 5),
                DropdownButtonFormField<String>(
                  initialValue: selectedReason,
                  isExpanded: true,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                  items: reasons.map((r) => DropdownMenuItem(value: r, child: Text(r, style: const TextStyle(fontSize: 12.5), overflow: TextOverflow.ellipsis))).toList(),
                  onChanged: (val) {
                    if (val != null) setModalState(() => selectedReason = val);
                  },
                ),
                if (selectedReason == 'Other (Specify custom reason)') ...[
                  const SizedBox(height: 10),
                  TextField(
                    controller: customCtrl,
                    decoration: InputDecoration(
                      hintText: 'Specify custom deviation reason...',
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    ),
                  ),
                ],
                const SizedBox(height: 14),
                const Text('Replacement Territory Beat / Patch', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                const SizedBox(height: 5),
                DropdownButtonFormField<String>(
                  initialValue: replacementPatch,
                  isExpanded: true,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                  items: patches.map((p) => DropdownMenuItem(value: p, child: Text(p, style: const TextStyle(fontSize: 12.5)))).toList(),
                  onChanged: (val) {
                    if (val != null) setModalState(() => replacementPatch = val);
                  },
                ),
                const SizedBox(height: 14),
                const Text('MR Detailed Remarks for ASM', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                const SizedBox(height: 5),
                TextField(
                  controller: remarksCtrl,
                  maxLines: 2,
                  style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                  decoration: InputDecoration(
                    hintText: 'Enter justification for Area Sales Manager...',
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.all(12),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.pop(sheetCtx),
                        style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                        child: const Text('Cancel'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.send_rounded, size: 16),
                        label: const Text('Submit Deviation to ASM'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFD97706),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          final finalReason = selectedReason == 'Other (Specify custom reason)' ? customCtrl.text : selectedReason;
                          tourProvider.requestDeviation(
                            planId: plan.id,
                            reason: finalReason,
                            remarks: remarksCtrl.text,
                            replacementPatch: replacementPatch,
                          );
                          Navigator.pop(sheetCtx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Deviation submitted to ASM Rajesh Sharma for review!'),
                              backgroundColor: Color(0xFFD97706),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final tourProvider = context.watch<TourPlanProvider>();
    final viewMode = tourProvider.viewMode;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Tour Plan (MTP) & Beat Schedule',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AddTourPlanScreen()));
        },
        backgroundColor: const Color(0xFF1E88E5),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Schedule Tour Plan', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // 1. Top Filter Tabs: Day View | Week View | Month View | Plan History
          Container(
            color: const Color(0xFF0B172E),
            padding: const EdgeInsets.fromLTRB(14, 4, 14, 12),
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                children: [
                  _buildTabPill(
                    label: 'Day View',
                    icon: Icons.calendar_today_rounded,
                    isSelected: viewMode == TourPlanViewMode.perDay,
                    onTap: () => tourProvider.setViewMode(TourPlanViewMode.perDay),
                  ),
                  _buildTabPill(
                    label: 'Week View',
                    icon: Icons.view_week_rounded,
                    isSelected: viewMode == TourPlanViewMode.perWeek,
                    onTap: () => tourProvider.setViewMode(TourPlanViewMode.perWeek),
                  ),
                  _buildTabPill(
                    label: 'Month View',
                    icon: Icons.calendar_month_rounded,
                    isSelected: viewMode == TourPlanViewMode.perMonth,
                    onTap: () => tourProvider.setViewMode(TourPlanViewMode.perMonth),
                  ),
                  _buildTabPill(
                    label: 'Plan History',
                    icon: Icons.history_rounded,
                    isSelected: viewMode == TourPlanViewMode.history,
                    onTap: () => tourProvider.setViewMode(TourPlanViewMode.history),
                  ),
                ],
              ),
            ),
          ),

          // 2. Date Navigation Bar (Shown on Day, Week, Month views)
          if (viewMode != TourPlanViewMode.history)
            _buildDateNavigator(context, tourProvider),

          // 3. Main Content Views based on ViewMode
          Expanded(
            child: viewMode == TourPlanViewMode.perDay
                ? _buildDayView(context, tourProvider)
                : (viewMode == TourPlanViewMode.perWeek
                    ? _buildWeekView(context, tourProvider)
                    : (viewMode == TourPlanViewMode.perMonth
                        ? _buildMonthView(context, tourProvider)
                        : _buildHistoryView(context, tourProvider))),
          ),
        ],
      ),
    );
  }

  Widget _buildTabPill({
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF1E88E5) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 13, color: isSelected ? Colors.white : Colors.white70),
              const SizedBox(width: 4),
              Flexible(
                child: Text(
                  label,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: isSelected ? Colors.white : Colors.white70,
                    fontSize: 11,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDateNavigator(BuildContext context, TourPlanProvider tourProvider) {
    final mode = tourProvider.viewMode;
    final date = tourProvider.selectedDate;

    String displayTitle = '';
    if (mode == TourPlanViewMode.perDay) {
      final isToday = date.year == DateTime.now().year && date.month == DateTime.now().month && date.day == DateTime.now().day;
      displayTitle = isToday ? 'Today, ${DateFormatter.formatDisplayDate(date)}' : DateFormatter.formatDisplayDate(date);
    } else if (mode == TourPlanViewMode.perWeek) {
      final startOfWeek = date.subtract(Duration(days: date.weekday - 1));
      final endOfWeek = startOfWeek.add(const Duration(days: 6));
      displayTitle = 'Week: ${DateFormatter.formatShortDate(startOfWeek)} - ${DateFormatter.formatShortDate(endOfWeek)}';
    } else {
      final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      displayTitle = '${months[date.month - 1]} ${date.year} (Monthly Itinerary)';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Colors.grey.shade200)),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left_rounded, color: Color(0xFF0F172A)),
            tooltip: 'Previous',
            onPressed: () {
              if (mode == TourPlanViewMode.perDay) {
                tourProvider.setSelectedDate(date.subtract(const Duration(days: 1)));
              } else if (mode == TourPlanViewMode.perWeek) {
                tourProvider.setSelectedDate(date.subtract(const Duration(days: 7)));
              } else {
                tourProvider.setSelectedDate(DateTime(date.year, date.month - 1, 1));
              }
            },
          ),
          Expanded(
            child: GestureDetector(
              onTap: () async {
                final picked = await showDatePicker(
                  context: context,
                  initialDate: date,
                  firstDate: DateTime(2025),
                  lastDate: DateTime(2028),
                );
                if (picked != null) tourProvider.setSelectedDate(picked);
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.event_note_rounded, size: 16, color: Color(0xFF1E88E5)),
                  const SizedBox(width: 6),
                  Flexible(
                    child: Text(
                      displayTitle,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF0F172A)),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right_rounded, color: Color(0xFF0F172A)),
            tooltip: 'Next',
            onPressed: () {
              if (mode == TourPlanViewMode.perDay) {
                tourProvider.setSelectedDate(date.add(const Duration(days: 1)));
              } else if (mode == TourPlanViewMode.perWeek) {
                tourProvider.setSelectedDate(date.add(const Duration(days: 7)));
              } else {
                tourProvider.setSelectedDate(DateTime(date.year, date.month + 1, 1));
              }
            },
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 1. PER DAY VIEW
  // ==========================================
  Widget _buildDayView(BuildContext context, TourPlanProvider tourProvider) {
    final plan = tourProvider.selectedDayPlan;

    if (plan == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(18),
                decoration: const BoxDecoration(color: Color(0xFFE3F2FD), shape: BoxShape.circle),
                child: const Icon(Icons.calendar_today_outlined, size: 40, color: Color(0xFF1E88E5)),
              ),
              const SizedBox(height: 16),
              Text(
                'No Tour Plan scheduled for ${DateFormatter.formatShortDate(tourProvider.selectedDate)}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'You can schedule a tour plan proposal to submit for ASM approval.',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const AddTourPlanScreen()));
                },
                icon: const Icon(Icons.add_rounded),
                label: const Text('Schedule Tour Plan for this Day'),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E88E5), foregroundColor: Colors.white),
              ),
            ],
          ),
        ),
      );
    }

    final isDeviation = plan.isDeviationRequested;
    final isPending = plan.isPending;
    final isRejected = plan.isRejected;
    final isApproved = plan.isApproved;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 80),
      children: [
        // Manager Rejection Notice (Action Required)
        if (isRejected) ...[
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFF87171), width: 1.5),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626), size: 20),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Tour Plan Rejected by Manager (Action Required)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFDC2626)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  plan.managerRemarks ?? 'Manager rejected this tour schedule. Please edit targets or beat and resubmit.',
                  style: const TextStyle(fontSize: 12, height: 1.35, color: Color(0xFF991B1B)),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => AddTourPlanScreen(initialPlan: plan)),
                      );
                    },
                    icon: const Icon(Icons.edit_note_rounded, size: 18),
                    label: const Text('Edit & Resubmit Tour Plan', style: TextStyle(fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFDC2626),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],

        // Manager Approval Note
        if (isApproved && plan.managerRemarks != null && plan.managerRemarks!.isNotEmpty) ...[
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF86EFAC), width: 1.5),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.verified_rounded, color: Color(0xFF16A34A), size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Manager Approval Note (Active Plan)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: Color(0xFF166534)),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        plan.managerRemarks!,
                        style: const TextStyle(fontSize: 11.5, color: Color(0xFF14532D), height: 1.3),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],

        // Beat Overview Card
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
            boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 3))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: isPending ? const Color(0xFFFFFBEB) : (isRejected ? const Color(0xFFFFEBEE) : const Color(0xFFE8F5E9)),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      isPending ? Icons.hourglass_top_rounded : (isRejected ? Icons.cancel_outlined : Icons.verified_user_rounded),
                      size: 20,
                      color: isPending ? const Color(0xFFD97706) : (isRejected ? const Color(0xFFDC2626) : const Color(0xFF2E7D32)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          plan.assignedByManager,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                          textAlign: TextAlign.left,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${plan.dayType} • ${plan.patchName}',
                          style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                          textAlign: TextAlign.left,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: isPending
                          ? const Color(0xFFFFFBEB)
                          : (isRejected ? const Color(0xFFFFEBEE) : const Color(0xFFE8F5E9)),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: isPending
                            ? const Color(0xFFFDE68A)
                            : (isRejected ? const Color(0xFFFFCDD2) : const Color(0xFFC8E6C9)),
                      ),
                    ),
                    child: Text(
                      plan.status,
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.bold,
                        color: isPending
                            ? const Color(0xFFD97706)
                            : (isRejected ? const Color(0xFFE53935) : const Color(0xFF2E7D32)),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Visits Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                'SCHEDULED CUSTOMER TARGETS (${plan.plannedVisits.length} Places)',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF475569), letterSpacing: 0.3),
                textAlign: TextAlign.left,
              ),
            ),
            if (isRejected || isPending)
              TextButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => AddTourPlanScreen(initialPlan: plan)),
                  );
                },
                icon: const Icon(Icons.edit_note_rounded, size: 16, color: Color(0xFF1E88E5)),
                label: const Text('Edit Plan', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFF1E88E5))),
                style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4)),
              )
            else if (!isDeviation)
              TextButton.icon(
                onPressed: () => _showDeviationRequestModal(context, plan, tourProvider),
                icon: const Icon(Icons.edit_calendar, size: 14, color: Color(0xFFD97706)),
                label: const Text('Request Deviation', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Color(0xFFD97706))),
                style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4)),
              ),
          ],
        ),
        const SizedBox(height: 8),

        // List of Customer Targets
        ...plan.plannedVisits.asMap().entries.map((entry) {
          final idx = entry.key;
          final visit = entry.value;
          final isExecuted = visit.isExecuted;
          final meta = _getEntityMeta(visit.entityType);
          final Color themeColor = meta['color'] as Color;
          final Color bgColor = meta['bgColor'] as Color;
          final Color borderColor = meta['borderColor'] as Color;
          final IconData icon = meta['icon'] as IconData;
          final String categoryLabel = meta['label'] as String;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isExecuted ? const Color(0xFF86EFAC) : const Color(0xFFE2E8F0)),
              boxShadow: const [
                BoxShadow(color: Color(0x06000000), blurRadius: 6, offset: Offset(0, 2)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Category Pill + Stop Index
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                      decoration: BoxDecoration(
                        color: bgColor,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: borderColor),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(icon, size: 13, color: themeColor),
                          const SizedBox(width: 5),
                          Text(
                            categoryLabel,
                            style: TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.bold,
                              color: themeColor,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Stop #${idx + 1}',
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Entity Name
                Text(
                  visit.entityName,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 14.5,
                    color: Color(0xFF0F172A),
                  ),
                  textAlign: TextAlign.left,
                ),
                const SizedBox(height: 4),

                // Specialty / Class description
                Row(
                  children: [
                    const Icon(Icons.stars_rounded, size: 14, color: Color(0xFF94A3B8)),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        visit.specialtyOrClass,
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                        textAlign: TextAlign.left,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),

                // Planned Call Objective
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFFF1F5F9)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.flag_outlined, size: 13, color: Color(0xFF64748B)),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'Objective: ${visit.plannedObjective}',
                          style: const TextStyle(fontSize: 11.5, color: Color(0xFF334155), height: 1.25),
                          textAlign: TextAlign.left,
                        ),
                      ),
                    ],
                  ),
                ),

                // Focus Products Tags
                if (visit.focusProducts.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: visit.focusProducts.map((prod) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEEF2F6),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          prod,
                          style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ],
            ),
          );
        }),
      ],
    );
  }

  // ==========================================
  // 2. PER WEEK VIEW
  // ==========================================
  Widget _buildWeekView(BuildContext context, TourPlanProvider tourProvider) {
    final weekPlans = tourProvider.currentWeekPlans;

    if (weekPlans.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.view_week_outlined, size: 48, color: Color(0xFF1E88E5)),
              const SizedBox(height: 12),
              const Text('No Tour Plans scheduled for this week', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15), textAlign: TextAlign.center),
              const SizedBox(height: 6),
              const Text('Schedule your weekly plan for manager review', style: TextStyle(fontSize: 12, color: Color(0xFF64748B)), textAlign: TextAlign.center),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AddTourPlanScreen())),
                child: const Text('Schedule Weekly Tour Plan'),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 80),
      itemCount: weekPlans.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (ctx, idx) {
        final plan = weekPlans[idx];
        final progress = plan.completionProgress;

        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: plan.isRejected ? const Color(0xFFF87171) : const Color(0xFFE2E8F0)),
            boxShadow: const [BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 3))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0B172E),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      DateFormatter.formatShortDate(plan.date).toUpperCase(),
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                    decoration: BoxDecoration(
                      color: plan.isApproved
                          ? const Color(0xFFE8F5E9)
                          : (plan.isPending ? const Color(0xFFFFFBEB) : const Color(0xFFFFEBEE)),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      plan.status,
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.bold,
                        color: plan.isApproved
                            ? const Color(0xFF2E7D32)
                            : (plan.isPending ? const Color(0xFFD97706) : const Color(0xFFE53935)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                '${plan.patchName} (${plan.dayType})',
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Color(0xFF0F172A)),
                textAlign: TextAlign.left,
              ),
              const SizedBox(height: 4),
              Text(
                '${plan.plannedVisits.length} Planned Calls • Assigned by ${plan.assignedByManager}',
                style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                textAlign: TextAlign.left,
              ),
              if (plan.isRejected && plan.managerRemarks != null) ...[
                const SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF2F2),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFFFECACA)),
                  ),
                  child: Text(
                    'Remark: ${plan.managerRemarks}',
                    style: const TextStyle(fontSize: 11, color: Color(0xFFB91C1C), fontStyle: FontStyle.italic),
                  ),
                ),
              ],
              const SizedBox(height: 10),
              LinearProgressIndicator(
                value: progress,
                backgroundColor: const Color(0xFFE2E8F0),
                valueColor: AlwaysStoppedAnimation<Color>(progress == 1.0 ? const Color(0xFF10B981) : const Color(0xFF1E88E5)),
                borderRadius: BorderRadius.circular(6),
                minHeight: 6,
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      '${plan.executedCalls}/${plan.totalCalls} Calls Completed (${(progress * 100).toInt()}%)',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                      textAlign: TextAlign.left,
                    ),
                  ),
                  if (plan.isRejected)
                    ElevatedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => AddTourPlanScreen(initialPlan: plan)),
                        );
                      },
                      icon: const Icon(Icons.edit_note_rounded, size: 14),
                      label: const Text('Edit & Resubmit', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFDC2626),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        minimumSize: const Size(0, 30),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    )
                  else
                    TextButton(
                      onPressed: () {
                        tourProvider.setSelectedDate(plan.date);
                        tourProvider.setViewMode(TourPlanViewMode.perDay);
                      },
                      style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4)),
                      child: const Text('Open Daily Plan →', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5)),
                    ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  // ==========================================
  // 3. PER MONTH VIEW
  // ==========================================
  Widget _buildMonthView(BuildContext context, TourPlanProvider tourProvider) {
    final monthPlans = tourProvider.currentMonthPlans;
    final totalPlannedCalls = monthPlans.fold<int>(0, (sum, p) => sum + p.totalCalls);
    final totalExecutedCalls = monthPlans.fold<int>(0, (sum, p) => sum + p.executedCalls);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 80),
      children: [
        // Monthly Metrics Summary Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0B172E), Color(0xFF1B3B6F)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Column(
                children: [
                  const Text('Total Planned', style: TextStyle(color: Colors.white70, fontSize: 11), textAlign: TextAlign.center),
                  const SizedBox(height: 4),
                  Text('$totalPlannedCalls Calls', style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                ],
              ),
              Container(width: 1, height: 35, color: Colors.white24),
              Column(
                children: [
                  const Text('Executed DCR', style: TextStyle(color: Colors.white70, fontSize: 11), textAlign: TextAlign.center),
                  const SizedBox(height: 4),
                  Text('$totalExecutedCalls Calls', style: const TextStyle(color: Color(0xFF00C9A7), fontSize: 17, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                ],
              ),
              Container(width: 1, height: 35, color: Colors.white24),
              Column(
                children: [
                  const Text('Active Days', style: TextStyle(color: Colors.white70, fontSize: 11), textAlign: TextAlign.center),
                  const SizedBox(height: 4),
                  Text('${monthPlans.length} Days', style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        const Text(
          'MONTHLY TOUR SCHEDULE & BEAT ITINERARY',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF475569), letterSpacing: 0.3),
          textAlign: TextAlign.left,
        ),
        const SizedBox(height: 10),

        if (monthPlans.isEmpty)
          const Padding(
            padding: EdgeInsets.all(20),
            child: Center(child: Text('No Tour Plans scheduled for this month.', style: TextStyle(color: Colors.grey))),
          )
        else
          ...monthPlans.map((plan) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: plan.isRejected ? const Color(0xFFF87171) : const Color(0xFFE2E8F0)),
              ),
              child: ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: plan.isRejected ? const Color(0xFFDC2626) : const Color(0xFF0B172E),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Center(
                    child: Text(
                      '${plan.date.day}\n${DateFormatter.formatShortDate(plan.date).split(' ').first}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10),
                    ),
                  ),
                ),
                title: Text(plan.patchName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5), textAlign: TextAlign.left),
                subtitle: Text('${plan.plannedVisits.length} Calls • ${plan.status}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)), textAlign: TextAlign.left),
                trailing: plan.isRejected
                    ? ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => AddTourPlanScreen(initialPlan: plan)),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFDC2626),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          minimumSize: const Size(0, 32),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('Resubmit', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      )
                    : ElevatedButton(
                        onPressed: () {
                          tourProvider.setSelectedDate(plan.date);
                          tourProvider.setViewMode(TourPlanViewMode.perDay);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1E88E5),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          minimumSize: const Size(0, 32),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('View Day', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
              ),
            );
          }),
      ],
    );
  }

  // ==========================================
  // 4. PLAN HISTORY VIEW (Approved / Rejected / Pending)
  // ==========================================
  Widget _buildHistoryView(BuildContext context, TourPlanProvider tourProvider) {
    var allPlans = tourProvider.allPlansHistory;

    if (_historyFilter == 'Approved') {
      allPlans = allPlans.where((p) => p.isApproved).toList();
    } else if (_historyFilter == 'Rejected') {
      allPlans = allPlans.where((p) => p.isRejected).toList();
    } else if (_historyFilter == 'Pending') {
      allPlans = allPlans.where((p) => p.isPending).toList();
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 80),
      children: [
        // Filter Chips Bar
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: ['All', 'Approved', 'Rejected', 'Pending'].map((filter) {
              final sel = _historyFilter == filter;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(filter == 'All' ? 'All Schedules' : '$filter Plans'),
                  selected: sel,
                  selectedColor: filter == 'Rejected'
                      ? const Color(0xFFDC2626)
                      : (filter == 'Approved' ? const Color(0xFF16A34A) : const Color(0xFF1E88E5)),
                  labelStyle: TextStyle(
                    color: sel ? Colors.white : const Color(0xFF334155),
                    fontWeight: sel ? FontWeight.bold : FontWeight.w500,
                    fontSize: 12,
                  ),
                  onSelected: (val) {
                    if (val) setState(() => _historyFilter = filter);
                  },
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 12),

        if (allPlans.isEmpty)
          Padding(
            padding: const EdgeInsets.all(32),
            child: Center(
              child: Column(
                children: [
                  const Icon(Icons.history_toggle_off_rounded, size: 48, color: Colors.grey),
                  const SizedBox(height: 12),
                  Text('No $_historyFilter tour plans found.', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                ],
              ),
            ),
          )
        else
          ...allPlans.map((plan) {
            final isRejected = plan.isRejected;
            final isApproved = plan.isApproved;
            final isPending = plan.isPending;

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isRejected
                      ? const Color(0xFFFCA5A5)
                      : (isApproved ? const Color(0xFFBBF7D0) : const Color(0xFFE2E8F0)),
                  width: isRejected ? 1.5 : 1.0,
                ),
                boxShadow: const [BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 3))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Header: Date & Status Badge
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.calendar_month_outlined, size: 16, color: Color(0xFF1E88E5)),
                          const SizedBox(width: 6),
                          Text(
                            DateFormatter.formatDisplayDate(plan.date),
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A)),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                        decoration: BoxDecoration(
                          color: isApproved
                              ? const Color(0xFFE8F5E9)
                              : (isRejected ? const Color(0xFFFFEBEE) : const Color(0xFFFFFBEB)),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isApproved
                                ? const Color(0xFFC8E6C9)
                                : (isRejected ? const Color(0xFFFFCDD2) : const Color(0xFFFDE68A)),
                          ),
                        ),
                        child: Text(
                          plan.status,
                          style: TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.bold,
                            color: isApproved
                                ? const Color(0xFF2E7D32)
                                : (isRejected ? const Color(0xFFDC2626) : const Color(0xFFD97706)),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Patch & Day Type
                  Text(
                    '${plan.patchName} • ${plan.dayType}',
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF334155)),
                    textAlign: TextAlign.left,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Targets (${plan.plannedVisits.length}): ${plan.plannedVisits.map((v) => v.entityName).take(3).join(', ')}${plan.plannedVisits.length > 3 ? " +${plan.plannedVisits.length - 3} more" : ""}',
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.left,
                  ),

                  // Manager Remark Box
                  if (plan.managerRemarks != null && plan.managerRemarks!.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isRejected
                            ? const Color(0xFFFEF2F2)
                            : (isApproved ? const Color(0xFFF0FDF4) : const Color(0xFFF8FAFC)),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isRejected
                              ? const Color(0xFFFECACA)
                              : (isApproved ? const Color(0xFFBBF7D0) : const Color(0xFFE2E8F0)),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isRejected
                                ? 'ASM Rejection Remark:'
                                : (isApproved ? 'ASM Approval Note:' : 'Submission Note:'),
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: isRejected
                                  ? const Color(0xFFDC2626)
                                  : (isApproved ? const Color(0xFF166534) : const Color(0xFF475569)),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            plan.managerRemarks!,
                            style: TextStyle(
                              fontSize: 11,
                              color: isRejected
                                  ? const Color(0xFF991B1B)
                                  : (isApproved ? const Color(0xFF14532D) : const Color(0xFF334155)),
                              fontStyle: FontStyle.italic,
                            ),
                            textAlign: TextAlign.left,
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 10),

                  // Action Buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      if (isRejected || isPending) ...[
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => AddTourPlanScreen(initialPlan: plan)),
                            );
                          },
                          icon: const Icon(Icons.edit_note_rounded, size: 16),
                          label: const Text('Edit & Resubmit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isRejected ? const Color(0xFFDC2626) : const Color(0xFF1E88E5),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            minimumSize: const Size(0, 32),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                        ),
                        const SizedBox(width: 8),
                      ],
                      OutlinedButton.icon(
                        onPressed: () {
                          tourProvider.setSelectedDate(plan.date);
                          tourProvider.setViewMode(TourPlanViewMode.perDay);
                        },
                        icon: const Icon(Icons.remove_red_eye_outlined, size: 14),
                        label: const Text('View Plan', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF1E88E5),
                          side: const BorderSide(color: Color(0xFF1E88E5)),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          minimumSize: const Size(0, 32),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
      ],
    );
  }
}
