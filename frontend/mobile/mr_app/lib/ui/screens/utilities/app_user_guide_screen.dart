import 'package:flutter/material.dart';

class AppUserGuideScreen extends StatefulWidget {
  const AppUserGuideScreen({super.key});

  @override
  State<AppUserGuideScreen> createState() => _AppUserGuideScreenState();
}

class _AppUserGuideScreenState extends State<AppUserGuideScreen> {
  String _searchQuery = '';

  final List<Map<String, dynamic>> _guides = [
    {
      'title': '1. Field Attendance & Punch-In / Punch-Out',
      'subtitle': 'How to start your work day, record odometer reading & GPS tag',
      'icon': Icons.fingerprint_rounded,
      'color': const Color(0xFF10B981),
      'steps': [
        'Open the Dashboard and locate the "Punch-In / Start Work" button at the top hero card.',
        'Ensure device GPS is turned on with high accuracy.',
        'Enter your starting vehicle odometer reading (e.g. 14,280 KM) and select your vehicle type (Motorbike / Car).',
        'Tap "Confirm Punch-In". The app captures your starting timestamp and GPS coordinates.',
        'At the end of your fieldwork, tap "Punch-Out / End Day", enter the ending odometer reading, and submit your daily summary.',
      ],
      'tip': 'Tip: You can punch in even if you are offline in areas with low cell signal; it will sync automatically when back online.',
    },
    {
      'title': '2. Universal DCR Doctor & Facility Reporting',
      'subtitle': 'Recording clinical visits, work types, samples, orders, Rx & documents',
      'icon': Icons.assignment_turned_in_rounded,
      'color': const Color(0xFF0288D1),
      'steps': [
        'Navigate to Work ➔ DCR (or tap "Add DCR" from the Dashboard Quick Action).',
        'Select the Facility Type: Doctor, Retailer / Chemist, Stockist, Clinic, Hospital, or Private/Govt.',
        'Choose the contact name from your Master Directory or type a new facility.',
        'Select Work Type: "Solo", "Joint with ASM", or "Joint with RSM".',
        'For Doctors: Add promoted products and issue physical physician samples (specify batch & quantity).',
        'For Retailers/Stockists: Enter Product Order Booking (POB) quantities, scheme bonus units, and map the distributor.',
        'Record Prescription Commitment (Rx) numbers, Doctor Feedback, and Remarks.',
        'Upload Photos (clinic board / prescription slip), PDF files, or clinical study documents.',
        'Set Next Scheduled Follow-up Date and tap "Save & Submit DCR".',
      ],
      'tip': 'Tip: GPS proximity automatically verifies that you are within the doctor\'s clinic geofence.',
    },
    {
      'title': '3. Product Order Booking (POB)',
      'subtitle': 'Booking trade orders directly from chemists and stockists',
      'icon': Icons.shopping_bag_rounded,
      'color': const Color(0xFF8E24AA),
      'steps': [
        'Go to Work ➔ POB Booking.',
        'Select the buying Chemist or Stockist from your tagged territory list.',
        'Browse the pharmaceutical catalog by therapeutic category (Cardio, Ortho, Neuro, Gastro).',
        'Add medicines to the digital cart, set order quantities, and apply active trade schemes (e.g. 10+1 Free).',
        'Select the servicing Stockist Depot responsible for fulfilling the shipment.',
        'Review the total order value and submit. An instant digital order copy is dispatched to the stockist.',
      ],
      'tip': 'Tip: POB orders automatically calculate Price to Retailer (PTR) and Price to Stockist (PTS).',
    },
    {
      'title': '4. RCPA Prescription Audit (Retail Chemist)',
      'subtitle': 'Benchmarking brand prescriptions against market competitor molecules',
      'icon': Icons.compare_arrows_rounded,
      'color': const Color(0xFFFB8C00),
      'steps': [
        'Go to Work ➔ RCPA Audit.',
        'Select the Chemist shop located near major doctor clinics.',
        'Select the target Doctor whose prescriptions you are auditing at this chemist counter.',
        'Select your Company Brand (e.g. CardioVasc-AM 5/50mg) and input daily units sold.',
        'Add Competitor Brands (e.g. Amlokind-AT, Telma-AM) with competitor company name, price, and units sold.',
        'Review Market Share % breakdown and save the audit.',
      ],
      'tip': 'Tip: RCPA audits help you tailor clinical discussions with doctors during subsequent DCR calls.',
    },
    {
      'title': '5. Monthly & Weekly Tour Planning (MTP)',
      'subtitle': 'Submitting proposed field routes for Manager (ASM/RSM) approval',
      'icon': Icons.map_rounded,
      'color': const Color(0xFF00897B),
      'steps': [
        'Open Work ➔ Tour Plan.',
        'Switch between Day, Week, and Month view to see approved and planned routes.',
        'Tap "+ Schedule Tour Plan" to propose a field itinerary for upcoming days.',
        'Select the Date, Territory Route / Patch, Target Doctor / Chemist count, and Joint Work with Manager if applicable.',
        'Tap "Submit for Approval". The status shows "PENDING ASM APPROVAL".',
        'Once your manager reviews and approves, the badge updates to "APPROVED" with a push notification.',
      ],
      'tip': 'Tip: Tour plans must be submitted by the 25th of every month for the upcoming month.',
    },
    {
      'title': '6. Daily Expenses & Travel Reimbursement Claims',
      'subtitle': 'Logging Daily Allowance (DA), Travel Allowance (TA), and Bills',
      'icon': Icons.receipt_long_rounded,
      'color': const Color(0xFFE53935),
      'steps': [
        'Go to Work ➔ Expenses.',
        'Tap "+ Add Expense Claim" for the day.',
        'Select Expense Category: Daily Allowance (DA - HQ/Ex-HQ/Outstation), Travel Allowance (TA - Distance KM), Hotel Lodge, or Miscellaneous (Doctor engagement, postage).',
        'Enter amount, attach photo receipt / fuel bill, and add notes.',
        'Submit the claim for manager verification and finance payout.',
      ],
      'tip': 'Tip: TA km is cross-referenced with your daily GPS odometer reading for automatic approval.',
    },
    {
      'title': '7. Offline Synchronization & Cloud Protection',
      'subtitle': 'Working in zero-network areas and pushing queued data',
      'icon': Icons.sync_lock_rounded,
      'color': const Color(0xFF0288D1),
      'steps': [
        'The app automatically operates in offline mode when internet connectivity is unavailable.',
        'All doctor visits, sample issues, and orders are stored in local AES-256 encrypted storage.',
        'When network is restored, Auto-Sync automatically pushes all pending records to the cloud.',
        'You can also go to Profile ➔ Mobile Settings and tap "Sync Now" to force a manual cloud push.',
      ],
      'tip': 'Tip: Always verify that "Pending Records" shows 0 before logging out of your device.',
    },
    {
      'title': '8. Live GPS Tracking & Geofencing',
      'subtitle': 'Understanding route capture and clinic proximity verification',
      'icon': Icons.gps_fixed_rounded,
      'color': const Color(0xFF2E7D32),
      'steps': [
        'During punched-in field hours, GPS hardware periodically logs route breadcrumbs.',
        'When you arrive at a doctor\'s clinic, the app verifies your distance within the 100m geofence radius.',
        'View your live travel route and total distance covered under Work ➔ GPS Tracking.',
        'If you experience satellite drift indoors, go to Profile ➔ Help & Support ➔ "Report GPS Issue" to recalibrate.',
      ],
      'tip': 'Tip: Ensure battery optimization is disabled for MRConnect in phone settings for unbroken route tracking.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _guides.where((g) {
      final q = _searchQuery.toLowerCase();
      final matchTitle = g['title'].toString().toLowerCase().contains(q);
      final matchSub = g['subtitle'].toString().toLowerCase().contains(q);
      return matchTitle || matchSub;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('MR User Guide & Tutorials', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Header search bar
          Container(
            color: const Color(0xFF0B172E),
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v),
              style: const TextStyle(color: Colors.white, fontSize: 13.5),
              decoration: InputDecoration(
                hintText: 'Search guide (e.g. DCR, POB, Tour Plan, Expenses)...',
                hintStyle: const TextStyle(color: Colors.white60, fontSize: 12.5),
                prefixIcon: const Icon(Icons.search, color: Colors.white70, size: 20),
                filled: true,
                fillColor: Colors.white.withValues(alpha: 0.12),
                contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
              ),
            ),
          ),

          // Guides Accordion List
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: filtered.length,
              separatorBuilder: (_, _) => const SizedBox(height: 12),
              itemBuilder: (ctx, idx) {
                final guide = filtered[idx];
                final Color col = guide['color'] as Color;
                final List<String> steps = guide['steps'] as List<String>;

                return Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: ExpansionTile(
                    leading: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(color: col.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)),
                      child: Icon(guide['icon'] as IconData, color: col, size: 22),
                    ),
                    title: Text(
                      guide['title'] as String,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                    ),
                    subtitle: Text(
                      guide['subtitle'] as String,
                      style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                    ),
                    childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    children: [
                      const Divider(height: 1),
                      const SizedBox(height: 12),
                      Column(
                        children: steps.asMap().entries.map((entry) {
                          final stepIdx = entry.key + 1;
                          final stepText = entry.value;
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  width: 22,
                                  height: 22,
                                  alignment: Alignment.center,
                                  decoration: BoxDecoration(color: col.withValues(alpha: 0.15), shape: BoxShape.circle),
                                  child: Text('$stepIdx', style: TextStyle(color: col, fontWeight: FontWeight.bold, fontSize: 11)),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(stepText, style: const TextStyle(fontSize: 12.5, color: Color(0xFF334155), height: 1.35)),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFFBEB),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFDE68A)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.lightbulb_rounded, color: Color(0xFFD97706), size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(guide['tip'] as String, style: const TextStyle(fontSize: 11.5, color: Color(0xFF92400E), fontWeight: FontWeight.w500)),
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
        ],
      ),
    );
  }
}
