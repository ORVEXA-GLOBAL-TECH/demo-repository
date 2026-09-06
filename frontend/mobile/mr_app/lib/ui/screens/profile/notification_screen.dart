import 'package:flutter/material.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  final List<Map<String, dynamic>> _notifications = [
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
    {
      'title': 'Sample Stock Dispatched',
      'desc': '50 packs of CardioVasc-AM and 30 packs of Lubrica-Forte dispatched from Central Depot.',
      'time': '2 days ago',
      'icon': Icons.local_shipping_rounded,
      'color': const Color(0xFF8E24AA),
      'unread': false,
    },
    {
      'title': 'DCR Submission Verified',
      'desc': 'Your Daily Call Report for yesterday (12 calls) has been verified and logged.',
      'time': '2 days ago',
      'icon': Icons.assignment_turned_in_rounded,
      'color': const Color(0xFF00897B),
      'unread': false,
    },
  ];

  void _markAllAsRead() {
    setState(() {
      for (var item in _notifications) {
        item['unread'] = false;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('All notifications marked as read!'), backgroundColor: Color(0xFF10B981)),
    );
  }

  void _clearAll() {
    setState(() {
      _notifications.clear();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('All notifications cleared.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final unreadCount = _notifications.where((n) => n['unread'] == true).length;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (_notifications.isNotEmpty) ...[
            TextButton(
              onPressed: _markAllAsRead,
              child: const Text('Mark all read', style: TextStyle(color: Color(0xFF38BDF8), fontSize: 12.5, fontWeight: FontWeight.bold)),
            ),
            IconButton(
              icon: const Icon(Icons.delete_sweep_outlined, color: Colors.white70),
              tooltip: 'Clear All',
              onPressed: _clearAll,
            ),
          ],
        ],
      ),
      body: _notifications.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(color: const Color(0xFFE0F2FE), shape: BoxShape.circle),
                    child: const Icon(Icons.notifications_off_rounded, color: Color(0xFF0288D1), size: 48),
                  ),
                  const SizedBox(height: 16),
                  const Text('No Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  const Text('You\'re all caught up with your field updates!', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                ],
              ),
            )
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (unreadCount > 0)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3.5),
                          decoration: BoxDecoration(color: const Color(0xFFE53935), borderRadius: BorderRadius.circular(12)),
                          child: Text('$unreadCount NEW', style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(width: 8),
                        const Expanded(
                          child: Text(
                            'Recent Alerts & Management Updates',
                            style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _notifications.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 10),
                  itemBuilder: (ctx, idx) {
                    final n = _notifications[idx];
                    final isUnread = n['unread'] == true;

                    return InkWell(
                      onTap: () {
                        setState(() {
                          n['unread'] = false;
                        });
                      },
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isUnread ? Colors.white : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: isUnread ? const Color(0xFFBAE6FD) : const Color(0xFFE2E8F0), width: isUnread ? 1.5 : 1),
                          boxShadow: isUnread
                              ? [BoxShadow(color: const Color(0xFF0288D1).withValues(alpha: 0.08), blurRadius: 8, offset: const Offset(0, 3))]
                              : null,
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: (n['color'] as Color).withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(n['icon'] as IconData, color: n['color'] as Color, size: 20),
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
                                          n['title'] as String,
                                          style: TextStyle(
                                            fontWeight: isUnread ? FontWeight.w800 : FontWeight.w600,
                                            fontSize: 13.5,
                                            color: const Color(0xFF0F172A),
                                          ),
                                        ),
                                      ),
                                      Text(
                                        n['time'] as String,
                                        style: TextStyle(fontSize: 10.5, color: isUnread ? const Color(0xFF0288D1) : const Color(0xFF94A3B8), fontWeight: isUnread ? FontWeight.bold : FontWeight.normal),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    n['desc'] as String,
                                    style: const TextStyle(fontSize: 12, color: Color(0xFF475569), height: 1.3),
                                  ),
                                ],
                              ),
                            ),
                            if (isUnread) ...[
                              const SizedBox(width: 6),
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(color: Color(0xFFE53935), shape: BoxShape.circle),
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
    );
  }
}
