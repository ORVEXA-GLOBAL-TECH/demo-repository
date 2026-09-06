import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_strings.dart';
import '../../../providers/locale_provider.dart';

class AppSettingsScreen extends StatefulWidget {
  const AppSettingsScreen({super.key});

  @override
  State<AppSettingsScreen> createState() => _AppSettingsScreenState();
}

class _AppSettingsScreenState extends State<AppSettingsScreen> {
  // Notification states
  bool _pushNotifications = true;
  bool _dcrReminders = true;
  bool _managerAlerts = true;
  bool _soundEnabled = true;
  bool _vibrationEnabled = true;

  // Formats & Theme
  String _dateFormat = 'DD/MM/YYYY';
  String _timeFormat = '12-hour (AM/PM)';
  String _selectedTheme = 'Light';

  // GPS & Location tracking settings
  bool _highAccuracyGps = true;
  String _geofenceRadius = '100 meters';
  String _trackingInterval = '5 mins';

  // Cache data
  double _cacheSizeMb = 38.4;
  final _testTypingController = TextEditingController(
    text: 'Alleviare CardioVasc 50mg • Dr. Chan Sopheap Chamber Detailing',
  );

  @override
  void dispose() {
    _testTypingController.dispose();
    super.dispose();
  }

  void _clearCache() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.cleaning_services_rounded, color: Color(0xFFE53935)),
            SizedBox(width: 8),
            Text('Clear Temporary Cache?', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Text(
          'This will remove ${_cacheSizeMb.toStringAsFixed(1)} MB of temporary downloaded brochures, cached map tiles, and visual aid thumbnails. Your offline DCR submissions and saved master database will NOT be deleted.',
          style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() {
                _cacheSizeMb = 0.0;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Temporary cache data successfully purged (38.4 MB cleared)!'),
                  backgroundColor: Color(0xFF10B981),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE53935), foregroundColor: Colors.white),
            child: const Text('Clear Now'),
          ),
        ],
      ),
    );
  }

  void _openBatteryOptimizationScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const BatteryOptimizationScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final localeProvider = context.watch<LocaleProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('App Settings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ==========================================
          // 1. NOTIFICATION SETTINGS
          // ==========================================
          _buildSectionHeader('Notification Settings', Icons.notifications_active_rounded, const Color(0xFFE53935)),
          const SizedBox(height: 8),
          _buildCard(
            children: [
              SwitchListTile.adaptive(
                title: const Text('Push Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Receive field updates, broadcast notices & announcements', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                value: _pushNotifications,
                activeThumbColor: const Color(0xFF0288D1),
                onChanged: (v) => setState(() => _pushNotifications = v),
              ),
              const Divider(height: 1),
              SwitchListTile.adaptive(
                title: const Text('Daily DCR Reminders', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Reminder alert at 6:00 PM if daily DCR is not submitted', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                value: _dcrReminders,
                activeThumbColor: const Color(0xFF0288D1),
                onChanged: (v) => setState(() => _dcrReminders = v),
              ),
              const Divider(height: 1),
              SwitchListTile.adaptive(
                title: const Text('Manager Approval Alerts', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Notify when ASM/RSM approves Tour Plan or Expense Claim', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                value: _managerAlerts,
                activeThumbColor: const Color(0xFF0288D1),
                onChanged: (v) => setState(() => _managerAlerts = v),
              ),
              const Divider(height: 1),
              SwitchListTile.adaptive(
                title: const Text('Sound & In-App Chimes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                value: _soundEnabled,
                activeThumbColor: const Color(0xFF0288D1),
                onChanged: (v) => setState(() => _soundEnabled = v),
              ),
              const Divider(height: 1),
              SwitchListTile.adaptive(
                title: const Text('Vibration Feedback', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                value: _vibrationEnabled,
                activeThumbColor: const Color(0xFF0288D1),
                onChanged: (v) => setState(() => _vibrationEnabled = v),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 2. LANGUAGE & LOCALIZATION
          // ==========================================
          _buildSectionHeader('Language & Formats', Icons.language_rounded, const Color(0xFF0288D1)),
          const SizedBox(height: 8),
          _buildCard(
            children: [
              ListTile(
                leading: Text(localeProvider.currentLanguage.flag, style: const TextStyle(fontSize: 22)),
                title: const Text('App Language', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: Text(localeProvider.currentLanguage.label, style: const TextStyle(fontSize: 12, color: Color(0xFF0288D1), fontWeight: FontWeight.w600)),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ChoiceChip(
                      label: const Text('English 🇺🇸', style: TextStyle(fontSize: 11.5)),
                      selected: localeProvider.currentLanguage == AppLanguage.english,
                      selectedColor: const Color(0xFF0288D1),
                      labelStyle: TextStyle(color: localeProvider.currentLanguage == AppLanguage.english ? Colors.white : const Color(0xFF0F172A)),
                      onSelected: (v) => localeProvider.setLanguage(AppLanguage.english),
                    ),
                    const SizedBox(width: 6),
                    ChoiceChip(
                      label: const Text('Khmer 🇰🇭', style: TextStyle(fontSize: 11.5)),
                      selected: localeProvider.currentLanguage == AppLanguage.khmer,
                      selectedColor: const Color(0xFF0288D1),
                      labelStyle: TextStyle(color: localeProvider.currentLanguage == AppLanguage.khmer ? Colors.white : const Color(0xFF0F172A)),
                      onSelected: (v) => localeProvider.setLanguage(AppLanguage.khmer),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.calendar_month_rounded, color: Color(0xFF64748B)),
                title: const Text('Date Format', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                trailing: DropdownButton<String>(
                  value: _dateFormat,
                  underline: const SizedBox(),
                  items: const [
                    DropdownMenuItem(value: 'DD/MM/YYYY', child: Text('DD/MM/YYYY (21/08/2026)', style: TextStyle(fontSize: 12.5))),
                    DropdownMenuItem(value: 'MM/DD/YYYY', child: Text('MM/DD/YYYY (08/21/2026)', style: TextStyle(fontSize: 12.5))),
                    DropdownMenuItem(value: 'YYYY-MM-DD', child: Text('YYYY-MM-DD (2026-08-21)', style: TextStyle(fontSize: 12.5))),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _dateFormat = val);
                  },
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.access_time_rounded, color: Color(0xFF64748B)),
                title: const Text('Time Format', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                trailing: DropdownButton<String>(
                  value: _timeFormat,
                  underline: const SizedBox(),
                  items: const [
                    DropdownMenuItem(value: '12-hour (AM/PM)', child: Text('12-Hour (06:30 PM)', style: TextStyle(fontSize: 12.5))),
                    DropdownMenuItem(value: '24-hour', child: Text('24-Hour (18:30)', style: TextStyle(fontSize: 12.5))),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _timeFormat = val);
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 3. ADJUSTABLE LETTER & TEXT SIZING (TYPOGRAPHY)
          // ==========================================
          _buildSectionHeader('Adjustable Letter & Text Sizing', Icons.format_size_rounded, const Color(0xFF0D9488)),
          const SizedBox(height: 8),
          _buildCard(
            children: [
              Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.text_fields_rounded, color: Color(0xFF0D9488), size: 20),
                            SizedBox(width: 8),
                            Text('Letter Sizing Scale', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF0FDFA),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFF99F6E4)),
                          ),
                          child: Text(
                            localeProvider.fontScaleLabel,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5, color: Color(0xFF0D9488)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Adjust text proportion across all static words, buttons, lists, and typed input fields.',
                      style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                    ),
                    const SizedBox(height: 14),

                    // Preset Buttons: Compact (85%), Standard (100%), Comfortable (112%), Large (125%)
                    Row(
                      children: [
                        _buildFontPresetChip('Compact', '85%', 0.85, localeProvider),
                        const SizedBox(width: 6),
                        _buildFontPresetChip('Standard', '100%', 1.00, localeProvider),
                        const SizedBox(width: 6),
                        _buildFontPresetChip('Comfort', '112%', 1.12, localeProvider),
                        const SizedBox(width: 6),
                        _buildFontPresetChip('Large', '125%', 1.25, localeProvider),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Fine-tuning Slider
                    Row(
                      children: [
                        const Text('A', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                        Expanded(
                          child: Slider(
                            value: localeProvider.fontScale,
                            min: 0.85,
                            max: 1.30,
                            divisions: 9,
                            activeColor: const Color(0xFF0D9488),
                            inactiveColor: const Color(0xFFE2E8F0),
                            onChanged: (val) => localeProvider.setFontScale(val),
                          ),
                        ),
                        const Text('A', style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold, color: Color(0xFF0D9488))),
                      ],
                    ),
                    const Divider(height: 18),

                    // Interactive Live Typing & Static Preview Box
                    const Text(
                      'Live Typing & Static Rendering Preview:',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF334155)),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Sample Static Header', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(6)),
                                child: const Text('✓ Elegant Kerning', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Typography adjusts letter-spacing and proportional line-height automatically for perfect aesthetic readability.',
                            style: TextStyle(fontSize: 12, color: Color(0xFF475569)),
                          ),
                          const SizedBox(height: 10),
                          TextField(
                            controller: _testTypingController,
                            style: const TextStyle(fontSize: 13.5, color: Color(0xFF0F172A), fontWeight: FontWeight.w500),
                            decoration: InputDecoration(
                              labelText: 'Try Writing / Editing Here',
                              labelStyle: const TextStyle(fontSize: 12, color: Color(0xFF0D9488)),
                              prefixIcon: const Icon(Icons.edit_note_rounded, color: Color(0xFF0D9488), size: 20),
                              filled: true,
                              fillColor: Colors.white,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF0D9488), width: 1.5)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 4. THEME (Light / Dark / System)
          // ==========================================
          _buildSectionHeader('Display Theme', Icons.palette_outlined, const Color(0xFF8E24AA)),
          const SizedBox(height: 8),
          _buildCard(
            children: [
              Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Expanded(child: _buildThemeTile('Light', Icons.light_mode_rounded, const Color(0xFFFB8C00))),
                    const SizedBox(width: 8),
                    Expanded(child: _buildThemeTile('Dark', Icons.dark_mode_rounded, const Color(0xFF1E293B))),
                    const SizedBox(width: 8),
                    Expanded(child: _buildThemeTile('System', Icons.settings_brightness_rounded, const Color(0xFF0288D1))),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 4. GPS & LOCATION TRACKING SETTINGS
          // ==========================================
          _buildSectionHeader('GPS & Location Tracking Settings', Icons.gps_fixed_rounded, const Color(0xFF10B981)),
          const SizedBox(height: 8),
          _buildCard(
            children: [
              SwitchListTile.adaptive(
                secondary: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFE8F5E9), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.satellite_alt_rounded, color: Color(0xFF2E7D32), size: 20),
                ),
                title: const Text('High-Accuracy GPS Hardware', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Multi-constellation GPS + GLONASS for clinic geofencing', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                value: _highAccuracyGps,
                activeThumbColor: const Color(0xFF2E7D32),
                onChanged: (v) => setState(() => _highAccuracyGps = v),
              ),
              const Divider(height: 1),
              ListTile(
                title: const Text('Geofence Verification Radius', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Auto-verifies doctor clinic proximity', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: DropdownButton<String>(
                  value: _geofenceRadius,
                  underline: const SizedBox(),
                  items: const [
                    DropdownMenuItem(value: '50 meters', child: Text('50m (Strict)', style: TextStyle(fontSize: 12.5))),
                    DropdownMenuItem(value: '100 meters', child: Text('100m (Standard)', style: TextStyle(fontSize: 12.5))),
                    DropdownMenuItem(value: '200 meters', child: Text('200m (Broad)', style: TextStyle(fontSize: 12.5))),
                  ],
                  onChanged: (v) {
                    if (v != null) setState(() => _geofenceRadius = v);
                  },
                ),
              ),
              const Divider(height: 1),
              ListTile(
                title: const Text('Background Route Interval', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Interval to capture travel coordinates', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: DropdownButton<String>(
                  value: _trackingInterval,
                  underline: const SizedBox(),
                  items: const [
                    DropdownMenuItem(value: '3 mins', child: Text('Every 3 mins', style: TextStyle(fontSize: 12.5))),
                    DropdownMenuItem(value: '5 mins', child: Text('Every 5 mins', style: TextStyle(fontSize: 12.5))),
                    DropdownMenuItem(value: '10 mins', child: Text('Every 10 mins', style: TextStyle(fontSize: 12.5))),
                  ],
                  onChanged: (v) {
                    if (v != null) setState(() => _trackingInterval = v);
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // ==========================================
          // 5. AUTO-SYNC & BATTERY OPTIMIZATION
          // ==========================================
          _buildSectionHeader('System & Storage Management', Icons.memory_rounded, const Color(0xFF64748B)),
          const SizedBox(height: 8),
          _buildCard(
            children: [
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFFFFBEB), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.battery_charging_full_rounded, color: Color(0xFFD97706), size: 20),
                ),
                title: const Text('Battery Optimization Information', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Ensure background location tracking is never killed by OS', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
                onTap: _openBatteryOptimizationScreen,
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFFFEBEE), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.delete_sweep_rounded, color: Color(0xFFE53935), size: 20),
                ),
                title: const Text('Clear Temporary / Cache Data', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: Text('Current Cache: ${_cacheSizeMb.toStringAsFixed(1)} MB (Safe to clear)', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: ElevatedButton(
                  onPressed: _cacheSizeMb > 0 ? _clearCache : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE53935),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    minimumSize: const Size(60, 32),
                  ),
                  child: const Text('Clear', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
                ),
              ),
              const Divider(height: 1),
              const ListTile(
                leading: Icon(Icons.info_outline_rounded, color: Color(0xFF0288D1)),
                title: Text('App Version', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: Text('Alleviare Pharma MR Field Automation Suite', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                trailing: Text('v2.4.0 (Build 428)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildThemeTile(String name, IconData icon, Color color) {
    final isSelected = _selectedTheme == name;
    return InkWell(
      onTap: () => setState(() => _selectedTheme = name),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? color.withValues(alpha: 0.12) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? color : const Color(0xFFE2E8F0), width: isSelected ? 1.8 : 1),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(name, style: TextStyle(fontSize: 12, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, color: const Color(0xFF0F172A))),
          ],
        ),
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

  Widget _buildFontPresetChip(String name, String pct, double scale, LocaleProvider provider) {
    final isSelected = (provider.fontScale - scale).abs() < 0.04;
    return Expanded(
      child: InkWell(
        onTap: () => provider.setFontScale(scale),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 2),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF0D9488) : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isSelected ? const Color(0xFF0D9488) : const Color(0xFFE2E8F0)),
          ),
          child: Column(
            children: [
              Text(
                name,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? Colors.white : const Color(0xFF1E293B),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                pct,
                style: TextStyle(
                  fontSize: 9.5,
                  fontWeight: FontWeight.w600,
                  color: isSelected ? Colors.white70 : const Color(0xFF64748B),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// =========================================================================
// FULL SCREEN: BATTERY OPTIMIZATION INFORMATION
// =========================================================================
class BatteryOptimizationScreen extends StatelessWidget {
  const BatteryOptimizationScreen({super.key});

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
        title: const Text('Battery Optimization Guide', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
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
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(color: const Color(0xFFFFFBEB), borderRadius: BorderRadius.circular(12)),
                      child: const Icon(Icons.battery_charging_full_rounded, color: Color(0xFFD97706), size: 24),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Keep GPS & Sync Active in Background', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                          Text('Prevent OS from killing location breadcrumbs', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  'Modern Android devices automatically pause apps running in the background to save battery. For uninterrupted real-time route tracing, doctor geofence verification, and instant offline visit syncing, please whitelist MRConnect.',
                  style: TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.45),
                ),
                const SizedBox(height: 16),
                _stepTile('1', 'Open Device Settings', 'Go to phone Settings ➔ Apps ➔ MRConnect'),
                const SizedBox(height: 10),
                _stepTile('2', 'Select Battery Option', 'Tap on "Battery" or "App battery usage"'),
                const SizedBox(height: 10),
                _stepTile('3', 'Set to "Unrestricted"', 'Choose "Unrestricted" / "Don\'t optimize"'),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0288D1),
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            child: const Text('Understood & Whitelisted'),
          ),
        ],
      ),
    );
  }

  Widget _stepTile(String num, String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE2E8F0))),
      child: Row(
        children: [
          Container(
            width: 24,
            height: 24,
            alignment: Alignment.center,
            decoration: const BoxDecoration(color: Color(0xFF0288D1), shape: BoxShape.circle),
            child: Text(num, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                Text(subtitle, style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
