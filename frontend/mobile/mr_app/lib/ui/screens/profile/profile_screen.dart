import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../../models/user_model.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/locale_provider.dart';
import '../../../providers/currency_provider.dart';
import '../../../core/localization/app_strings.dart';
import '../../widgets/text_size_sheet.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  void _copyToClipboard(BuildContext context, String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$label copied to clipboard!'),
        backgroundColor: const Color(0xFF10B981),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _openEditProfileScreen(BuildContext context, UserModel user, AuthProvider auth) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => EditProfileScreen(user: user, auth: auth),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final localeProvider = context.watch<LocaleProvider>();
    final currencyProvider = context.watch<CurrencyProvider>();
    final user = authProvider.currentUser;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('My Profile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            tooltip: 'Edit Profile',
            onPressed: () => _openEditProfileScreen(context, user, authProvider),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // =========================================================================
          // HERO PROFILE HEADER CARD (Photo, Name, ID, Designation, Active Status)
          // =========================================================================
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0B172E), Color(0xFF162A4A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF0B172E).withValues(alpha: 0.3),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    // Profile Photo with Active Status Dot
                    Stack(
                      children: [
                        Container(
                          width: 72,
                          height: 72,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2.5),
                            boxShadow: [
                              BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 8, offset: const Offset(0, 3)),
                            ],
                          ),
                          child: ClipOval(
                            child: Image.network(
                              user.avatarUrl,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => const CircleAvatar(
                                backgroundColor: Color(0xFF0288D1),
                                child: Icon(Icons.person, color: Colors.white, size: 36),
                              ),
                            ),
                          ),
                        ),
                        Positioned(
                          right: 2,
                          bottom: 2,
                          child: Container(
                            width: 18,
                            height: 18,
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    // Name, Designation, ID
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  user.name,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              // Active Status Badge
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF10B981).withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: const Color(0xFF10B981), width: 1),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 6,
                                      height: 6,
                                      decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle),
                                    ),
                                    const SizedBox(width: 5),
                                    Text(
                                      user.employeeStatus.toUpperCase(),
                                      style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 10.5),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            user.designation,
                            style: const TextStyle(fontSize: 12.5, color: Color(0xFF38BDF8), fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 4),
                          InkWell(
                            onTap: () => _copyToClipboard(context, user.empCode, 'Employee ID'),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Row(
                                    children: [
                                      Text(
                                        'ID: ${user.empCode}',
                                        style: const TextStyle(fontSize: 11, color: Colors.white70, fontWeight: FontWeight.w600),
                                      ),
                                      const SizedBox(width: 4),
                                      const Icon(Icons.copy_rounded, color: Colors.white70, size: 12),
                                    ],
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
                const Divider(color: Colors.white24, height: 26),
                // Company & Division Pill Tag
                Row(
                  children: [
                    const Icon(Icons.business_rounded, color: Colors.white70, size: 15),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        '${user.company} • ${user.division}',
                        style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.w500),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // =========================================================================
          // 1. PERSONAL & EMPLOYEE INFORMATION CARD
          // =========================================================================
          _buildSectionHeader('1. Personal & Employee Information', Icons.badge_rounded, const Color(0xFF0288D1)),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: const [BoxShadow(color: Color(0x04000000), blurRadius: 8, offset: Offset(0, 2))],
            ),
            child: Column(
              children: [
                // Full Name
                _buildInfoTile(
                  icon: Icons.person_rounded,
                  iconColor: const Color(0xFF0288D1),
                  label: 'Full Name',
                  value: user.name,
                  onCopy: () => _copyToClipboard(context, user.name, 'Full Name'),
                ),
                const Divider(height: 1),

                // Employee ID
                _buildInfoTile(
                  icon: Icons.badge_outlined,
                  iconColor: const Color(0xFF8E24AA),
                  label: 'Employee ID',
                  value: user.empCode,
                  onCopy: () => _copyToClipboard(context, user.empCode, 'Employee ID'),
                ),
                const Divider(height: 1),

                // Designation
                _buildInfoTile(
                  icon: Icons.work_outline_rounded,
                  iconColor: const Color(0xFFF59E0B),
                  label: 'Designation',
                  value: user.designation,
                ),
                const Divider(height: 1),

                // Department / Division
                _buildInfoTile(
                  icon: Icons.apartment_rounded,
                  iconColor: const Color(0xFF00897B),
                  label: 'Department / Division',
                  value: '${user.department}\n${user.division}',
                ),
                const Divider(height: 1),

                // Date of Joining
                _buildInfoTile(
                  icon: Icons.calendar_today_rounded,
                  iconColor: const Color(0xFF5C6BC0),
                  label: 'Date of Joining',
                  value: user.dateOfJoining,
                ),
                const Divider(height: 1),

                // Employee Status
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.verified_user_rounded, color: Color(0xFF10B981), size: 18),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Employee Status', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                            Text('Active / Full-Time Field Force', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE8F5E9),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFF10B981)),
                        ),
                        child: const Text('ACTIVE', style: TextStyle(color: Color(0xFF2E7D32), fontWeight: FontWeight.bold, fontSize: 11)),
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1),

                // Mobile Number
                _buildInfoTile(
                  icon: Icons.phone_android_rounded,
                  iconColor: const Color(0xFF10B981),
                  label: 'Mobile Number',
                  value: user.phone,
                  trailingAction: IconButton(
                    icon: const Icon(Icons.call_rounded, color: Color(0xFF10B981), size: 20),
                    tooltip: 'Call Phone',
                    onPressed: () => _copyToClipboard(context, user.phone, 'Mobile number'),
                  ),
                ),
                const Divider(height: 1),

                // Email ID
                _buildInfoTile(
                  icon: Icons.mail_outline_rounded,
                  iconColor: const Color(0xFF0288D1),
                  label: 'Email ID',
                  value: user.email,
                  onCopy: () => _copyToClipboard(context, user.email, 'Email ID'),
                ),
                const Divider(height: 1),

                // Emergency Contact
                _buildInfoTile(
                  icon: Icons.emergency_rounded,
                  iconColor: const Color(0xFFE53935),
                  label: 'Emergency Contact',
                  value: user.emergencyContact,
                  trailingAction: IconButton(
                    icon: const Icon(Icons.phone_forwarded_rounded, color: Color(0xFFE53935), size: 20),
                    tooltip: 'Emergency Call',
                    onPressed: () => _copyToClipboard(context, user.emergencyContact, 'Emergency contact'),
                  ),
                ),
                const Divider(height: 1),

                // Company
                _buildInfoTile(
                  icon: Icons.corporate_fare_rounded,
                  iconColor: const Color(0xFF1E293B),
                  label: 'Company',
                  value: user.company,
                ),
                const Divider(height: 1),

                // Region / Zone
                _buildInfoTile(
                  icon: Icons.map_rounded,
                  iconColor: const Color(0xFFD97706),
                  label: 'Region / Zone',
                  value: '${user.regionZone}\n${user.headquarters} • ${user.territory}',
                ),
                const Divider(height: 1),

                // Reporting Manager
                _buildInfoTile(
                  icon: Icons.supervisor_account_rounded,
                  iconColor: const Color(0xFF6366F1),
                  label: 'Reporting Manager (ASM)',
                  value: user.managerName,
                ),
                const Divider(height: 1),

                // Manager Contact
                _buildInfoTile(
                  icon: Icons.contact_phone_rounded,
                  iconColor: const Color(0xFF6366F1),
                  label: 'Manager Contact',
                  value: user.managerPhone,
                  trailingAction: IconButton(
                    icon: const Icon(Icons.call_rounded, color: Color(0xFF6366F1), size: 20),
                    tooltip: 'Call Manager',
                    onPressed: () => _copyToClipboard(context, user.managerPhone, 'Manager contact'),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // =========================================================================
          // 2. REGIONAL SETTINGS (Language & Currency)
          // =========================================================================
          _buildSectionHeader('2. Regional Settings & Preferences', Icons.tune_rounded, const Color(0xFF64748B)),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                // Language Setting
                Row(
                  children: [
                    Text(localeProvider.currentLanguage.flag, style: const TextStyle(fontSize: 22)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('App Language', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                          Text(localeProvider.currentLanguage.label, style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                        ],
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () {
                        final next = localeProvider.currentLanguage == AppLanguage.english ? AppLanguage.khmer : AppLanguage.english;
                        localeProvider.setLanguage(next);
                      },
                      icon: const Icon(Icons.swap_horiz_rounded, size: 16),
                      label: const Text('Switch', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
                const Divider(height: 16),
                // Currency Setting
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(10)),
                      child: Text(currencyProvider.currentCurrency.symbol, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0288D1))),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Active Currency', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                          Text('${currencyProvider.currentCurrency.name} (${currencyProvider.currentCurrency.code})', style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                        ],
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () => currencyProvider.toggleCurrency(),
                      icon: const Icon(Icons.swap_horiz_rounded, size: 16),
                      label: const Text('Toggle', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
                const Divider(height: 16),
                // Letter Sizing Setting
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: const Color(0xFFCCFBF1), borderRadius: BorderRadius.circular(10)),
                      child: const Icon(Icons.format_size_rounded, color: Color(0xFF0D9488), size: 18),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Letter & Typography Sizing', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                          Text(localeProvider.fontScaleLabel, style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                        ],
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () => showAdjustTextSizeModal(context),
                      icon: const Icon(Icons.tune_rounded, size: 16, color: Color(0xFF0D9488)),
                      label: const Text('Adjust', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0D9488))),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // App Version & Security Note
          Center(
            child: Column(
              children: [
                const Text('Alleviare MR Field Automation Enterprise v2.4.0', style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(width: 6, height: 6, decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle)),
                    const SizedBox(width: 6),
                    const Text('End-to-End Secure Healthcare Field Force Gateway', style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
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
        Text(
          title,
          style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
      ],
    );
  }

  Widget _buildInfoTile({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
    VoidCallback? onCopy,
    Widget? trailingAction,
  }) {
    return InkWell(
      onTap: onCopy,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: iconColor, size: 18),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    value,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                  ),
                ],
              ),
            ),
            if (trailingAction != null)
              trailingAction
            else if (onCopy != null)
              IconButton(
                icon: const Icon(Icons.copy_rounded, size: 16, color: Color(0xFF94A3B8)),
                onPressed: onCopy,
                tooltip: 'Copy $label',
              ),
          ],
        ),
      ),
    );
  }
}

// =========================================================================
// FULL SCREEN: EDIT PROFILE CONTACT INFORMATION
// =========================================================================
class EditProfileScreen extends StatefulWidget {
  final UserModel user;
  final AuthProvider auth;

  const EditProfileScreen({super.key, required this.user, required this.auth});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController _nameCtrl;
  late TextEditingController _phoneCtrl;
  late TextEditingController _emergencyCtrl;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.user.name);
    _phoneCtrl = TextEditingController(text: widget.user.phone);
    _emergencyCtrl = TextEditingController(text: widget.user.emergencyContact);
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emergencyCtrl.dispose();
    super.dispose();
  }

  void _saveProfile() {
    final updated = widget.user.copyWith(
      name: _nameCtrl.text.trim().isNotEmpty ? _nameCtrl.text.trim() : widget.user.name,
      phone: _phoneCtrl.text.trim().isNotEmpty ? _phoneCtrl.text.trim() : widget.user.phone,
      emergencyContact: _emergencyCtrl.text.trim().isNotEmpty ? _emergencyCtrl.text.trim() : widget.user.emergencyContact,
    );
    widget.auth.updateUser(updated);
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Profile details updated successfully!'),
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
        title: const Text('Edit Profile Information', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
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
                const Text('Personal Contact Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                const Text('Keep your mobile number and emergency contacts up to date for field communications.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                const SizedBox(height: 16),
                TextField(
                  controller: _nameCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Full Employee Name',
                    prefixIcon: Icon(Icons.person_outline_rounded),
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                  ),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _phoneCtrl,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Mobile Number',
                    prefixIcon: Icon(Icons.phone_outlined),
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                  ),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _emergencyCtrl,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Emergency Contact Details',
                    prefixIcon: Icon(Icons.contact_emergency_outlined),
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _saveProfile,
            icon: const Icon(Icons.save_rounded, size: 20),
            label: const Text('Save & Update Profile'),
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
