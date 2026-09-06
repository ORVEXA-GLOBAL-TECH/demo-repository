import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/locale_provider.dart';
import '../../widgets/mr_grid_card.dart';
import '../../widgets/mr_icon_badge.dart';
import 'profile_screen.dart';
import 'announcements_screen.dart';
import 'mobile_settings_screen.dart';
import 'app_settings_screen.dart';
import 'security_screen.dart';
import 'help_support_screen.dart';

import 'notification_screen.dart';

class MrProfileTab extends StatelessWidget {
  const MrProfileTab({super.key});

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
            // 1. My Profile
            MrGridCard(
              title: loc.translate('prof_my_profile'),
              iconType: MrIconType.myProfile,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen()));
              },
            ),
            // 2. Notification
            MrGridCard(
              title: loc.translate('prof_notification'),
              iconType: MrIconType.notification,
              badgeCount: 4,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen()));
              },
            ),
            // 3. Announcement
            MrGridCard(
              title: loc.translate('prof_announcement'),
              iconType: MrIconType.announcement,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AnnouncementsScreen()));
              },
            ),
            // 4. Mobile Settings (Offline & Synchronization)
            MrGridCard(
              title: loc.translate('prof_mobile_settings'),
              iconType: MrIconType.mobileSettings,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const MobileSettingsScreen()));
              },
            ),
            // 5. App Settings
            MrGridCard(
              title: loc.translate('prof_app_settings'),
              iconType: MrIconType.appSettings,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AppSettingsScreen()));
              },
            ),
            // 6. Security
            MrGridCard(
              title: loc.translate('prof_security'),
              iconType: MrIconType.security,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SecurityScreen()));
              },
            ),
            // 7. Help & Support
            MrGridCard(
              title: loc.translate('prof_help_support'),
              iconType: MrIconType.helpSupport,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const HelpSupportScreen()));
              },
            ),
          ],
        ),
      ],
    );
  }
}
