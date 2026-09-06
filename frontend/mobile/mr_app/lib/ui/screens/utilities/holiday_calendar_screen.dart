import 'package:flutter/material.dart';

class HolidayCalendarScreen extends StatelessWidget {
  const HolidayCalendarScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> holidays = [
      {'name': 'International New Year', 'date': '01 Jan 2026', 'day': 'Thursday', 'type': 'National Holiday', 'color': const Color(0xFF0288D1)},
      {'name': 'Victory over Genocide Day', 'date': '07 Jan 2026', 'day': 'Wednesday', 'type': 'National Holiday', 'color': const Color(0xFF0288D1)},
      {'name': 'International Women\'s Day', 'date': '08 Mar 2026', 'day': 'Sunday', 'type': 'National Holiday', 'color': const Color(0xFF0288D1)},
      {'name': 'Khmer New Year (Choul Chnam Thmey)', 'date': '14-16 Apr 2026', 'day': 'Tue-Thu (3 Days)', 'type': 'Public Holiday', 'color': const Color(0xFFE53935)},
      {'name': 'King Norodom Sihamoni Birthday', 'date': '14 May 2026', 'day': 'Thursday', 'type': 'National Holiday', 'color': const Color(0xFF0288D1)},
      {'name': 'Visak Bochea Day (Buddha Day)', 'date': '20 May 2026', 'day': 'Wednesday', 'type': 'Religious Holiday', 'color': const Color(0xFFF59E0B)},
      {'name': 'Royal Ploughing Ceremony', 'date': '24 May 2026', 'day': 'Sunday', 'type': 'National Holiday', 'color': const Color(0xFF0288D1)},
      {'name': 'Pchum Ben Festival (Ancestors\' Day)', 'date': '09-11 Oct 2026', 'day': 'Fri-Sun (3 Days)', 'type': 'Public Holiday', 'color': const Color(0xFFE53935)},
      {'name': 'Commemoration Day of King\'s Father', 'date': '15 Oct 2026', 'day': 'Thursday', 'type': 'National Holiday', 'color': const Color(0xFF0288D1)},
      {'name': 'National Independence Day', 'date': '09 Nov 2026', 'day': 'Monday', 'type': 'National Holiday', 'color': const Color(0xFF10B981)},
      {'name': 'Water Festival (Bon Om Touk)', 'date': '23-25 Nov 2026', 'day': 'Mon-Wed (3 Days)', 'type': 'Public Holiday', 'color': const Color(0xFFE53935)},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Official Holiday Calendar 2026', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Upcoming Holiday Highlight Banner
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0B172E), Color(0xFF1E3A8A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(color: const Color(0xFF0B172E).withValues(alpha: 0.25), blurRadius: 12, offset: const Offset(0, 4)),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), shape: BoxShape.circle),
                  child: const Icon(Icons.celebration_rounded, color: Color(0xFFF59E0B), size: 28),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('NEXT UPCOMING HOLIDAY', style: TextStyle(color: Color(0xFF38BDF8), fontSize: 10.5, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                      SizedBox(height: 3),
                      Text('Pchum Ben Festival', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                      SizedBox(height: 2),
                      Text('09 - 11 Oct 2026 • 3 Days Holiday', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(10)),
                  child: const Text('APPROVED', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          const Text('All 2026 Public & National Holidays (Cambodia HQ)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
          const SizedBox(height: 10),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: holidays.length,
            separatorBuilder: (_, _) => const SizedBox(height: 10),
            itemBuilder: (ctx, idx) {
              final h = holidays[idx];
              final Color col = h['color'] as Color;

              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: col.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.calendar_today_rounded, color: col, size: 18),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(h['name'] as String, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5, color: Color(0xFF0F172A))),
                          const SizedBox(height: 3),
                          Text('${h['date']} • ${h['day']}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: col.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(h['type'] as String, style: TextStyle(color: col, fontSize: 9.5, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
