import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/locale_provider.dart';
import '../../widgets/mr_grid_card.dart';
import '../../widgets/mr_icon_badge.dart';

// Screens
import '../expenses/expense_home_screen.dart';
import '../targets/target_management_screen.dart';
import 'reports_detail_screens.dart';

class MrReportsTab extends StatelessWidget {
  const MrReportsTab({super.key});

  @override
  Widget build(BuildContext context) {
    final loc = context.watch<LocaleProvider>();

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
      children: [
        GridView.count(
          crossAxisCount: 3,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 14,
          crossAxisSpacing: 12,
          childAspectRatio: 0.88,
          children: [
            // 1. Doctor Report
            MrGridCard(
              title: loc.translate('rep_doctor_report'),
              iconType: MrIconType.doctorReport,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorReportScreen()));
              },
            ),
            // 2. Chemist Report
            MrGridCard(
              title: loc.translate('rep_chemist_report'),
              iconType: MrIconType.chemistReport,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ChemistReportScreen()));
              },
            ),
            // 3. Other Report (Hospital, Clinic, Stockists)
            MrGridCard(
              title: loc.translate('rep_other_reports'),
              iconType: MrIconType.otherReports,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const OtherInstitutionsReportScreen()));
              },
            ),
            // 4. Primary Sales Report (Product sales to clinic, Stockists invoice)
            MrGridCard(
              title: loc.translate('rep_primary_sales'),
              iconType: MrIconType.primarySales,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const PrimarySalesReportScreen()));
              },
            ),
            // 5. Sample Report
            MrGridCard(
              title: loc.translate('rep_sample_report'),
              iconType: MrIconType.sampleReport,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SampleReportScreen()));
              },
            ),
            // 6. Order History
            MrGridCard(
              title: loc.translate('rep_order_history'),
              iconType: MrIconType.orderHistory,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const OrderHistoryScreen()));
              },
            ),
            // 7. Attendance Report
            MrGridCard(
              title: loc.translate('rep_attendance_report'),
              iconType: MrIconType.attendanceReport,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AttendanceReportScreen()));
              },
            ),
            // 8. Expense Report
            MrGridCard(
              title: loc.translate('rep_expenses_report'),
              iconType: MrIconType.expensesReport,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ExpenseHomeScreen()));
              },
            ),
            // 9. Target Performance
            MrGridCard(
              title: loc.translate('rep_target_performance'),
              iconType: MrIconType.targetPerformance,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const TargetManagementScreen()));
              },
            ),
            // 10. Total Matrix (All metrics consolidated)
            MrGridCard(
              title: loc.translate('rep_total_matrix'),
              iconType: MrIconType.totalMatrix,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const TotalMatrixScreen()));
              },
            ),
          ],
        ),
      ],
    );
  }
}
