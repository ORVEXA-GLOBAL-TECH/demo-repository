import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/utils/responsive.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/dcr_provider.dart';
import '../../../providers/locale_provider.dart';
import '../master_directory/directory_home_screen.dart';
import '../dcr/call_history_screen.dart';
import '../../widgets/eagle_core_values_slider.dart';

class MrDashboardTab extends StatefulWidget {
  final Function(int tabIndex)? onNavigateTab;

  const MrDashboardTab({super.key, this.onNavigateTab});

  @override
  State<MrDashboardTab> createState() => _MrDashboardTabState();
}

class _MrDashboardTabState extends State<MrDashboardTab> {
  bool _isWorking = false;
  DateTime? _workStartTime;
  Timer? _timer;
  String _workingHoursString = 'No working hours data';

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    if (auth.currentUser.isPunchedIn) {
      _isWorking = true;
      _workStartTime = auth.currentUser.punchInTime ?? DateTime.now();
      _startDurationTimer();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startDurationTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_workStartTime != null && mounted) {
        final diff = DateTime.now().difference(_workStartTime!);
        final hours = diff.inHours.toString().padLeft(2, '0');
        final mins = (diff.inMinutes % 60).toString().padLeft(2, '0');
        final secs = (diff.inSeconds % 60).toString().padLeft(2, '0');
        setState(() {
          _workingHoursString = '${hours}h ${mins}m ${secs}s';
        });
      }
    });
  }

  void _toggleWorkStatus() {
    final auth = context.read<AuthProvider>();
    final loc = context.read<LocaleProvider>();

    if (!_isWorking) {
      // Start Work
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              const Icon(Icons.play_circle_fill_rounded, color: Color(0xFF00C9A7), size: 28),
              const SizedBox(width: 10),
              Text(loc.translate('start_work_title'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ],
          ),
          content: Text(
            loc.translate('start_work_desc'),
            style: const TextStyle(fontSize: 13.5, color: Color(0xFF475569)),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: Text(loc.translate('cancel'))),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00C9A7),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                final now = DateTime.now();
                auth.punchIn(location: 'South Zone - Field HQ');
                setState(() {
                  _isWorking = true;
                  _workStartTime = now;
                  _startDurationTimer();
                });
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('${loc.translate('working_in_field')} - ${_formatTime(now)}!'),
                    backgroundColor: const Color(0xFF00C9A7),
                  ),
                );
              },
              child: Text(loc.translate('start_work')),
            ),
          ],
        ),
      );
    } else {
      // End Work
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              const Icon(Icons.stop_circle_rounded, color: Color(0xFFE53935), size: 28),
              const SizedBox(width: 10),
              Text(loc.translate('end_work_title'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ],
          ),
          content: Text(
            'Active: $_workingHoursString',
            style: const TextStyle(fontSize: 13.5, color: Color(0xFF475569)),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: Text(loc.translate('keep_working'))),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE53935),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                auth.punchOut();
                _timer?.cancel();
                setState(() {
                  _isWorking = false;
                  _workStartTime = null;
                  _workingHoursString = 'No working hours data';
                });
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('${loc.translate('end_work')} OK!'),
                    backgroundColor: const Color(0xFF10B981),
                  ),
                );
              },
              child: Text(loc.translate('end_punch_out')),
            ),
          ],
        ),
      );
    }
  }

  String _formatTime(DateTime dt) {
    final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final period = dt.hour >= 12 ? 'PM' : 'AM';
    final minute = dt.minute.toString().padLeft(2, '0');
    return '${hour.toString().padLeft(2, '0')}:$minute $period';
  }

  @override
  Widget build(BuildContext context) {
    final doctorProvider = context.watch<DoctorProvider>();
    final dcrProvider = context.watch<DcrProvider>();
    final localeProvider = context.watch<LocaleProvider>();

    final totalDoctors = doctorProvider.doctors.isNotEmpty ? doctorProvider.doctors.length : 134;
    final totalChemists = doctorProvider.chemists.isNotEmpty ? doctorProvider.chemists.length : 44;
    final sevenDaysCalls = dcrProvider.todayDcr.doctorCalls.length;
    final thirtyDaysCalls = 31;

    final hp = Responsive.horizontalPadding(context);
    final vp = Responsive.verticalPadding(context);
    final isTablet = Responsive.isTablet(context);

    return RefreshIndicator(
      onRefresh: () async {
        await Future.delayed(const Duration(milliseconds: 400));
      },
      child: ListView(
        padding: EdgeInsets.fromLTRB(hp, vp, hp, 24),
        children: [
          // 1. Our E.A.G.L.E. Core Values Sliding Cards
          const EagleCoreValuesSlider(),
          const SizedBox(height: 18),

          // 2. Stat Cards Grid — 2 cols on phone, 4 cols on tablet
          if (isTablet)
            Row(
              children: [
                Expanded(child: _buildStatCard(title: localeProvider.translate('stat_doctors'), value: '$totalDoctors', gradient: const LinearGradient(colors: [Color(0xFFFFB800), Color(0xFFFFA000)], begin: Alignment.topLeft, end: Alignment.bottomRight), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const DirectoryHomeScreen())))),
                SizedBox(width: hp * 0.6),
                Expanded(child: _buildStatCard(title: localeProvider.translate('stat_chemist'), value: '$totalChemists', gradient: const LinearGradient(colors: [Color(0xFF00D2D3), Color(0xFF00B4D8)], begin: Alignment.topLeft, end: Alignment.bottomRight), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const DirectoryHomeScreen())))),
                SizedBox(width: hp * 0.6),
                Expanded(child: _buildStatCard(title: localeProvider.translate('stat_7_days'), value: '$sevenDaysCalls', gradient: const LinearGradient(colors: [Color(0xFFFF7675), Color(0xFFFF5252)], begin: Alignment.topLeft, end: Alignment.bottomRight), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CallHistoryScreen())))),
                SizedBox(width: hp * 0.6),
                Expanded(child: _buildStatCard(title: localeProvider.translate('stat_30_days'), value: '$thirtyDaysCalls', gradient: const LinearGradient(colors: [Color(0xFF74B9FF), Color(0xFF5352ED)], begin: Alignment.topLeft, end: Alignment.bottomRight), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CallHistoryScreen())))),
              ],
            )
          else ...[  
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    title: localeProvider.translate('stat_doctors'),
                    value: '$totalDoctors',
                    gradient: const LinearGradient(colors: [Color(0xFFFFB800), Color(0xFFFFA000)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const DirectoryHomeScreen())),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    title: localeProvider.translate('stat_chemist'),
                    value: '$totalChemists',
                    gradient: const LinearGradient(colors: [Color(0xFF00D2D3), Color(0xFF00B4D8)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const DirectoryHomeScreen())),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    title: localeProvider.translate('stat_7_days'),
                    value: '$sevenDaysCalls',
                    gradient: const LinearGradient(colors: [Color(0xFFFF7675), Color(0xFFFF5252)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CallHistoryScreen())),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    title: localeProvider.translate('stat_30_days'),
                    value: '$thirtyDaysCalls',
                    gradient: const LinearGradient(colors: [Color(0xFF74B9FF), Color(0xFF5352ED)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CallHistoryScreen())),
                  ),
                ),
              ],
            ),
          ],
          const SizedBox(height: 18),

          // 3. Work Status Dark Slate Glassmorphic Card
          _buildWorkStatusCard(localeProvider),
          const SizedBox(height: 20),

          // 4. Start Work Vibrant Action Button
          _buildStartWorkButton(localeProvider),
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required LinearGradient gradient,
    required VoidCallback onTap,
  }) {
    return LayoutBuilder(builder: (context, constraints) {
      final cardHeight = Responsive.isTablet(context) ? 110.0 : 100.0;
      final titleFs = Responsive.sp(context, 12.5);
      final valueFs = Responsive.sp(context, 24);
      return Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(18),
          child: Ink(
            height: cardHeight,
            decoration: BoxDecoration(
              gradient: gradient,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: gradient.colors.last.withValues(alpha: 0.35),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Stack(
              children: [
                Positioned(
                  bottom: -6,
                  left: 0,
                  right: 0,
                  child: CustomPaint(
                    size: const Size(double.infinity, 38),
                    painter: _WaveLinePainter(),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        title,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: titleFs,
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFF0F172A),
                          letterSpacing: -0.2,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        value,
                        style: TextStyle(
                          fontSize: valueFs,
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF0F172A),
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    });
  }

  Widget _buildWorkStatusCard(LocaleProvider loc) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF132238),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF203657), width: 1.2),
        boxShadow: const [
          BoxShadow(
            color: Color(0x1F0B172E),
            blurRadius: 16,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  loc.translate('work_status'),
                  style: const TextStyle(
                    fontSize: 11,
                    letterSpacing: 1.2,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF8E9CB2),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _isWorking ? loc.translate('working_in_field') : loc.translate('no_work_started'),
                  style: TextStyle(
                    fontSize: 16.5,
                    fontWeight: FontWeight.w900,
                    color: _isWorking ? const Color(0xFF00C9A7) : Colors.white,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 12),
                Text(
                  loc.translate('started_at'),
                  style: const TextStyle(
                    fontSize: 10.5,
                    letterSpacing: 1.1,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF8E9CB2),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  _workStartTime != null ? _formatTime(_workStartTime!) : '--:--',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _isWorking ? 'Active: $_workingHoursString' : loc.translate('no_working_hours'),
                  style: const TextStyle(
                    fontSize: 11.5,
                    color: Color(0xFF8E9CB2),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),

          // Clock dial widget
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: const Color(0xFF1B2E4B),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF2C4872), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.25),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                CustomPaint(
                  size: const Size(100, 100),
                  painter: _ClockDialPainter(),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      loc.translate('today'),
                      style: const TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                        color: Color(0xFF8E9CB2),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      loc.translate('live'),
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: _isWorking ? const Color(0xFF00C9A7) : const Color(0xFF00B4D8),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: (_isWorking ? const Color(0xFF00C9A7) : const Color(0xFF00B4D8)).withValues(alpha: 0.7),
                            blurRadius: 6,
                            spreadRadius: 1.5,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStartWorkButton(LocaleProvider loc) {
    return Container(
      width: double.infinity,
      height: 54,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: LinearGradient(
          colors: _isWorking
              ? const [Color(0xFFE53935), Color(0xFFD32F2F)]
              : const [Color(0xFF00C9A7), Color(0xFF00B4D8)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        boxShadow: [
          BoxShadow(
            color: (_isWorking ? const Color(0xFFE53935) : const Color(0xFF00C9A7)).withValues(alpha: 0.4),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: _toggleWorkStatus,
          borderRadius: BorderRadius.circular(22),
          child: Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _isWorking ? Icons.stop_rounded : Icons.play_arrow_rounded,
                  color: Colors.white,
                  size: 26,
                ),
                const SizedBox(width: 8),
                Text(
                  _isWorking ? loc.translate('end_work') : loc.translate('start_work'),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.1,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _WaveLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.35)
      ..strokeWidth = 1.8
      ..style = PaintingStyle.stroke;

    final path = Path();
    path.moveTo(0, size.height * 0.7);
    path.quadraticBezierTo(size.width * 0.25, size.height * 0.2, size.width * 0.5, size.height * 0.6);
    path.quadraticBezierTo(size.width * 0.75, size.height * 0.9, size.width, size.height * 0.3);

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ClockDialPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Clock tick markers
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
