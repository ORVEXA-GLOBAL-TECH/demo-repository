import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/locale_provider.dart';
import '../../widgets/mr_grid_card.dart';
import '../../widgets/mr_icon_badge.dart';

// Screens
import 'field_notes_screen.dart';
import 'holiday_calendar_screen.dart';
import '../leave/leave_home_screen.dart';
import 'distance_nearby_screen.dart';
import 'pharma_calculator_screen.dart';
import 'app_user_guide_screen.dart';

class MrUtilitiesTab extends StatelessWidget {
  const MrUtilitiesTab({super.key});

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
            // 1. Notes
            MrGridCard(
              title: loc.translate('util_notes'),
              iconType: MrIconType.notes,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const FieldNotesScreen()));
              },
            ),
            // 2. Holidays
            MrGridCard(
              title: loc.translate('util_holiday'),
              iconType: MrIconType.holiday,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const HolidayCalendarScreen()));
              },
            ),
            // 3. Apply Leave
            MrGridCard(
              title: loc.translate('util_apply_leave'),
              iconType: MrIconType.applyLeave,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const LeaveHomeScreen()));
              },
            ),
            // 4. Check Distance / Nearby
            MrGridCard(
              title: loc.translate('util_check_distance_nearby'),
              iconType: MrIconType.distanceNearby,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const DistanceNearbyScreen()));
              },
            ),
            // 5. Calculator
            MrGridCard(
              title: loc.translate('util_calculator'),
              iconType: MrIconType.calculator,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const PharmaCalculatorScreen()));
              },
            ),
            // 6. User Guide
            MrGridCard(
              title: loc.translate('util_user_guide'),
              iconType: MrIconType.userGuide,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AppUserGuideScreen()));
              },
            ),
          ],
        ),
      ],
    );
  }
}
