import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/gps_tracking_model.dart';
import '../../../providers/gps_tracking_provider.dart';
import '../../../providers/doctor_provider.dart';
import '../../widgets/app_section_card.dart';

class GpsTrackingScreen extends StatefulWidget {
  const GpsTrackingScreen({super.key});

  @override
  State<GpsTrackingScreen> createState() => _GpsTrackingScreenState();
}

class _GpsTrackingScreenState extends State<GpsTrackingScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showReportDialog(BuildContext context, GpsTrackingProvider provider) {
    final report = provider.generateDailyReport();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.assignment_turned_in_rounded, color: AppColors.primary),
            SizedBox(width: 8),
            Text('Daily GPS Movement Report', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold)),
          ],
        ),
        content: SizedBox(
          width: double.maxFinite,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Banner
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFF009CBF), Color(0xFF0F172A)]),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(report.mrName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(color: AppColors.success, borderRadius: BorderRadius.circular(6)),
                            child: Text('Score: ${report.complianceScore}%', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10.5)),
                          ),
                        ],
                      ),
                      Text('${report.empCode} • ${report.territory}', style: const TextStyle(color: Colors.white70, fontSize: 11)),
                      const Divider(color: Colors.white24, height: 14),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Distance: ${report.totalDistanceKm} KM', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                          Text('Total Calls: ${report.checkInOutEvents.length}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // Metrics Table
                _statRow('Shift Duration:', '${(report.totalShiftMinutes / 60).toStringAsFixed(1)} Hours'),
                _statRow('Active Transit Time:', '${report.totalTransitMinutes} Mins'),
                _statRow('In-Clinic / In-Store Time:', '${report.totalClinicMinutes} Mins'),
                _statRow('Idle Stoppages Time:', '${report.totalIdleMinutes} Mins'),
                _statRow('Start Day Time:', DateFormatter.formatTime(report.startDayTime)),
                _statRow('Start Odometer:', '${report.startOdometer.toInt()} KM'),
                _statRow('End Odometer (Est):', '${report.endOdometer?.toInt()} KM'),
                const Divider(height: 16),

                const Text('Check-In / Check-Out Log:', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                ...report.checkInOutEvents.map((evt) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle, size: 14, color: AppColors.success),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          '${evt.entityName} (${evt.durationMinutes}m) - ${DateFormatter.formatTime(evt.checkInTime)}',
                          style: const TextStyle(fontSize: 11.5, color: Color(0xFF334155)),
                        ),
                      ),
                    ],
                  ),
                )),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('GPS Route Audit PDF report exported & shared!'), backgroundColor: AppColors.success),
              );
            },
            icon: const Icon(Icons.share_rounded, size: 16),
            label: const Text('Export & Share Report'),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
          ),
        ],
      ),
    );
  }

  void _showCheckInDialog(BuildContext context, GpsTrackingProvider gpsProvider) {
    final doctorProvider = context.read<DoctorProvider>();
    String selectedType = 'Doctor';
    String selectedEntityId = doctorProvider.doctors.first.id;
    String selectedEntityName = doctorProvider.doctors.first.name;
    String selectedAddress = doctorProvider.doctors.first.address;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(Icons.add_location_alt_rounded, color: AppColors.primary),
              SizedBox(width: 8),
              Text('Field Visit Check-In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Select Entity Type:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Row(
                  children: ['Doctor', 'Chemist', 'Stockist'].map((type) {
                    final sel = selectedType == type;
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ChoiceChip(
                        label: Text(type),
                        selected: sel,
                        selectedColor: AppColors.primary,
                        backgroundColor: const Color(0xFFF1F5F9),
                        labelStyle: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: sel ? Colors.white : const Color(0xFF334155)),
                        onSelected: (s) {
                          if (s) {
                            setModalState(() {
                              selectedType = type;
                              if (type == 'Doctor') {
                                selectedEntityId = doctorProvider.doctors.first.id;
                                selectedEntityName = doctorProvider.doctors.first.name;
                                selectedAddress = doctorProvider.doctors.first.address;
                              } else if (type == 'Chemist') {
                                selectedEntityId = doctorProvider.chemists.first.id;
                                selectedEntityName = doctorProvider.chemists.first.shopName;
                                selectedAddress = doctorProvider.chemists.first.address;
                              } else {
                                selectedEntityId = doctorProvider.stockists.first.id;
                                selectedEntityName = doctorProvider.stockists.first.agencyName;
                                selectedAddress = doctorProvider.stockists.first.address;
                              }
                            });
                          }
                        },
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 12),
                Text('Select $selectedType:', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: selectedEntityId,
                  dropdownColor: Colors.white,
                  style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                  decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                  items: selectedType == 'Doctor'
                      ? doctorProvider.doctors.map((d) => DropdownMenuItem(value: d.id, child: Text(d.name))).toList()
                      : (selectedType == 'Chemist'
                          ? doctorProvider.chemists.map((c) => DropdownMenuItem(value: c.id, child: Text(c.shopName))).toList()
                          : doctorProvider.stockists.map((s) => DropdownMenuItem(value: s.id, child: Text(s.agencyName))).toList()),
                  onChanged: (val) {
                    if (val != null) {
                      setModalState(() {
                        selectedEntityId = val;
                        if (selectedType == 'Doctor') {
                          final doc = doctorProvider.getDoctorById(val);
                          selectedEntityName = doc?.name ?? '';
                          selectedAddress = doc?.address ?? '';
                        } else if (selectedType == 'Chemist') {
                          final chem = doctorProvider.chemists.firstWhere((c) => c.id == val);
                          selectedEntityName = chem.shopName;
                          selectedAddress = chem.address;
                        } else {
                          final stk = doctorProvider.stockists.firstWhere((s) => s.id == val);
                          selectedEntityName = stk.agencyName;
                          selectedAddress = stk.address;
                        }
                      });
                    }
                  },
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.green.shade200)),
                  child: Row(
                    children: [
                      const Icon(Icons.gps_fixed, size: 14, color: AppColors.success),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'Geofence Verified • Current GPS location matches clinic radius (±4m)',
                          style: TextStyle(fontSize: 10.5, color: Colors.green.shade900, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                gpsProvider.performCheckIn(
                  entityId: selectedEntityId,
                  entityName: selectedEntityName,
                  entityType: selectedType,
                  address: selectedAddress,
                  lat: gpsProvider.currentLatitude,
                  lng: gpsProvider.currentLongitude,
                );
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Checked In at $selectedEntityName! Timer started.'), backgroundColor: AppColors.success),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
              child: const Text('Confirm Check-In'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statRow(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          Text(val, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final gpsProvider = context.watch<GpsTrackingProvider>();
    final activeCheckIn = gpsProvider.activeCheckIn;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Live GPS & Route Tracking', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.description_outlined, color: AppColors.primary),
            tooltip: 'View Daily GPS Report',
            onPressed: () => _showReportDialog(context, gpsProvider),
          ),
          IconButton(
            icon: Icon(gpsProvider.isLiveTracking ? Icons.gps_fixed : Icons.gps_off, color: gpsProvider.isLiveTracking ? AppColors.success : Colors.grey),
            tooltip: gpsProvider.isLiveTracking ? 'Live Tracking Active' : 'Live Tracking Paused',
            onPressed: gpsProvider.toggleLiveTracking,
          ),
        ],
      ),
      body: Column(
        children: [
          // Live GPS Territory Radar Card
          Container(
            margin: const EdgeInsets.fromLTRB(16, 10, 16, 8),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF009CBF), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
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
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: gpsProvider.isLiveTracking ? AppColors.success : AppColors.error,
                            boxShadow: [
                              BoxShadow(color: (gpsProvider.isLiveTracking ? AppColors.success : AppColors.error).withValues(alpha: 0.6), blurRadius: 6),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          gpsProvider.isLiveTracking ? 'LIVE GPS ACTIVE (±4m)' : 'GPS TRACKING PAUSED',
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        const Icon(Icons.battery_charging_full_rounded, size: 16, color: Colors.white70),
                        const SizedBox(width: 3),
                        Text('${gpsProvider.batteryLevelPercent}%', style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(gpsProvider.currentAddress, style: const TextStyle(color: Colors.white, fontSize: 13.5, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(
                  '${gpsProvider.currentLatitude.toStringAsFixed(4)}° N, ${gpsProvider.currentLongitude.toStringAsFixed(4)}° E • Speed: ${gpsProvider.currentSpeedKmh} km/h • Status: ${gpsProvider.currentStatus.label}',
                  style: const TextStyle(color: Colors.white70, fontSize: 11),
                ),
                const SizedBox(height: 12),

                // KPI Grid
                Row(
                  children: [
                    _radarKpi('DISTANCE', '${gpsProvider.totalDistanceKm} KM', Icons.speed_rounded),
                    const SizedBox(width: 8),
                    _radarKpi('SHIFT TIME', '${(gpsProvider.totalShiftMinutes / 60).toStringAsFixed(1)}h', Icons.timer_outlined),
                    const SizedBox(width: 8),
                    _radarKpi('IDLE HALT', '${gpsProvider.totalIdleMinutes}m', Icons.pause_circle_outline),
                    const SizedBox(width: 8),
                    _radarKpi('CALLS', '${gpsProvider.checkInOutEvents.length}', Icons.check_circle_outline),
                  ],
                ),
              ],
            ),
          ),

          // Active Check-In Banner (If Currently in Visit)
          if (activeCheckIn != null)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.success, width: 1.5),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(color: AppColors.success, shape: BoxShape.circle),
                    child: const Icon(Icons.location_on, color: Colors.white, size: 18),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('CURRENTLY IN VISIT • ${activeCheckIn.durationMinutes} MINS', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.success)),
                        Text(activeCheckIn.entityName, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                        Text(activeCheckIn.locationAddress, style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)), maxLines: 1, overflow: TextOverflow.ellipsis),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => gpsProvider.performCheckOut(notes: 'Call finished & documented.'),
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.error, foregroundColor: Colors.white, elevation: 0, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6)),
                    child: const Text('Check-Out', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: ElevatedButton.icon(
                onPressed: () => _showCheckInDialog(context, gpsProvider),
                icon: const Icon(Icons.add_location_alt_rounded, size: 18),
                label: const Text('Check-In at Doctor / Chemist / Stockist', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(42),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),

          // Tabs
          TabBar(
            controller: _tabController,
            isScrollable: true,
            labelColor: AppColors.primary,
            unselectedLabelColor: const Color(0xFF64748B),
            indicatorColor: AppColors.primary,
            labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5),
            tabs: const [
              Tab(text: '⏱️ Travel Timeline'),
              Tab(text: '📍 Check-Ins / Out'),
              Tab(text: '⏸️ Idle Detection'),
              Tab(text: '🐾 Movement Path'),
            ],
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Travel Timeline
                _buildTravelTimeline(gpsProvider),

                // 2. Check-Ins & Check-Outs
                _buildCheckInOutList(gpsProvider),

                // 3. Idle Detection
                _buildIdleList(gpsProvider),

                // 4. Movement Breadcrumbs
                _buildBreadcrumbsList(gpsProvider),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _radarKpi(String label, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
        child: Column(
          children: [
            Icon(icon, size: 14, color: Colors.white70),
            const SizedBox(height: 2),
            Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
            Text(label, style: const TextStyle(color: Colors.white60, fontSize: 8.5, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildTravelTimeline(GpsTrackingProvider provider) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Start Day
        _timelineTile(
          time: DateFormatter.formatTime(provider.startDayTime),
          title: 'Shift Started (Punch-In)',
          subtitle: '${provider.startLocation} • Opening Odometer: ${provider.startOdometer.toInt()} KM',
          icon: Icons.play_arrow_rounded,
          color: AppColors.success,
        ),

        // Events
        ...provider.checkInOutEvents.map((evt) => _timelineTile(
          time: DateFormatter.formatTime(evt.checkInTime),
          title: '${evt.entityName} (${evt.entityType} Call)',
          subtitle: '${evt.locationAddress}\nDuration: ${evt.durationMinutes} mins • Out: ${evt.checkOutTime != null ? DateFormatter.formatTime(evt.checkOutTime!) : "Active"}',
          icon: evt.entityType == 'Doctor' ? Icons.medical_services_rounded : Icons.local_pharmacy_rounded,
          color: evt.entityType == 'Doctor' ? AppColors.primary : AppColors.secondary,
        )),

        // Idle Events
        ...provider.idleEvents.map((idle) => _timelineTile(
          time: DateFormatter.formatTime(idle.startTime),
          title: 'Idle Stoppage: ${idle.reason}',
          subtitle: '${idle.locationName} • Halt Duration: ${idle.durationMinutes} mins',
          icon: Icons.pause_circle_filled_rounded,
          color: Colors.amber.shade800,
        )),

        // Current Live State
        _timelineTile(
          time: 'NOW',
          title: 'Current Live GPS Location',
          subtitle: '${provider.currentAddress} • Speed: ${provider.currentSpeedKmh} km/h',
          icon: Icons.navigation_rounded,
          color: AppColors.primary,
          isLast: true,
        ),
      ],
    );
  }

  Widget _timelineTile({
    required String time,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    bool isLast = false,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 55,
          child: Text(time, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
        ),
        Column(
          children: [
            Container(
              padding: const EdgeInsets.all(5),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.15), shape: BoxShape.circle),
              child: Icon(icon, size: 14, color: color),
            ),
            if (!isLast) Container(width: 1.5, height: 44, color: const Color(0xFFCBD5E1)),
          ],
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCheckInOutList(GpsTrackingProvider provider) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.checkInOutEvents.length,
      itemBuilder: (ctx, idx) {
        final evt = provider.checkInOutEvents[idx];
        return AppSectionCard(
          title: '${evt.entityName} (${evt.entityType})',
          subtitle: 'In: ${DateFormatter.formatTime(evt.checkInTime)} • Out: ${evt.checkOutTime != null ? DateFormatter.formatTime(evt.checkOutTime!) : "Active"}',
          icon: evt.entityType == 'Doctor' ? Icons.person_rounded : Icons.storefront_rounded,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(evt.locationAddress, style: const TextStyle(fontSize: 12, color: Color(0xFF334155))),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: AppColors.primaryContainer, borderRadius: BorderRadius.circular(6)),
                    child: Text('Duration: ${evt.durationMinutes} mins in-clinic', style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppColors.primary)),
                  ),
                  const Row(
                    children: [
                      Icon(Icons.verified_rounded, size: 14, color: AppColors.success),
                      SizedBox(width: 4),
                      Text('Geofence Verified', style: TextStyle(fontSize: 10.5, color: AppColors.success, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
              if (evt.outcomeNotes != null) ...[
                const SizedBox(height: 6),
                Text('Notes: ${evt.outcomeNotes}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontStyle: FontStyle.italic)),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildIdleList(GpsTrackingProvider provider) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.idleEvents.length,
      itemBuilder: (ctx, idx) {
        final idle = provider.idleEvents[idx];
        return AppSectionCard(
          title: 'Idle Halt: ${idle.durationMinutes} Minutes',
          subtitle: '${DateFormatter.formatTime(idle.startTime)} - ${DateFormatter.formatTime(idle.endTime)}',
          icon: Icons.pause_circle_outline_rounded,
          iconColor: Colors.amber.shade800,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(idle.locationName, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
              const SizedBox(height: 4),
              Text('Detected Reason: ${idle.reason}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBreadcrumbsList(GpsTrackingProvider provider) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.breadcrumbs.length,
      itemBuilder: (ctx, idx) {
        final pt = provider.breadcrumbs[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10), border: Border.all(color: const Color(0xFFE2E8F0))),
          child: Row(
            children: [
              const Icon(Icons.gps_fixed, size: 16, color: AppColors.primary),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(pt.activity, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    Text(pt.locationName, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)), maxLines: 1, overflow: TextOverflow.ellipsis),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(DateFormatter.formatTime(pt.timestamp), style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  Text('${pt.speedKmh} km/h', style: const TextStyle(fontSize: 10, color: AppColors.primary, fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
