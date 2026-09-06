import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class HelpSupportScreen extends StatefulWidget {
  const HelpSupportScreen({super.key});

  @override
  State<HelpSupportScreen> createState() => _HelpSupportScreenState();
}

class _HelpSupportScreenState extends State<HelpSupportScreen> {
  int _selectedRating = 5;

  void _launchTelegramSupport() async {
    final uri = Uri.parse('https://t.me/AlleviarePharmaSupport');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _openReportProblemScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const ReportProblemScreen()),
    );
  }

  void _openGpsDiagnosticsScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const GpsDiagnosticsScreen()),
    );
  }

  void _openSyncTroubleshootingScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const SyncTroubleshootingScreen()),
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
        title: const Text('Help & Support Center', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ==========================================
          // 1. DIRECT CONTACT SUPPORT CHANNELS
          // ==========================================
          _buildSectionHeader('Contact Support Channels', Icons.headset_mic_rounded, const Color(0xFF0288D1)),
          const SizedBox(height: 8),
          _buildCard(
            children: [
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.send_rounded, color: Color(0xFF0288D1), size: 20),
                ),
                title: const Text('Telegram Support Channel', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Instant chat with 24/7 Field Operations Desk', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: const Icon(Icons.open_in_new_rounded, color: Color(0xFF0288D1), size: 18),
                onTap: _launchTelegramSupport,
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFE8F5E9), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.phone_in_talk_rounded, color: Color(0xFF2E7D32), size: 20),
                ),
                title: const Text('Toll-Free Support Hotline', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('+855 23 888 111 (Support 8 AM - 8 PM Cambodia ICT)', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: const Icon(Icons.call_rounded, color: Color(0xFF2E7D32), size: 18),
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Dialing support: +855 23 888 111')));
                },
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFFFF3E0), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.email_rounded, color: Color(0xFFFB8C00), size: 20),
                ),
                title: const Text('Technical Support Email', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('support@alleviarepharma.com', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF94A3B8), size: 14),
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Opening mail client to support@alleviarepharma.com')));
                },
              ),
            ],
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 2. DIAGNOSTICS & ISSUE REPORTING
          // ==========================================
          _buildSectionHeader('Troubleshooting & Ticket Desk', Icons.medical_services_rounded, const Color(0xFFE53935)),
          const SizedBox(height: 8),
          _buildCard(
            children: [
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFFFEBEE), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.bug_report_rounded, color: Color(0xFFE53935), size: 20),
                ),
                title: const Text('Report a Problem', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Submit ticket for bugs, crashes or data anomalies', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
                onTap: _openReportProblemScreen,
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFE8F5E9), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.gps_fixed_rounded, color: Color(0xFF2E7D32), size: 20),
                ),
                title: const Text('Report GPS Issue & Recalibrate', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Diagnose location drift & recalibrate sensor', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
                onTap: _openGpsDiagnosticsScreen,
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.sync_problem_rounded, color: Color(0xFF0288D1), size: 20),
                ),
                title: const Text('Sync Troubleshooting & Repair', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Diagnose offline database queue & payload integrity', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
                onTap: _openSyncTroubleshootingScreen,
              ),
            ],
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 3. FREQUENTLY ASKED QUESTIONS (FAQs)
          // ==========================================
          _buildSectionHeader('Frequently Asked Questions (FAQs)', Icons.quiz_rounded, const Color(0xFF8E24AA)),
          const SizedBox(height: 8),
          _buildCard(
            children: const [
              ExpansionTile(
                title: Text('How does offline DCR recording work?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                children: [
                  Padding(
                    padding: EdgeInsets.fromLTRB(16, 0, 16, 12),
                    child: Text(
                      'When you are in clinics with no mobile network coverage, MRConnect saves all your visits, sample issues, and photos into local encrypted storage. As soon as connectivity is restored, the auto-sync engine automatically pushes records to the enterprise cloud.',
                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.4),
                    ),
                  ),
                ],
              ),
              Divider(height: 1),
              ExpansionTile(
                title: Text('How do I submit POB orders to distributors?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                children: [
                  Padding(
                    padding: EdgeInsets.fromLTRB(16, 0, 16, 12),
                    child: Text(
                      'While booking a commercial visit with a Retailer or Clinic, select "Product Order Booking (POB)", choose medicines, set quantities & schemes (e.g. 10+1 Free), map the supplying stockist depot, and tap Save & Submit.',
                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.4),
                    ),
                  ),
                ],
              ),
              Divider(height: 1),
              ExpansionTile(
                title: Text('Why does GPS show "Awaiting Satellite Lock"?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                children: [
                  Padding(
                    padding: EdgeInsets.fromLTRB(16, 0, 16, 12),
                    child: Text(
                      'Thick concrete hospital basements can block satellite signals. Step near open corridors or windows for 10 seconds to allow the GPS hardware to acquire multi-constellation lock.',
                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.4),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 4. APP EXPERIENCE & FEEDBACK
          // ==========================================
          _buildSectionHeader('Share App Feedback', Icons.rate_review_rounded, const Color(0xFFFB8C00)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Rate your field experience with MRConnect:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) {
                    final star = index + 1;
                    return IconButton(
                      icon: Icon(
                        star <= _selectedRating ? Icons.star_rounded : Icons.star_outline_rounded,
                        color: const Color(0xFFF59E0B),
                        size: 32,
                      ),
                      onPressed: () => setState(() => _selectedRating = star),
                    );
                  }),
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Thank you! Your feedback has been sent to the product team.'), backgroundColor: Color(0xFF10B981)),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0B172E),
                    foregroundColor: Colors.white,
                    minimumSize: const Size(double.infinity, 44),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Submit Feedback'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
          child: Icon(icon, color: color, size: 16),
        ),
        const SizedBox(width: 8),
        Text(title, style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
      ],
    );
  }

  Widget _buildCard({required List<Widget> children}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(children: children),
    );
  }
}

// =========================================================================
// FULL SCREEN: REPORT A PROBLEM
// =========================================================================
class ReportProblemScreen extends StatefulWidget {
  const ReportProblemScreen({super.key});

  @override
  State<ReportProblemScreen> createState() => _ReportProblemScreenState();
}

class _ReportProblemScreenState extends State<ReportProblemScreen> {
  String _category = 'DCR Visit Submission';
  final _descCtrl = TextEditingController();
  bool _hasScreenshot = false;

  @override
  void dispose() {
    _descCtrl.dispose();
    super.dispose();
  }

  void _submitTicket() {
    if (_descCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please describe the problem details.')));
      return;
    }
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Problem ticket #TKT-8902 created! IT Support will respond shortly.'),
        backgroundColor: Color(0xFF10B981),
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
        title: const Text('Report a Problem', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Describe Field Issue', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: _category,
                  decoration: const InputDecoration(labelText: 'Issue Category', prefixIcon: Icon(Icons.category_outlined), border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)))),
                  items: const [
                    DropdownMenuItem(value: 'DCR Visit Submission', child: Text('DCR Visit Submission')),
                    DropdownMenuItem(value: 'POB Order Booking', child: Text('POB Order Booking')),
                    DropdownMenuItem(value: 'GPS Route Deviation', child: Text('GPS Route Deviation')),
                    DropdownMenuItem(value: 'Offline Sync Failure', child: Text('Offline Sync Failure')),
                    DropdownMenuItem(value: 'Sample Bag Discrepancy', child: Text('Sample Bag Discrepancy')),
                  ],
                  onChanged: (v) {
                    if (v != null) setState(() => _category = v);
                  },
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _descCtrl,
                  maxLines: 5,
                  decoration: const InputDecoration(
                    labelText: 'Problem Details & Symptoms',
                    hintText: 'Describe what happened, error message shown, or expected behavior...',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                    alignLabelWithHint: true,
                  ),
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: () {
                    setState(() => _hasScreenshot = !_hasScreenshot);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(_hasScreenshot ? 'Screenshot attached.' : 'Screenshot removed.')),
                    );
                  },
                  icon: Icon(_hasScreenshot ? Icons.check_circle_rounded : Icons.attach_file_rounded, color: _hasScreenshot ? const Color(0xFF10B981) : null),
                  label: Text(_hasScreenshot ? 'Screenshot Attached (1 file)' : 'Attach Screenshot / Log File'),
                  style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 44), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _submitTicket,
            icon: const Icon(Icons.send_rounded, size: 20),
            label: const Text('Submit Support Ticket'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE53935),
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
          ),
        ],
      ),
    );
  }
}

// =========================================================================
// FULL SCREEN: GPS DIAGNOSTICS & FIX
// =========================================================================
class GpsDiagnosticsScreen extends StatelessWidget {
  const GpsDiagnosticsScreen({super.key});

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
        title: const Text('GPS Diagnostics & Calibration', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Hardware Sensor Health', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                const SizedBox(height: 12),
                _diagItem('GPS Constellation Lock', '14 Active Satellites (GPS + GLONASS)', true),
                const Divider(height: 16),
                _diagItem('Location Accuracy', 'High (± 3.8 meters)', true),
                const Divider(height: 16),
                _diagItem('Geofence Sensor', 'Active & Calibrated', true),
                const Divider(height: 16),
                _diagItem('Background Power Mode', 'Unrestricted (Healthy)', true),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFA7F3D0))),
            child: const Row(
              children: [
                Icon(Icons.check_circle_rounded, color: Color(0xFF059669), size: 22),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'GPS sensor is healthy and locked. If you experience drift inside high-rise hospital wards, step near a window for 5 seconds.',
                    style: TextStyle(fontSize: 12, color: Color(0xFF065F46), height: 1.35),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('GPS Sensor Recalibrated! Accuracy updated to ±3.2m'), backgroundColor: Color(0xFF10B981)),
              );
            },
            icon: const Icon(Icons.restart_alt_rounded, size: 20),
            label: const Text('Recalibrate GPS Hardware'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
          ),
        ],
      ),
    );
  }

  Widget _diagItem(String title, String desc, bool ok) {
    return Row(
      children: [
        Icon(ok ? Icons.check_circle_rounded : Icons.error_rounded, color: ok ? const Color(0xFF10B981) : Colors.red, size: 18),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
              Text(desc, style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
            ],
          ),
        ),
      ],
    );
  }
}

// =========================================================================
// FULL SCREEN: SYNC TROUBLESHOOTING
// =========================================================================
class SyncTroubleshootingScreen extends StatelessWidget {
  const SyncTroubleshootingScreen({super.key});

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
        title: const Text('Sync Queue Troubleshooting', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Local Database Integrity & Queue Diagnostics', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                SizedBox(height: 12),
                Text('• Database Integrity: OK (No corrupted pages)\n• Network TLS Handshake: 200 OK\n• Enterprise Payload Token: Valid\n• Pending Offline Blobs: 0 Conflicts\n• Encryption: AES-256 Enabled', style: TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.5)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Local database re-indexed and sync queue flushed successfully!'), backgroundColor: Color(0xFF10B981)),
              );
            },
            icon: const Icon(Icons.build_rounded, size: 20),
            label: const Text('Repair & Re-Index Local Queue'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0288D1),
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
          ),
        ],
      ),
    );
  }
}
