import 'package:flutter/material.dart';

class MrNotificationsSheet extends StatelessWidget {
  const MrNotificationsSheet({super.key});

  @override
  Widget build(BuildContext context) {
    final notifications = [
      {
        'title': 'CME Sponsorship Approved',
        'desc': 'Dr. Rajesh Sharma\'s National Cardiology Summit request has been approved by ZSM.',
        'time': '10 mins ago',
        'icon': Icons.verified_rounded,
        'color': const Color(0xFF10B981),
        'unread': true,
      },
      {
        'title': 'Trade Scheme Updated',
        'desc': 'New 10+2 bonus scheme launched for Lubrica-Forte & OsteoGuard for this quarter.',
        'time': '1 hour ago',
        'icon': Icons.discount_rounded,
        'color': const Color(0xFFE53935),
        'unread': true,
      },
      {
        'title': 'Monthly Target Achievement',
        'desc': 'Congratulations! You achieved 92% of your monthly secondary sales target.',
        'time': '3 hours ago',
        'icon': Icons.emoji_events_rounded,
        'color': const Color(0xFFFFA000),
        'unread': true,
      },
      {
        'title': 'HQ Tour Plan Circular',
        'desc': 'Please submit your tentative tour plan for next month by the 25th.',
        'time': 'Yesterday',
        'icon': Icons.map_rounded,
        'color': const Color(0xFF1976D2),
        'unread': true,
      },
    ];

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 44,
              height: 4.5,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFEBEE),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.notifications_active_rounded, color: Color(0xFFE53935), size: 22),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'Notifications',
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE53935),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          '4 New',
                          style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 6),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('All notifications marked as read.')),
                  );
                },
                child: const Text('Mark all read', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(height: 1),
          const SizedBox(height: 12),
          Flexible(
            child: ListView.separated(
              shrinkWrap: true,
              itemCount: notifications.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (ctx, idx) {
                final item = notifications[idx];
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: (item['color'] as Color).withValues(alpha: 0.15),
                        child: Icon(item['icon'] as IconData, color: item['color'] as Color, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    item['title'] as String,
                                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5, color: Color(0xFF0F172A)),
                                  ),
                                ),
                                Text(
                                  item['time'] as String,
                                  style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              item['desc'] as String,
                              style: const TextStyle(fontSize: 12, color: Color(0xFF475569), height: 1.25),
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
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
