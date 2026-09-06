import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/dcr_model.dart';
import '../../../providers/dcr_provider.dart';
import '../../widgets/empty_state_view.dart';
import 'call_history_screen.dart';
import 'universal_dcr_form_screen.dart';

class DcrHomeScreen extends StatefulWidget {
  const DcrHomeScreen({super.key});

  @override
  State<DcrHomeScreen> createState() => _DcrHomeScreenState();
}

class _DcrHomeScreenState extends State<DcrHomeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showNewCallTypeModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      isScrollControlled: true,
      builder: (ctx) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Log Doctor DCR Detailing Call',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              const Text(
                'Reporting is strictly for Doctors (Hospital, Clinic, Pvt, Govt)',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(9),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0288D1).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.local_hospital_rounded, color: Color(0xFF0288D1)),
                ),
                title: const Text('Hospital Doctor Visit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Govt & Private multi-specialty hospitals & medical colleges', style: TextStyle(fontSize: 11.5)),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalDcrFormScreen(preselectedCategory: 'Hospital Doctor')));
                },
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(9),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.medical_services_rounded, color: AppColors.primary),
                ),
                title: const Text('Clinic Doctor Visit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Private clinics, polyclinics, nursing homes & consulting chambers', style: TextStyle(fontSize: 11.5)),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalDcrFormScreen(preselectedCategory: 'Clinic Doctor')));
                },
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(9),
                  decoration: BoxDecoration(
                    color: const Color(0xFF8E24AA).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.domain_rounded, color: Color(0xFF8E24AA)),
                ),
                title: const Text('Private Doctor (Pvt Consultant)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('Independent private practitioners, specialists & KOL doctors', style: TextStyle(fontSize: 11.5)),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalDcrFormScreen(preselectedCategory: 'Pvt Consultant')));
                },
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(9),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0D9488).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.account_balance_rounded, color: Color(0xFF0D9488)),
                ),
                title: const Text('Government Doctor Visit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                subtitle: const Text('National referral hospitals, district health centers & dispensaries', style: TextStyle(fontSize: 11.5)),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalDcrFormScreen(preselectedCategory: 'Govt Doctor')));
                },
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final dcrProvider = context.watch<DcrProvider>();
    final todayDcr = dcrProvider.todayDcr;

    final hospitalDoctors = todayDcr.doctorCalls.where((d) => d.clinicName.toLowerCase().contains('hospital')).toList();
    final clinicDoctors = todayDcr.doctorCalls.where((d) => !d.clinicName.toLowerCase().contains('hospital')).toList();

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Doctor Reporting (DCR)'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history_rounded),
            tooltip: 'DCR History',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CallHistoryScreen()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: isDark ? AppColors.primaryLight : AppColors.primary,
          unselectedLabelColor: isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary,
          indicatorColor: isDark ? AppColors.primaryLight : AppColors.primary,
          tabs: [
            Tab(text: 'All Doctors (${todayDcr.doctorCalls.length})'),
            Tab(text: 'Hospital & Govt (${hospitalDoctors.length})'),
            Tab(text: 'Clinic & Pvt (${clinicDoctors.length})'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Today's DCR Status Ribbon
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant,
              border: Border(
                bottom: BorderSide(
                  color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                ),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${todayDcr.routePatch} • ${DateFormatter.formatDisplayDate(todayDcr.date)}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Status: ${todayDcr.status} • Samples Given: ${todayDcr.totalSamplesGiven} Units',
                        style: TextStyle(
                          fontSize: 11.5,
                          color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: todayDcr.status == 'Approved'
                        ? const Color(0xFFDCFCE7)
                        : (todayDcr.status == 'Submitted' ? const Color(0xFFE0F2FE) : const Color(0xFFF1F5F9)),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    todayDcr.status,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: todayDcr.status == 'Approved'
                          ? const Color(0xFF16A34A)
                          : (todayDcr.status == 'Submitted' ? const Color(0xFF0288D1) : const Color(0xFF475569)),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Tab 1: All Doctor Calls
                todayDcr.doctorCalls.isEmpty
                    ? const EmptyStateView(
                        icon: Icons.person_pin_rounded,
                        title: 'No Doctor Calls Logged Today',
                        description: 'Doctor visits, product detailing & sample distributions will appear here.',
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: todayDcr.doctorCalls.length,
                        itemBuilder: (context, index) {
                          final call = todayDcr.doctorCalls[index];
                          return _buildDoctorCallCard(call, isDark);
                        },
                      ),

                // Tab 2: Hospital Doctors
                hospitalDoctors.isEmpty
                    ? const EmptyStateView(
                        icon: Icons.local_hospital_rounded,
                        title: 'No Hospital Doctor Visits',
                        description: 'Institutional and department doctor visits will appear here.',
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: hospitalDoctors.length,
                        itemBuilder: (context, index) {
                          final call = hospitalDoctors[index];
                          return _buildDoctorCallCard(call, isDark);
                        },
                      ),

                // Tab 3: Clinic Doctors
                clinicDoctors.isEmpty
                    ? const EmptyStateView(
                        icon: Icons.medical_services_outlined,
                        title: 'No Clinic Visits Logged',
                        description: 'Private clinic and doctor chamber detailing calls will appear here.',
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: clinicDoctors.length,
                        itemBuilder: (context, index) {
                          final call = clinicDoctors[index];
                          return _buildDoctorCallCard(call, isDark);
                        },
                      ),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'dcr_fab',
        onPressed: () => _showNewCallTypeModal(context),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Log Doctor Visit', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildDoctorCallCard(DoctorCallReport call, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: Text(
                  call.doctorName,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurfaceVariant : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  DateFormatter.formatTime(call.callTime),
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 3),
          Text(
            '${call.doctorSpecialty} • ${call.clinicName}',
            style: const TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 6,
            runSpacing: 4,
            children: call.productsPromoted.map((p) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  '${p.brandName} (${p.focusLevel})',
                  style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600),
                ),
              );
            }).toList(),
          ),
          if (call.samplesGiven.isNotEmpty) ...[
            const SizedBox(height: 8),
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const Icon(Icons.medication_liquid_rounded, size: 14, color: AppColors.success),
                const SizedBox(width: 5),
                Expanded(
                  child: Text(
                    'Samples Given: ${call.samplesGiven.map((s) => '${s.brandName} (${s.quantity})').join(', ')}',
                    style: const TextStyle(fontSize: 11, color: AppColors.success, fontWeight: FontWeight.w600),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ],
          if (call.doctorFeedback.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              'Feedback: ${call.doctorFeedback}',
              style: TextStyle(
                fontSize: 11.5,
                fontStyle: FontStyle.italic,
                color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
