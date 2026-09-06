import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/currency_provider.dart';

// ==========================================
// 1. DOCTOR SPONSORSHIP & CME SCREEN
// ==========================================
class DoctorSponsorshipScreen extends StatefulWidget {
  const DoctorSponsorshipScreen({super.key});

  @override
  State<DoctorSponsorshipScreen> createState() => _DoctorSponsorshipScreenState();
}

class _DoctorSponsorshipScreenState extends State<DoctorSponsorshipScreen> {
  final List<Map<String, dynamic>> _requests = [
    {
      'doctor': 'Dr. Rajesh Sharma',
      'specialty': 'Cardiologist • Calmette Hospital',
      'event': 'Annual Cardiology Summit 2026',
      'amountUsd': 550.0,
      'status': 'Approved',
      'statusColor': const Color(0xFF10B981),
      'date': '15 Mar 2026',
    },
    {
      'doctor': 'Dr. Priya Nair',
      'specialty': 'Diabetologist • Royal Phnom Penh Multi-Specialty Hospital',
      'event': 'Cambodia Diabetology CME & Clinical Workshop',
      'amountUsd': 340.0,
      'status': 'Under ASM Review',
      'statusColor': const Color(0xFFF59E0B),
      'date': '28 Mar 2026',
    },
    {
      'doctor': 'Dr. Sokha Meas',
      'specialty': 'Orthopedic Surgeon • Calmette Hospital',
      'event': 'Joint Care & Bone Health Summit',
      'amountUsd': 180.0,
      'status': 'Draft',
      'statusColor': const Color(0xFF64748B),
      'date': '04 Apr 2026',
    },
  ];

  void _showNewRequestDialog() {
    final docCtrl = TextEditingController(text: 'Dr. Rajesh Sharma');
    final eventCtrl = TextEditingController(text: 'National Cardiology Conclave Phnom Penh');
    final amtCtrl = TextEditingController(text: '450');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.workspace_premium_rounded, color: Color(0xFF1E88E5)),
            SizedBox(width: 8),
            Text('New Sponsorship Request', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: docCtrl,
              decoration: const InputDecoration(labelText: 'Doctor Name & Clinic', prefixIcon: Icon(Icons.person)),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: eventCtrl,
              decoration: const InputDecoration(labelText: 'Event / CME Title', prefixIcon: Icon(Icons.event)),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: amtCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Budget Requested (\$ USD)', prefixIcon: Icon(Icons.attach_money_rounded)),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E88E5), foregroundColor: Colors.white),
            onPressed: () {
              setState(() {
                _requests.insert(0, {
                  'doctor': docCtrl.text,
                  'specialty': 'Physician • General Clinic',
                  'event': eventCtrl.text,
                  'amountUsd': double.tryParse(amtCtrl.text) ?? 300.0,
                  'status': 'Pending Approval',
                  'statusColor': const Color(0xFFF59E0B),
                  'date': 'Today',
                });
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Sponsorship request submitted to ASM!'), backgroundColor: Color(0xFF10B981)),
              );
            },
            child: const Text('Submit Request'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currency = context.watch<CurrencyProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Doctor Sponsorship & CME', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showNewRequestDialog,
        backgroundColor: const Color(0xFF1E88E5),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('New Request', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _requests.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (ctx, idx) {
          final req = _requests[idx];
          final formattedAmount = currency.format(req['amountUsd'] as double);

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
                    Expanded(
                      child: Text(req['doctor'] as String, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: (req['statusColor'] as Color).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        req['status'] as String,
                        style: TextStyle(color: req['statusColor'] as Color, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(req['specialty'] as String, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                const Divider(height: 16),
                Row(
                  children: [
                    const Icon(Icons.event_note_rounded, size: 16, color: Color(0xFF1E88E5)),
                    const SizedBox(width: 6),
                    Expanded(child: Text(req['event'] as String, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600))),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Budget: $formattedAmount', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF10B981))),
                    Text('Date: ${req['date']}', style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
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

// ==========================================
// 2. TRADE SCHEMES & OFFERS SCREEN
// ==========================================
class TradeSchemesScreen extends StatelessWidget {
  const TradeSchemesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final schemes = [
      {
        'brand': 'Lubrica-Forte Tablet',
        'scheme': '10 + 2 FREE + 5% Cash Discount',
        'validity': 'Valid till 31st March 2026',
        'minQty': 'Min Order: 50 Strips',
        'badge': 'Mega Scheme',
        'color': const Color(0xFFE53935),
      },
      {
        'brand': 'OsteoGuard-D3 Softgels',
        'scheme': '15 + 3 FREE',
        'validity': 'Valid till 15th April 2026',
        'minQty': 'Min Order: 30 Bottles',
        'badge': 'Bonus Offer',
        'color': const Color(0xFFFB8C00),
      },
      {
        'brand': 'CardioVas-20 Tablets',
        'scheme': 'Flat 8% Special Trade Margin',
        'validity': 'Valid till 30th April 2026',
        'minQty': 'Min Order: 100 Strips',
        'badge': 'Margin Booster',
        'color': const Color(0xFF10B981),
      },
      {
        'brand': 'NeuroCalm Plus Capsules',
        'scheme': '20 + 5 FREE + 1 Free Gift Hamper',
        'validity': 'Valid till 31st March 2026',
        'minQty': 'Min Order: 40 Packs',
        'badge': 'Quarterly Special',
        'color': const Color(0xFF8E24AA),
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
        title: const Text('Trade Schemes & Offers', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: schemes.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (ctx, idx) {
          final item = schemes[idx];
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
                    Expanded(
                      child: Text(item['brand'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                      decoration: BoxDecoration(
                        color: (item['color'] as Color).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        item['badge'] as String,
                        style: TextStyle(color: item['color'] as Color, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFEEF2F6)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.stars_rounded, color: Color(0xFFE53935), size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          item['scheme'] as String,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE53935)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(item['minQty'] as String, style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                    Text(item['validity'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w500)),
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

// ==========================================
// 3. VIDEO LIBRARY SCREEN
// ==========================================
class VideoLibraryScreen extends StatelessWidget {
  const VideoLibraryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final videos = [
      {
        'title': 'Lubrica-Forte: Mechanism of Action in Cartilage Repair',
        'duration': '3:45 mins',
        'category': 'Orthopedics',
        'views': '1,240 plays',
      },
      {
        'title': 'CardioVas-20: Clinical Efficacy & Safety Trials',
        'duration': '4:12 mins',
        'category': 'Cardiology',
        'views': '980 plays',
      },
      {
        'title': 'OsteoGuard-D3: Faster Bioavailability Technology',
        'duration': '2:30 mins',
        'category': 'Bone Health',
        'views': '1,560 plays',
      },
      {
        'title': 'Product Detailing Pitch: Handling Doctor Objections',
        'duration': '6:15 mins',
        'category': 'MR Training',
        'views': '2,100 plays',
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
        title: const Text('Clinical Video Library', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: videos.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (ctx, idx) {
          final vid = videos[idx];
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 3))],
            ),
            child: Row(
              children: [
                Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 76,
                      height: 76,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFE91E63), Color(0xFFFF4081)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    const Icon(Icons.play_circle_fill_rounded, color: Colors.white, size: 34),
                  ],
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFCE4EC),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          vid['category'] as String,
                          style: const TextStyle(color: Color(0xFFE91E63), fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        vid['title'] as String,
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF0F172A)),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(Icons.timer_outlined, size: 13, color: Color(0xFF64748B)),
                          const SizedBox(width: 4),
                          Text(vid['duration'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          const SizedBox(width: 10),
                          const Icon(Icons.visibility_outlined, size: 13, color: Color(0xFF64748B)),
                          const SizedBox(width: 4),
                          Text(vid['views'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
