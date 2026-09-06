import 'package:flutter/material.dart';

class MobileSettingsScreen extends StatefulWidget {
  const MobileSettingsScreen({super.key});

  @override
  State<MobileSettingsScreen> createState() => _MobileSettingsScreenState();
}

class _MobileSettingsScreenState extends State<MobileSettingsScreen> with SingleTickerProviderStateMixin {
  bool _autoSyncEnabled = true;
  bool _wifiOnly = false;
  bool _backgroundSync = true;
  String _syncInterval = '15 mins';
  bool _isSyncing = false;
  DateTime _lastSyncTime = DateTime.now().subtract(const Duration(minutes: 2));
  int _pendingRecords = 3;
  final int _failedRecords = 0;
  int _offlineRecords = 14;

  late AnimationController _syncAnimController;

  @override
  void initState() {
    super.initState();
    _syncAnimController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    );
  }

  @override
  void dispose() {
    _syncAnimController.dispose();
    super.dispose();
  }

  void _triggerSyncNow() async {
    setState(() {
      _isSyncing = true;
    });
    _syncAnimController.repeat();

    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;
    setState(() {
      _isSyncing = false;
      _lastSyncTime = DateTime.now();
      _offlineRecords += _pendingRecords;
      _pendingRecords = 0;
    });
    _syncAnimController.stop();
    _syncAnimController.reset();

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Row(
          children: [
            Icon(Icons.check_circle_rounded, color: Colors.white),
            SizedBox(width: 10),
            Text('Cloud Sync Complete! All 4 pending records synced.', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Color(0xFF10B981),
        duration: Duration(seconds: 3),
      ),
    );
  }

  String _formatTime(DateTime dt) {
    final hour = dt.hour.toString().padLeft(2, '0');
    final min = dt.minute.toString().padLeft(2, '0');
    return '$hour:$min (Just now)';
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
        title: const Text('Mobile Settings & Offline Sync', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ==========================================
          // 1. CLOUD SYNC STATUS HERO CARD
          // ==========================================
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
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), shape: BoxShape.circle),
                          child: const Icon(Icons.cloud_done_rounded, color: Color(0xFF38BDF8), size: 22),
                        ),
                        const SizedBox(width: 10),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Cloud Sync Status', style: TextStyle(color: Colors.white70, fontSize: 11.5)),
                            Text('Connected & Online', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14.5)),
                          ],
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF10B981)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.circle, color: Color(0xFF10B981), size: 8),
                          SizedBox(width: 5),
                          Text('LIVE SYNC', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 10.5)),
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(color: Colors.white24, height: 24),
                Row(
                  children: [
                    const Icon(Icons.schedule_rounded, color: Colors.white70, size: 16),
                    const SizedBox(width: 8),
                    const Text('Last Successful Sync:', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    const Spacer(),
                    Text(_formatTime(_lastSyncTime), style: const TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold, fontSize: 12.5)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 2. SYNCHRONIZATION QUEUE METRICS
          // ==========================================
          Row(
            children: [
              // Pending Records
              Expanded(
                child: _buildMetricCard(
                  title: 'Pending Records',
                  count: '$_pendingRecords',
                  subtitle: _pendingRecords > 0 ? 'Queued to push' : 'All synced',
                  icon: Icons.hourglass_top_rounded,
                  color: const Color(0xFFF59E0B),
                  bgColor: const Color(0xFFFFFBEB),
                ),
              ),
              const SizedBox(width: 12),
              // Failed Records
              Expanded(
                child: _buildMetricCard(
                  title: 'Failed Records',
                  count: '$_failedRecords',
                  subtitle: '0 Network errors',
                  icon: Icons.error_outline_rounded,
                  color: const Color(0xFF10B981),
                  bgColor: const Color(0xFFECFDF5),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Offline Records Encrypted
          Container(
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
                  decoration: BoxDecoration(color: const Color(0xFFEDE7F6), borderRadius: BorderRadius.circular(12)),
                  child: const Icon(Icons.storage_rounded, color: Color(0xFF673AB7), size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Offline Local Database', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                      Text('$_offlineRecords records stored locally (AES-256 SQLite)', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(8)),
                  child: const Text('ENCRYPTED', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 3. SYNC NOW ACTION BUTTON
          // ==========================================
          ElevatedButton.icon(
            onPressed: _isSyncing ? null : _triggerSyncNow,
            icon: RotationTransition(
              turns: _syncAnimController,
              child: const Icon(Icons.sync_rounded, size: 22),
            ),
            label: Text(_isSyncing ? 'Synchronizing Enterprise Data...' : 'Sync Now (Force Cloud Push)'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0288D1),
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5),
              elevation: 2,
            ),
          ),
          const SizedBox(height: 22),

          // ==========================================
          // 4. AUTO-SYNC & OFFLINE SETTINGS CARD
          // ==========================================
          _buildSectionHeader('Offline & Auto-Sync Settings', Icons.tune_rounded, const Color(0xFF0288D1)),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                // Auto-sync ON/OFF
                SwitchListTile.adaptive(
                  secondary: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(10)),
                    child: const Icon(Icons.autorenew_rounded, color: Color(0xFF0288D1), size: 20),
                  ),
                  title: const Text('Auto-Sync Engine', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                  subtitle: const Text('Automatically pushes field visits & orders in background', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                  value: _autoSyncEnabled,
                  activeTrackColor: const Color(0xFF0288D1),
                  onChanged: (val) {
                    setState(() => _autoSyncEnabled = val);
                  },
                ),
                if (_autoSyncEnabled) ...[
                  const Divider(height: 1),
                  // Sync Frequency
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.timer_outlined, color: Color(0xFF64748B), size: 18),
                            SizedBox(width: 8),
                            Text('Sync Interval Frequency', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            _buildIntervalChip('15 mins'),
                            const SizedBox(width: 8),
                            _buildIntervalChip('30 mins'),
                            const SizedBox(width: 8),
                            _buildIntervalChip('1 hour'),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
                const Divider(height: 1),
                // Wi-Fi Only
                SwitchListTile.adaptive(
                  secondary: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: const Color(0xFFF3E5F5), borderRadius: BorderRadius.circular(10)),
                    child: const Icon(Icons.wifi_rounded, color: Color(0xFF8E24AA), size: 20),
                  ),
                  title: const Text('Sync Photos on Wi-Fi Only', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                  subtitle: const Text('Saves cellular data when uploading doctor call attachments', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                  value: _wifiOnly,
                  activeTrackColor: const Color(0xFF8E24AA),
                  onChanged: (val) {
                    setState(() => _wifiOnly = val);
                  },
                ),
                const Divider(height: 1),
                // Background Sync
                SwitchListTile.adaptive(
                  secondary: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: const Color(0xFFE8F5E9), borderRadius: BorderRadius.circular(10)),
                    child: const Icon(Icons.battery_charging_full_rounded, color: Color(0xFF2E7D32), size: 20),
                  ),
                  title: const Text('Background Sync on Battery Saver', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                  subtitle: const Text('Permits background sync when device enters power saver', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                  value: _backgroundSync,
                  activeTrackColor: const Color(0xFF2E7D32),
                  onChanged: (val) {
                    setState(() => _backgroundSync = val);
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String count,
    required String subtitle,
    required IconData icon,
    required Color color,
    required Color bgColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: color)),
              Icon(icon, color: color, size: 18),
            ],
          ),
          const SizedBox(height: 6),
          Text(count, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
          const SizedBox(height: 2),
          Text(subtitle, style: TextStyle(fontSize: 10.5, color: color.withValues(alpha: 0.8), fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildIntervalChip(String label) {
    final isSelected = _syncInterval == label;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 12, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
      selected: isSelected,
      selectedColor: const Color(0xFF0288D1),
      labelStyle: TextStyle(color: isSelected ? Colors.white : const Color(0xFF0F172A)),
      onSelected: (val) {
        if (val) {
          setState(() => _syncInterval = label);
        }
      },
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
        Text(
          title,
          style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
      ],
    );
  }
}
