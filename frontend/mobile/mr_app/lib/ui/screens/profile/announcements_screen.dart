import 'package:flutter/material.dart';

class AnnouncementsScreen extends StatelessWidget {
  const AnnouncementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final announcements = [
      {
        'title': 'New Product Launch: Lubrica-Forte Plus',
        'desc': 'We are thrilled to announce the pan-India launch of Lubrica-Forte Plus with enhanced absorption formula. Sample kits are being dispatched to your respective HQs.',
        'date': '20 Aug 2026',
        'author': 'Marketing & Brand Strategy Team',
        'badge': 'New Launch',
        'color': const Color(0xFFE53935),
      },
      {
        'title': 'Annual National Sales Conference 2026',
        'desc': 'The Annual Sales Meet will be hosted in Goa from Oct 12 - 15. Qualifying representatives will receive invitations along with flight details by next week.',
        'date': '14 Aug 2026',
        'author': 'Vice President - Sales & Distribution',
        'badge': 'Event',
        'color': const Color(0xFF1E88E5),
      },
      {
        'title': 'Quarterly Incentive Booster Program',
        'desc': 'Earn up to 25% extra bonus on exceeding POB and secondary targets for Q3. Check the schemes section for detailed payout slab criteria.',
        'date': '01 Aug 2026',
        'author': 'Commercial Finance Division',
        'badge': 'Incentive',
        'color': const Color(0xFF10B981),
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Company Announcements', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: announcements.length,
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        itemBuilder: (ctx, idx) {
          final a = announcements[idx];
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 3))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                      decoration: BoxDecoration(
                        color: (a['color'] as Color).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        a['badge'] as String,
                        style: TextStyle(color: a['color'] as Color, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                    Text(a['date'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                  ],
                ),
                const SizedBox(height: 8),
                Text(a['title'] as String, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                Text(a['desc'] as String, style: const TextStyle(fontSize: 12.5, color: Color(0xFF475569), height: 1.35)),
                const Divider(height: 16),
                Row(
                  children: [
                    const Icon(Icons.campaign_outlined, size: 16, color: Color(0xFF64748B)),
                    const SizedBox(width: 6),
                    Text(a['author'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
