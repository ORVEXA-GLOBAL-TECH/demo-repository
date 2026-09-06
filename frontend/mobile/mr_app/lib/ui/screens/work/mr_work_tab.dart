import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/locale_provider.dart';
import '../../widgets/mr_grid_card.dart';
import '../../widgets/mr_icon_badge.dart';

// Screens
import '../dcr/dcr_home_screen.dart';
import '../tour_plan/tour_plan_screen.dart';
import '../expenses/expense_home_screen.dart';
import '../pob/pob_catalog_screen.dart';
import '../sales/sales_home_screen.dart';
import '../rcpa/rcpa_home_screen.dart';
import '../edetailing/edetailing_catalog_screen.dart';
import '../inventory/sample_inventory_screen.dart';
import '../master_directory/directory_home_screen.dart';
import '../returns/return_management_screen.dart';
import 'work_detail_screens.dart';

class MrWorkTab extends StatelessWidget {
  const MrWorkTab({super.key});

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
            // 1. Reporting
            MrGridCard(
              title: loc.translate('work_reporting'),
              iconType: MrIconType.reporting,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const DcrHomeScreen()));
              },
            ),
            // 2. Tour Plan
            MrGridCard(
              title: loc.translate('work_tour_plan'),
              iconType: MrIconType.tourPlan,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const TourPlanScreen()));
              },
            ),
            // 3. Expenditure
            MrGridCard(
              title: loc.translate('work_expenditure'),
              iconType: MrIconType.expenditure,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ExpenseHomeScreen()));
              },
            ),
            // 4. POB
            MrGridCard(
              title: loc.translate('work_pob'),
              iconType: MrIconType.pob,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const PobCatalogScreen()));
              },
            ),
            // 5. Secondary Sales
            MrGridCard(
              title: loc.translate('work_secondary_sales'),
              iconType: MrIconType.secondarySales,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SalesHomeScreen()));
              },
            ),
            // 6. RCPA
            MrGridCard(
              title: loc.translate('work_rcpa'),
              iconType: MrIconType.rcpa,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const RcpaHomeScreen()));
              },
            ),

            // 8. Scheme
            MrGridCard(
              title: loc.translate('work_scheme'),
              iconType: MrIconType.scheme,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const TradeSchemesScreen()));
              },
            ),
            // 9. E-detailing
            MrGridCard(
              title: loc.translate('work_e_detailing'),
              iconType: MrIconType.eDetailing,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const EdetailingCatalogScreen()));
              },
            ),
            // 10. Video Library
            MrGridCard(
              title: loc.translate('work_video_library'),
              iconType: MrIconType.videoLibrary,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const VideoLibraryScreen()));
              },
            ),
            // 11. Products
            MrGridCard(
              title: loc.translate('work_products'),
              iconType: MrIconType.products,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SampleInventoryScreen()));
              },
            ),
            // 12. Returns (Return Management)
            MrGridCard(
              title: loc.translate('work_returns'),
              iconType: MrIconType.returnManagement,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ReturnManagementScreen()));
              },
            ),
            // 13. Manage
            MrGridCard(
              title: loc.translate('work_manage'),
              iconType: MrIconType.manage,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const DirectoryHomeScreen()));
              },
            ),
          ],
        ),
      ],
    );
  }
}
