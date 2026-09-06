import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class TelegramFloatingButton extends StatelessWidget {
  final String telegramUsername; // e.g. 'alleviare_support' or 'mrconnect'

  const TelegramFloatingButton({
    super.key,
    this.telegramUsername = 'alleviare_pharma_support',
  });

  Future<void> _launchTelegram(BuildContext context) async {
    // 1. Primary Direct Telegram Web/App Link
    final telegramUri = Uri.parse('https://t.me/$telegramUsername');
    final telegramAppUri = Uri.parse('tg://resolve?domain=$telegramUsername');

    try {
      if (await canLaunchUrl(telegramAppUri)) {
        await launchUrl(telegramAppUri, mode: LaunchMode.externalApplication);
        return;
      }
      if (await canLaunchUrl(telegramUri)) {
        await launchUrl(telegramUri, mode: LaunchMode.externalApplication);
        return;
      }
    } catch (_) {
      // Fallback to options sheet
    }

    if (context.mounted) {
      _showTelegramStoreSheet(context);
    }
  }

  void _showTelegramStoreSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(22),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: const BoxDecoration(
                    color: Color(0xFF229ED9),
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Icon(Icons.send_rounded, color: Colors.white, size: 26),
                  ),
                ),
                const SizedBox(width: 14),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Connect on Telegram',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17, color: Color(0xFF0F172A)),
                    ),
                    Text(
                      'Official Field Support & Announcements',
                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            // Open Telegram Web / Direct Chat
            ListTile(
              leading: const CircleAvatar(
                backgroundColor: Color(0xFFE1F5FE),
                child: Icon(Icons.open_in_browser_rounded, color: Color(0xFF0288D1)),
              ),
              title: const Text('Open in Telegram / Browser', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              subtitle: const Text('https://t.me/alleviare_pharma_support', style: TextStyle(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right_rounded),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              tileColor: const Color(0xFFF8FAFC),
              onTap: () async {
                Navigator.pop(ctx);
                final uri = Uri.parse('https://t.me/$telegramUsername');
                await launchUrl(uri, mode: LaunchMode.externalApplication);
              },
            ),
            const SizedBox(height: 10),
            // Download from Google Play Store
            ListTile(
              leading: const CircleAvatar(
                backgroundColor: Color(0xFFE8F5E9),
                child: Icon(Icons.android_rounded, color: Color(0xFF2E7D32)),
              ),
              title: const Text('Get Telegram on Google Play', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              subtitle: const Text('For Android mobile devices', style: TextStyle(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right_rounded),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              tileColor: const Color(0xFFF8FAFC),
              onTap: () async {
                Navigator.pop(ctx);
                final playStoreUri = Uri.parse('https://play.google.com/store/apps/details?id=org.telegram.messenger');
                await launchUrl(playStoreUri, mode: LaunchMode.externalApplication);
              },
            ),
            const SizedBox(height: 10),
            // Download from Apple App Store
            ListTile(
              leading: const CircleAvatar(
                backgroundColor: Color(0xFFF3E5F5),
                child: Icon(Icons.apple_rounded, color: Color(0xFF7B1FA2)),
              ),
              title: const Text('Get Telegram on App Store', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              subtitle: const Text('For iPhone / iPad iOS devices', style: TextStyle(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right_rounded),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              tileColor: const Color(0xFFF8FAFC),
              onTap: () async {
                Navigator.pop(ctx);
                final appStoreUri = Uri.parse('https://apps.apple.com/app/telegram-messenger/id686449807');
                await launchUrl(appStoreUri, mode: LaunchMode.externalApplication);
              },
            ),
            const SizedBox(height: 14),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF229ED9).withValues(alpha: 0.5),
            blurRadius: 16,
            spreadRadius: 2,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _launchTelegram(context),
          borderRadius: BorderRadius.circular(30),
          child: Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [
                  Color(0xFF2AABEE),
                  Color(0xFF229ED9),
                  Color(0xFF1E88E5),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2.2),
            ),
            child: Center(
              child: CustomPaint(
                size: const Size(28, 28),
                painter: _TelegramPaperPlanePainter(),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Precise Telegram Paper Plane Vector Painter
class _TelegramPaperPlanePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    final paintWhite = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final paintShadow = Paint()
      ..color = const Color(0xFFB0BEC5).withValues(alpha: 0.6)
      ..style = PaintingStyle.fill;

    // Main paper plane body
    final bodyPath = Path();
    bodyPath.moveTo(w * 0.92, h * 0.12);
    bodyPath.lineTo(w * 0.12, h * 0.50);
    bodyPath.lineTo(w * 0.38, h * 0.62);
    bodyPath.lineTo(w * 0.78, h * 0.32);
    bodyPath.lineTo(w * 0.44, h * 0.66);
    bodyPath.lineTo(w * 0.42, h * 0.88);
    bodyPath.lineTo(w * 0.58, h * 0.74);
    bodyPath.lineTo(w * 0.76, h * 0.86);
    bodyPath.close();

    canvas.drawPath(bodyPath, paintWhite);

    // Inner fold shade
    final shadePath = Path();
    shadePath.moveTo(w * 0.44, h * 0.66);
    shadePath.lineTo(w * 0.42, h * 0.88);
    shadePath.lineTo(w * 0.52, h * 0.70);
    shadePath.close();

    canvas.drawPath(shadePath, paintShadow);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
