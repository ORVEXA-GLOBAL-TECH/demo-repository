import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/currency_provider.dart';

// ==========================================
// 1. TO-DO & ACTION ITEMS SCREEN
// ==========================================
class MrTasksTodoScreen extends StatefulWidget {
  const MrTasksTodoScreen({super.key});

  @override
  State<MrTasksTodoScreen> createState() => _MrTasksTodoScreenState();
}

class _MrTasksTodoScreenState extends State<MrTasksTodoScreen> {
  final List<Map<String, dynamic>> _tasks = [
    {
      'title': 'Collect Secondary Sales statement from Sai Chemist',
      'priority': 'High Priority',
      'color': const Color(0xFFE53935),
      'done': false,
      'time': 'By 2:00 PM',
    },
    {
      'title': 'Deliver Lubrica-Forte clinical samples to Dr. Rajesh Sharma',
      'priority': 'Medium',
      'color': const Color(0xFFFB8C00),
      'done': true,
      'time': 'Completed at 11:30 AM',
    },
    {
      'title': 'Submit pending DCR for yesterday',
      'priority': 'Urgent',
      'color': const Color(0xFFE53935),
      'done': false,
      'time': 'By 6:00 PM',
    },
    {
      'title': 'Check POB delivery status at Apollo Medicos',
      'priority': 'Normal',
      'color': const Color(0xFF10B981),
      'done': false,
      'time': 'By 4:30 PM',
    },
  ];

  void _showAddTask() {
    final ctrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Text('Add MR To-Do Task', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: TextField(
          controller: ctrl,
          decoration: const InputDecoration(hintText: 'Enter task description...'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (ctrl.text.isNotEmpty) {
                setState(() {
                  _tasks.add({
                    'title': ctrl.text,
                    'priority': 'Normal',
                    'color': const Color(0xFF1E88E5),
                    'done': false,
                    'time': 'Today',
                  });
                });
              }
              Navigator.pop(ctx);
            },
            child: const Text('Add Task'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('MR To-Do & Tasks', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddTask,
        backgroundColor: const Color(0xFFF4511E),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Task', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _tasks.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (ctx, idx) {
          final t = _tasks[idx];
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                Checkbox(
                  value: t['done'] as bool,
                  activeColor: const Color(0xFF10B981),
                  onChanged: (val) {
                    setState(() {
                      t['done'] = val ?? false;
                    });
                  },
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        t['title'] as String,
                        style: TextStyle(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w600,
                          decoration: (t['done'] as bool) ? TextDecoration.lineThrough : null,
                          color: (t['done'] as bool) ? const Color(0xFF94A3B8) : const Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: (t['color'] as Color).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              t['priority'] as String,
                              style: TextStyle(color: t['color'] as Color, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(t['time'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
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

// ==========================================
// 2. HOLIDAY CALENDAR SCREEN
// ==========================================
class HolidayCalendarScreen extends StatelessWidget {
  const HolidayCalendarScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final holidays = [
      {'name': 'International New Year', 'date': '01 Jan 2026', 'day': 'Thursday', 'type': 'National Holiday'},
      {'name': 'Victory over Genocide Day', 'date': '07 Jan 2026', 'day': 'Wednesday', 'type': 'National Holiday'},
      {'name': 'International Women\'s Day', 'date': '08 Mar 2026', 'day': 'Sunday', 'type': 'National Holiday'},
      {'name': 'Khmer New Year (Choul Chnam Thmey)', 'date': '14-16 Apr 2026', 'day': 'Tue-Thu', 'type': 'Public Holiday'},
      {'name': 'King Norodom Sihamoni Birthday', 'date': '14 May 2026', 'day': 'Thursday', 'type': 'National Holiday'},
      {'name': 'Pchum Ben Festival', 'date': '09-11 Oct 2026', 'day': 'Fri-Sun', 'type': 'Public Holiday'},
      {'name': 'Water Festival (Bon Om Touk)', 'date': '23-25 Nov 2026', 'day': 'Mon-Wed', 'type': 'Public Holiday'},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Official Holiday Calendar 2026', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: holidays.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (ctx, idx) {
          final h = holidays[idx];
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
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFEBEE),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.calendar_month_rounded, color: Color(0xFFE53935), size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(h['name']!, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: Color(0xFF0F172A))),
                      const SizedBox(height: 2),
                      Text('${h['date']} • ${h['day']}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE8F5E9),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(h['type']!, style: const TextStyle(color: Color(0xFF2E7D32), fontSize: 10.5, fontWeight: FontWeight.bold)),
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
// 3. SALARY SLIPS SCREEN (Dual Currency USD & KHR)
// ==========================================
class SalarySlipsScreen extends StatelessWidget {
  const SalarySlipsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final currency = context.watch<CurrencyProvider>();

    final slips = [
      {'month': 'July 2026', 'netUsd': 720.0, 'basicUsd': 500.0, 'allowanceUsd': 150.0, 'taDaUsd': 70.0, 'status': 'Paid'},
      {'month': 'June 2026', 'netUsd': 690.0, 'basicUsd': 500.0, 'allowanceUsd': 120.0, 'taDaUsd': 70.0, 'status': 'Paid'},
      {'month': 'May 2026', 'netUsd': 740.0, 'basicUsd': 500.0, 'allowanceUsd': 170.0, 'taDaUsd': 70.0, 'status': 'Paid'},
      {'month': 'April 2026', 'netUsd': 680.0, 'basicUsd': 500.0, 'allowanceUsd': 110.0, 'taDaUsd': 70.0, 'status': 'Paid'},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Salary Slips & Payslips', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: slips.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (ctx, idx) {
          final s = slips[idx];
          final netAmount = currency.format(s['netUsd'] as double);

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
                    Text(s['month'] as String, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: Color(0xFF0F172A))),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFFE8F5E9), borderRadius: BorderRadius.circular(10)),
                      child: Text(s['status'] as String, style: const TextStyle(color: Color(0xFF2E7D32), fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Net Salary Credited', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                        Text(netAmount, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF10B981))),
                      ],
                    ),
                    OutlinedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Downloading Payslip PDF for ${s['month']}...'), backgroundColor: const Color(0xFF1E88E5)),
                        );
                      },
                      icon: const Icon(Icons.download_rounded, size: 16),
                      label: const Text('Download PDF'),
                    ),
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
// 4. DOCUMENTS & SOPs SCREEN
// ==========================================
class CompanyDocumentsScreen extends StatelessWidget {
  const CompanyDocumentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final docs = [
      {'name': 'Comprehensive Product Price List (Q3 2026)', 'size': '2.4 MB', 'date': '01 Aug 2026', 'type': 'PDF'},
      {'name': 'Standard Operating Procedure (SOP) for MR Reporting', 'size': '1.8 MB', 'date': '15 Jul 2026', 'type': 'PDF'},
      {'name': 'Travel Allowance (TA/DA) & Reimbursement Policy', 'size': '950 KB', 'date': '10 Jun 2026', 'type': 'DOC'},
      {'name': 'Clinical Study Dossier - Lubrica-Forte Joint Mobility', 'size': '4.1 MB', 'date': '20 May 2026', 'type': 'PDF'},
      {'name': 'Sample Distribution & Inventory Protocol', 'size': '1.2 MB', 'date': '05 Apr 2026', 'type': 'PDF'},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Documents, Circulars & SOPs', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: docs.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (ctx, idx) {
          final d = docs[idx];
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
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE3F2FD),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFF1976D2), size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(d['name']!, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5, color: Color(0xFF0F172A))),
                      const SizedBox(height: 3),
                      Text('${d['size']} • Updated ${d['date']}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.file_download_outlined, color: Color(0xFF1976D2)),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Downloading ${d['name']}...'), backgroundColor: const Color(0xFF1E88E5)),
                    );
                  },
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
// 5. DISTANCE CHECKER SCREEN (Dual Currency)
// ==========================================
class DistanceCheckerScreen extends StatefulWidget {
  const DistanceCheckerScreen({super.key});

  @override
  State<DistanceCheckerScreen> createState() => _DistanceCheckerScreenState();
}

class _DistanceCheckerScreenState extends State<DistanceCheckerScreen> {
  String fromLoc = 'Phnom Penh Central HQ (Monivong Blvd)';
  String toLoc = 'Royal Phnom Penh Multi-Specialty Hospital';
  double calculatedDistance = 14.8;
  double travelFareUsd = 14.8 * 0.25; // $0.25 per km

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
        title: const Text('Distance Checker & TA Calculator', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  TextField(
                    decoration: const InputDecoration(
                      labelText: 'From Location / Clinic / HQ',
                      prefixIcon: Icon(Icons.radio_button_checked, color: Color(0xFF10B981)),
                    ),
                    controller: TextEditingController(text: fromLoc),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    decoration: const InputDecoration(
                      labelText: 'To Destination / Stockist / Doctor',
                      prefixIcon: Icon(Icons.location_on, color: Color(0xFFE53935)),
                    ),
                    controller: TextEditingController(text: toLoc),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E88E5),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 46),
                    ),
                    onPressed: () {
                      setState(() {
                        calculatedDistance = 16.2;
                        travelFareUsd = 16.2 * 0.25;
                      });
                    },
                    icon: const Icon(Icons.route_rounded),
                    label: const Text('Calculate Route Distance'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0B172E), Color(0xFF1B3B6F)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      const Text('Total GPS Distance', style: TextStyle(color: Colors.white70, fontSize: 12)),
                      const SizedBox(height: 4),
                      Text('${calculatedDistance.toStringAsFixed(1)} KM', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Container(width: 1, height: 40, color: Colors.white24),
                  Column(
                    children: [
                      const Text('Eligible TA Claim', style: TextStyle(color: Colors.white70, fontSize: 12)),
                      const SizedBox(height: 4),
                      Text(currency.format(travelFareUsd), style: const TextStyle(color: Color(0xFF10B981), fontSize: 20, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 6. NEARBY DOCTORS & CHEMISTS SCREEN
// ==========================================
class NearbyDoctorsScreen extends StatelessWidget {
  const NearbyDoctorsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> nearby = [
      {'name': 'Dr. Rajesh Sharma', 'type': 'Doctor • Cardio', 'dist': '0.4 km away', 'status': 'Available Now', 'color': const Color(0xFF10B981)},
      {'name': 'Sai Medicos & Pharmacy', 'type': 'Chemist / Retailer', 'dist': '0.7 km away', 'status': 'Open', 'color': const Color(0xFF10B981)},
      {'name': 'Dr. Priya Nair', 'type': 'Doctor • Ortho', 'dist': '1.2 km away', 'status': 'Clinic starts 4 PM', 'color': const Color(0xFFFB8C00)},
      {'name': 'Apollo Pharmacy Depot', 'type': 'Stockist / Wholesaler', 'dist': '1.8 km away', 'status': 'Open', 'color': const Color(0xFF10B981)},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Near By Doctors & Chemists', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: nearby.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (ctx, idx) {
          final n = nearby[idx];
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: const Color(0xFFE8F5E9),
                  child: const Icon(Icons.pin_drop_rounded, color: Color(0xFFE53935), size: 22),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(n['name'] as String, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: Color(0xFF0F172A))),
                      const SizedBox(height: 2),
                      Text('${n['type']} • ${n['dist']}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: (n['color'] as Color).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(n['status'] as String, style: TextStyle(color: n['color'] as Color, fontSize: 10.5, fontWeight: FontWeight.bold)),
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
// 7. USER GUIDE SCREEN
// ==========================================
class UserGuideScreen extends StatelessWidget {
  const UserGuideScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final guides = [
      {'title': 'How to punch in & record daily doctor call (DCR)', 'icon': Icons.assignment_turned_in_rounded},
      {'title': 'Submitting Product Order Booking (POB) to Stockists', 'icon': Icons.shopping_bag_rounded},
      {'title': 'Retail Chemist Prescription Audit (RCPA) workflow', 'icon': Icons.receipt_long_rounded},
      {'title': 'Applying for Expense Reimbursement & Bills upload', 'icon': Icons.receipt_rounded},
      {'title': 'Creating Monthly Tour Plans & Route Approvals', 'icon': Icons.map_rounded},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('MRConnect User Guide & SOP', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: guides.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (ctx, idx) {
          final g = guides[idx];
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
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE1F5FE),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(g['icon'] as IconData, color: const Color(0xFF0288D1), size: 22),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(g['title'] as String, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13.5, color: Color(0xFF0F172A))),
                ),
                const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
              ],
            ),
          );
        },
      ),
    );
  }
}
