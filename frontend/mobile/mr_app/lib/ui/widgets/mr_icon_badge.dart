import 'package:flutter/material.dart';

enum MrIconType {
  // Work Icons
  reporting,
  tourPlan,
  expenditure,
  pob,
  secondarySales,
  rcpa,
  sponsor,
  scheme,
  eDetailing,
  videoLibrary,
  products,
  returnManagement,
  manage,

  // Utilities Icons
  toDo,
  holiday,
  salarySlips,
  applyLeave,
  documents,
  distanceChecker,
  nearBy,
  userGuide,
  notes,
  distanceNearby,
  calculator,

  // Reports Icons
  doctorReport,
  chemistReport,
  otherReports,
  primarySales,
  secondaryReport,
  pobReport,
  missedCall,
  tourPlanReport,
  attendanceReport,
  expensesReport,
  targetPerformance,
  doctorMatrix,
  chemistMatrix,
  sampleReport,
  orderHistory,
  totalMatrix,

  // Profile Icons
  myProfile,
  notification,
  announcement,
  mobileSettings,
  appSettings,
  security,
  helpSupport,
}

class MrIconBadge extends StatelessWidget {
  final MrIconType type;
  final double size;
  final int? badgeCount;

  const MrIconBadge({
    super.key,
    required this.type,
    this.size = 54,
    this.badgeCount,
  });

  @override
  Widget build(BuildContext context) {
    final spec = _getIconSpec(type);

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          // Outer soft glow circular badge
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              gradient: RadialGradient(
                colors: [
                  spec.bgColor.withValues(alpha: 0.28),
                  spec.bgColor.withValues(alpha: 0.08),
                ],
                radius: 0.85,
              ),
              shape: BoxShape.circle,
            ),
          ),
          // Inner icon representation
          spec.builder(size * 0.62),
          // Badge if present
          if (badgeCount != null)
            Positioned(
              top: -2,
              right: -2,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                decoration: BoxDecoration(
                  color: const Color(0xFFE53935),
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.red.withValues(alpha: 0.4),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                child: Text(
                  '$badgeCount',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 9.5,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  _IconSpec _getIconSpec(MrIconType type) {
    switch (type) {
      // ----------------- WORK ICONS -----------------
      case MrIconType.reporting:
        return _IconSpec(
          bgColor: const Color(0xFFE3F2FD),
          builder: (s) => Icon(Icons.medical_services_rounded, size: s, color: const Color(0xFF29B6F6)),
        );
      case MrIconType.tourPlan:
        return _IconSpec(
          bgColor: const Color(0xFFFFF9C4),
          builder: (s) => Icon(Icons.alt_route_rounded, size: s, color: const Color(0xFFE53935)),
        );
      case MrIconType.expenditure:
        return _IconSpec(
          bgColor: const Color(0xFFFFECB3),
          builder: (s) => Icon(Icons.account_balance_wallet_rounded, size: s, color: const Color(0xFFE65100)),
        );
      case MrIconType.pob:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.inventory_2_rounded, size: s, color: const Color(0xFFFB8C00)),
        );
      case MrIconType.secondarySales:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.auto_graph_rounded, size: s, color: const Color(0xFF43A047)),
        );
      case MrIconType.rcpa:
        return _IconSpec(
          bgColor: const Color(0xFFFFEBEE),
          builder: (s) => Icon(Icons.receipt_long_rounded, size: s, color: const Color(0xFF1E88E5)),
        );
      case MrIconType.sponsor:
        return _IconSpec(
          bgColor: const Color(0xFFFFF3E0),
          builder: (s) => Icon(Icons.handshake_rounded, size: s, color: const Color(0xFFFB8C00)),
        );
      case MrIconType.scheme:
        return _IconSpec(
          bgColor: const Color(0xFFFFEBEE),
          builder: (s) => Icon(Icons.discount_rounded, size: s, color: const Color(0xFFE53935)),
        );
      case MrIconType.eDetailing:
        return _IconSpec(
          bgColor: const Color(0xFFE0F7FA),
          builder: (s) => Icon(Icons.photo_library_rounded, size: s, color: const Color(0xFF00ACC1)),
        );
      case MrIconType.videoLibrary:
        return _IconSpec(
          bgColor: const Color(0xFFFCE4EC),
          builder: (s) => Icon(Icons.video_library_rounded, size: s, color: const Color(0xFFE91E63)),
        );
      case MrIconType.products:
        return _IconSpec(
          bgColor: const Color(0xFFFFF8E1),
          builder: (s) => Icon(Icons.assignment_rounded, size: s, color: const Color(0xFF8D6E63)),
        );
      case MrIconType.returnManagement:
        return _IconSpec(
          bgColor: const Color(0xFFFFF3E0),
          builder: (s) => Icon(Icons.assignment_return_rounded, size: s, color: const Color(0xFFEA580C)),
        );
      case MrIconType.manage:
        return _IconSpec(
          bgColor: const Color(0xFFE1F5FE),
          builder: (s) => Icon(Icons.person_add_alt_1_rounded, size: s, color: const Color(0xFF039BE5)),
        );

      // ----------------- UTILITIES ICONS -----------------
      case MrIconType.toDo:
        return _IconSpec(
          bgColor: const Color(0xFFFFE0B2),
          builder: (s) => Icon(Icons.checklist_rounded, size: s, color: const Color(0xFFF4511E)),
        );
      case MrIconType.holiday:
        return _IconSpec(
          bgColor: const Color(0xFFFFEBEE),
          builder: (s) => Icon(Icons.calendar_month_rounded, size: s, color: const Color(0xFFE53935)),
        );
      case MrIconType.salarySlips:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.request_quote_rounded, size: s, color: const Color(0xFF2E7D32)),
        );
      case MrIconType.applyLeave:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.time_to_leave_rounded, size: s, color: const Color(0xFF43A047)),
        );
      case MrIconType.documents:
        return _IconSpec(
          bgColor: const Color(0xFFE3F2FD),
          builder: (s) => Icon(Icons.description_rounded, size: s, color: const Color(0xFF1976D2)),
        );
      case MrIconType.distanceChecker:
        return _IconSpec(
          bgColor: const Color(0xFFFFEBEE),
          builder: (s) => Icon(Icons.linear_scale_rounded, size: s, color: const Color(0xFFE53935)),
        );
      case MrIconType.nearBy:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.pin_drop_rounded, size: s, color: const Color(0xFFE53935)),
        );
      case MrIconType.userGuide:
        return _IconSpec(
          bgColor: const Color(0xFFE1F5FE),
          builder: (s) => Icon(Icons.menu_book_rounded, size: s, color: const Color(0xFF0288D1)),
        );
      case MrIconType.notes:
        return _IconSpec(
          bgColor: const Color(0xFFFFF8E1),
          builder: (s) => Icon(Icons.note_alt_rounded, size: s, color: const Color(0xFFF59E0B)),
        );
      case MrIconType.distanceNearby:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.near_me_rounded, size: s, color: const Color(0xFF2E7D32)),
        );
      case MrIconType.calculator:
        return _IconSpec(
          bgColor: const Color(0xFFEDE7F6),
          builder: (s) => Icon(Icons.calculate_rounded, size: s, color: const Color(0xFF7E57C2)),
        );

      // ----------------- REPORTS ICONS -----------------
      case MrIconType.doctorReport:
        return _IconSpec(
          bgColor: const Color(0xFFE3F2FD),
          builder: (s) => Icon(Icons.medical_information_rounded, size: s, color: const Color(0xFF1E88E5)),
        );
      case MrIconType.chemistReport:
        return _IconSpec(
          bgColor: const Color(0xFFE0F7FA),
          builder: (s) => Icon(Icons.analytics_rounded, size: s, color: const Color(0xFF00ACC1)),
        );
      case MrIconType.otherReports:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.fact_check_rounded, size: s, color: const Color(0xFF43A047)),
        );
      case MrIconType.primarySales:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.show_chart_rounded, size: s, color: const Color(0xFF2E7D32)),
        );
      case MrIconType.secondaryReport:
        return _IconSpec(
          bgColor: const Color(0xFFE0F2F1),
          builder: (s) => Icon(Icons.pie_chart_rounded, size: s, color: const Color(0xFF00897B)),
        );
      case MrIconType.pobReport:
        return _IconSpec(
          bgColor: const Color(0xFFE3F2FD),
          builder: (s) => Icon(Icons.assignment_turned_in_rounded, size: s, color: const Color(0xFF1976D2)),
        );
      case MrIconType.missedCall:
        return _IconSpec(
          bgColor: const Color(0xFFFFEBEE),
          builder: (s) => Icon(Icons.warning_amber_rounded, size: s, color: const Color(0xFFE53935)),
        );
      case MrIconType.tourPlanReport:
        return _IconSpec(
          bgColor: const Color(0xFFE0F7FA),
          builder: (s) => Icon(Icons.map_rounded, size: s, color: const Color(0xFF0097A7)),
        );
      case MrIconType.attendanceReport:
        return _IconSpec(
          bgColor: const Color(0xFFE1F5FE),
          builder: (s) => Icon(Icons.how_to_reg_rounded, size: s, color: const Color(0xFF0288D1)),
        );
      case MrIconType.expensesReport:
        return _IconSpec(
          bgColor: const Color(0xFFEDE7F6),
          builder: (s) => Icon(Icons.calculate_rounded, size: s, color: const Color(0xFF5E35B1)),
        );
      case MrIconType.targetPerformance:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.trending_up_rounded, size: s, color: const Color(0xFF43A047)),
        );
      case MrIconType.doctorMatrix:
        return _IconSpec(
          bgColor: const Color(0xFFFFF3E0),
          builder: (s) => Icon(Icons.bar_chart_rounded, size: s, color: const Color(0xFFFB8C00)),
        );
      case MrIconType.chemistMatrix:
        return _IconSpec(
          bgColor: const Color(0xFFEDE7F6),
          builder: (s) => Icon(Icons.stacked_line_chart_rounded, size: s, color: const Color(0xFF7E57C2)),
        );
      case MrIconType.sampleReport:
        return _IconSpec(
          bgColor: const Color(0xFFF3E8FF),
          builder: (s) => Icon(Icons.inventory_2_rounded, size: s, color: const Color(0xFF9333EA)),
        );
      case MrIconType.orderHistory:
        return _IconSpec(
          bgColor: const Color(0xFFE0F2FE),
          builder: (s) => Icon(Icons.receipt_long_rounded, size: s, color: const Color(0xFF0288D1)),
        );
      case MrIconType.totalMatrix:
        return _IconSpec(
          bgColor: const Color(0xFFFFF1F2),
          builder: (s) => Icon(Icons.hub_rounded, size: s, color: const Color(0xFFE11D48)),
        );

      // ----------------- PROFILE ICONS -----------------
      case MrIconType.myProfile:
        return _IconSpec(
          bgColor: const Color(0xFFE1F5FE),
          builder: (s) => Icon(Icons.account_circle_rounded, size: s, color: const Color(0xFF039BE5)),
        );
      case MrIconType.notification:
        return _IconSpec(
          bgColor: const Color(0xFFFFEBEE),
          builder: (s) => Icon(Icons.mark_chat_unread_rounded, size: s, color: const Color(0xFFE53935)),
        );
      case MrIconType.announcement:
        return _IconSpec(
          bgColor: const Color(0xFFFFEBEE),
          builder: (s) => Icon(Icons.campaign_rounded, size: s, color: const Color(0xFFE53935)),
        );
      case MrIconType.mobileSettings:
        return _IconSpec(
          bgColor: const Color(0xFFE0F2FE),
          builder: (s) => Icon(Icons.sync_lock_rounded, size: s, color: const Color(0xFF0288D1)),
        );
      case MrIconType.appSettings:
        return _IconSpec(
          bgColor: const Color(0xFFF3E5F5),
          builder: (s) => Icon(Icons.tune_rounded, size: s, color: const Color(0xFF8E24AA)),
        );
      case MrIconType.security:
        return _IconSpec(
          bgColor: const Color(0xFFE8F5E9),
          builder: (s) => Icon(Icons.security_rounded, size: s, color: const Color(0xFF2E7D32)),
        );
      case MrIconType.helpSupport:
        return _IconSpec(
          bgColor: const Color(0xFFFFF3E0),
          builder: (s) => Icon(Icons.support_agent_rounded, size: s, color: const Color(0xFFFB8C00)),
        );
    }
  }
}

class _IconSpec {
  final Color bgColor;
  final Widget Function(double size) builder;

  const _IconSpec({
    required this.bgColor,
    required this.builder,
  });
}
