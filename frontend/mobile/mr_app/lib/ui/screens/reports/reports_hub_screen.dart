import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../providers/dcr_provider.dart';
import '../../../providers/sales_provider.dart';
import '../../../providers/expense_provider.dart';
import '../../../providers/gps_tracking_provider.dart';
import '../../../providers/sample_provider.dart';
import '../../../providers/auth_provider.dart';
import '../../widgets/app_section_card.dart';

class RealTimeReportsScreen extends StatefulWidget {
  const RealTimeReportsScreen({super.key});

  @override
  State<RealTimeReportsScreen> createState() => _RealTimeReportsScreenState();
}

class _RealTimeReportsScreenState extends State<RealTimeReportsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedPeriod = 'Daily (Today)'; // 'Daily (Today)', 'Weekly (This Week)', 'Monthly (MTD)'

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showReportDetailModal(BuildContext context, String reportTitle, String subtitle, Widget content) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.analytics_rounded, color: AppColors.primary),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(reportTitle, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                ],
              ),
            ),
          ],
        ),
        content: SizedBox(
          width: double.maxFinite,
          child: SingleChildScrollView(child: content),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('$reportTitle exported to PDF & shared with Management!'), backgroundColor: AppColors.success),
              );
            },
            icon: const Icon(Icons.share_rounded, size: 16),
            label: const Text('Export & Share PDF'),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final dcrProvider = context.watch<DcrProvider>();
    final salesProvider = context.watch<SalesProvider>();
    final expenseProvider = context.watch<ExpenseProvider>();
    final gpsProvider = context.watch<GpsTrackingProvider>();
    final sampleProvider = context.watch<SampleProvider>();
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.currentUser;
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
        title: const Text('Real-Time Reporting Hub', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.print_outlined, color: AppColors.primary),
            tooltip: 'Export Master Audit Report',
            onPressed: () => _showReportDetailModal(
              context,
              'Executive Master Audit Report',
              '${user.name} • ${user.territory}',
              _buildMasterReportContent(dcrProvider, salesProvider, expenseProvider, gpsProvider, sampleProvider, user),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Executive Summary Banner
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
                    Text('EXECUTIVE REAL-TIME REPORTING', style: const TextStyle(color: Colors.white70, fontSize: 10.5, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: AppColors.success, borderRadius: BorderRadius.circular(6)),
                      child: const Text('Live Sync: Active', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(CurrencyFormatter.formatInr(salesProvider.currentMonthAchievedSales), style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800)),
                    Text('${salesProvider.targetAchievementPercentage.toStringAsFixed(1)}% Sales Target Achieved', style: const TextStyle(color: Colors.amberAccent, fontSize: 11.5, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _kpiPill('CALLS DONE', '${dcrProvider.completedDoctorCallsCount} / 12', Icons.phone_in_talk_rounded),
                    const SizedBox(width: 8),
                    _kpiPill('POB BOOKED', CurrencyFormatter.formatCompactInr(dcrProvider.todayPobTotal), Icons.shopping_cart_rounded),
                    const SizedBox(width: 8),
                    _kpiPill('GPS DISTANCE', '${gpsProvider.totalDistanceKm} KM', Icons.speed_rounded),
                    const SizedBox(width: 8),
                    _kpiPill('CLAIMS', CurrencyFormatter.formatCompactInr(expenseProvider.currentMonthExpenseTotal), Icons.receipt_long_rounded),
                  ],
                ),
              ],
            ),
          ),

          // Period Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              children: ['Daily (Today)', 'Weekly (This Week)', 'Monthly (MTD)'].map((p) {
                final sel = _selectedPeriod == p;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(p),
                    selected: sel,
                    selectedColor: AppColors.primary,
                    backgroundColor: Colors.white,
                    side: BorderSide(color: sel ? AppColors.primary : const Color(0xFFE2E8F0)),
                    labelStyle: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: sel ? Colors.white : const Color(0xFF334155)),
                    onSelected: (s) => s ? setState(() => _selectedPeriod = p) : null,
                  ),
                );
              }).toList(),
            ),
          ),

          // Tab Navigation Bar
          TabBar(
            controller: _tabController,
            isScrollable: true,
            labelColor: AppColors.primary,
            unselectedLabelColor: const Color(0xFF64748B),
            indicatorColor: AppColors.primary,
            labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
            tabs: const [
              Tab(text: '📊 Dashboard Charts'),
              Tab(text: '📅 Daily & Weekly'),
              Tab(text: '🩺 Visits & Calls'),
              Tab(text: '💰 Sales & Target'),
              Tab(text: '🧾 Expense & Attendance'),
            ],
          ),

          // Tab Content Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Dashboard Charts & Visual Analytics
                _buildDashboardChartsTab(salesProvider, dcrProvider, gpsProvider),

                // 2. Daily & Weekly Reports
                _buildDailyWeeklyTab(dcrProvider, salesProvider, gpsProvider, expenseProvider, user),

                // 3. Visit & Call Reports
                _buildVisitsCallsTab(dcrProvider, gpsProvider),

                // 4. Sales & Target Achievement Reports
                _buildSalesTargetTab(salesProvider),

                // 5. Expense & Attendance Reports
                _buildExpenseAttendanceTab(expenseProvider, user, gpsProvider),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _kpiPill(String label, String val, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
        child: Column(
          children: [
            Icon(icon, size: 13, color: Colors.white70),
            const SizedBox(height: 2),
            Text(val, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
            Text(label, style: const TextStyle(color: Colors.white60, fontSize: 7.5, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  // TAB 1: Dashboard Charts
  Widget _buildDashboardChartsTab(SalesProvider sales, DcrProvider dcr, GpsTrackingProvider gps) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // 1. Weekly Call Velocity Chart
        AppSectionCard(
          title: 'Weekly Call Execution Velocity',
          subtitle: 'Daily doctor visits vs company benchmark (12/day)',
          icon: Icons.bar_chart_rounded,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  _barColumn('Mon', 12, 12, true),
                  _barColumn('Tue', 11, 12, false),
                  _barColumn('Wed', 14, 12, true),
                  _barColumn('Thu', 10, 12, false),
                  _barColumn('Fri', 13, 12, true),
                  _barColumn('Sat', 8, 8, true),
                ],
              ),
              const Divider(height: 16),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Weekly Target: 68 Calls', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                  Text('Achieved: 68 Calls (100%)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.success)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // 2. Product Revenue Distribution Chart
        AppSectionCard(
          title: 'Product Revenue Portfolio Share',
          subtitle: 'Brand-wise secondary sales distribution',
          icon: Icons.pie_chart_rounded,
          child: Column(
            children: sales.productWiseSales.map((p) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(p.productName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
                      Text('${CurrencyFormatter.formatInr(p.totalRevenue)} (${p.percentageShare.toStringAsFixed(1)}%)', style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: (p.percentageShare / 100).clamp(0.0, 1.0),
                      backgroundColor: const Color(0xFFF1F5F9),
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF009CBF)),
                      minHeight: 5,
                    ),
                  ),
                ],
              ),
            )).toList(),
          ),
        ),
        const SizedBox(height: 12),

        // 3. Field Time Allocation Chart
        AppSectionCard(
          title: 'MR Field Time Allocation',
          subtitle: 'In-clinic interaction vs transit vs idle stoppages',
          icon: Icons.timelapse_rounded,
          child: Column(
            children: [
              _timeAllocationRow('In-Clinic Detailing', '${gps.totalInClinicMinutes} Mins (54%)', AppColors.primary, 0.54),
              const SizedBox(height: 8),
              _timeAllocationRow('Active Territory Transit', '${gps.totalTransitMinutes} Mins (32%)', const Color(0xFF009CBF), 0.32),
              const SizedBox(height: 8),
              _timeAllocationRow('Traffic & Waiting Stoppages', '${gps.totalIdleMinutes} Mins (14%)', Colors.amber.shade700, 0.14),
            ],
          ),
        ),
      ],
    );
  }

  Widget _barColumn(String day, int actual, int target, bool isMet) {
    final height = (actual / 15) * 80;
    return Column(
      children: [
        Text('$actual', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isMet ? AppColors.success : const Color(0xFF64748B))),
        const SizedBox(height: 4),
        Container(
          width: 24,
          height: height.clamp(20.0, 80.0),
          decoration: BoxDecoration(
            color: isMet ? AppColors.primary : const Color(0xFF94A3B8),
            borderRadius: BorderRadius.circular(6),
          ),
        ),
        const SizedBox(height: 6),
        Text(day, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF334155))),
      ],
    );
  }

  Widget _timeAllocationRow(String label, String val, Color col, double pct) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Color(0xFF334155))),
            Text(val, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: col)),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(value: pct, backgroundColor: const Color(0xFFF1F5F9), valueColor: AlwaysStoppedAnimation<Color>(col), minHeight: 4.5),
        ),
      ],
    );
  }

  // TAB 2: Daily & Weekly Reports
  Widget _buildDailyWeeklyTab(DcrProvider dcr, SalesProvider sales, GpsTrackingProvider gps, ExpenseProvider exp, dynamic user) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Daily Report Card
        AppSectionCard(
          title: 'Daily DCR Performance Report',
          subtitle: 'Today\'s coverage, order booking & route audit',
          icon: Icons.today_rounded,
          child: Column(
            children: [
              _statTile('Doctors Visited Today', '${dcr.completedDoctorCallsCount} / 12 Calls', AppColors.primary),
              _statTile('Chemist Stores Visited', '${dcr.completedChemistCallsCount} / 5 Stores', AppColors.secondary),
              _statTile('POB Order Value Booked', CurrencyFormatter.formatInr(dcr.todayPobTotal), AppColors.success),
              _statTile('Field Distance Travelled', '${gps.totalDistanceKm} KM', const Color(0xFF009CBF)),
              _statTile('Today\'s Expense Claim', CurrencyFormatter.formatInr(exp.expenses.isNotEmpty ? exp.expenses.first.grandTotal : 440.0), Colors.amber.shade900),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Weekly Report Card
        AppSectionCard(
          title: 'Weekly Cumulative Performance Report',
          subtitle: '7-day territory sales velocity & call target tracking',
          icon: Icons.date_range_rounded,
          child: Column(
            children: [
              _statTile('Total Weekly Calls Completed', '68 Calls (100% Target Met)', AppColors.success),
              _statTile('Weekly Secondary Orders', '\$1,285 Booked', AppColors.primary),
              _statTile('Weekly Distance Covered', '214.6 KM', const Color(0xFF009CBF)),
              _statTile('Weekly Approved Expenses', '\$129.50 (Settled)', Colors.teal),
              _statTile('Tour Plan Deviations', '0 Pending Deviations', AppColors.success),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Monthly Summary
        AppSectionCard(
          title: 'Monthly MTP Review Report',
          subtitle: 'August 2026 Monthly Field Force Summary',
          icon: Icons.calendar_month_rounded,
          child: Column(
            children: [
              _statTile('Doctor Coverage Ratio', '94.2% (142 / 160 Core Doctors)', AppColors.primary),
              _statTile('Chemist Coverage Ratio', '96.0% (48 / 50 Counters)', AppColors.secondary),
              _statTile('MTD Sales Achieved', '${CurrencyFormatter.formatInr(sales.currentMonthAchievedSales)} (97.4%)', AppColors.success),
              _statTile('Monthly Expense Claims', CurrencyFormatter.formatInr(exp.currentMonthExpenseTotal), Colors.amber.shade900),
            ],
          ),
        ),
      ],
    );
  }

  // TAB 3: Visit & Call Reports
  Widget _buildVisitsCallsTab(DcrProvider dcr, GpsTrackingProvider gps) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        AppSectionCard(
          title: 'Doctor Visit & Geofence Audit Report',
          subtitle: 'Time spent in chamber, geolocation match & status',
          icon: Icons.medical_services_rounded,
          child: Column(
            children: gps.checkInOutEvents.map((evt) => Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(10)),
              child: Row(
                children: [
                  const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${evt.entityName} (${evt.entityType})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
                        Text('${evt.durationMinutes} mins in-clinic • In: ${DateFormatter.formatTime(evt.checkInTime)}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(5)),
                    child: const Text('Geofence ±4m', style: TextStyle(color: AppColors.success, fontSize: 9.5, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            )).toList(),
          ),
        ),
        const SizedBox(height: 12),

        AppSectionCard(
          title: 'Detailed DCR Call Promoted Products',
          subtitle: 'Primary, Secondary and Focus Molecules detailed',
          icon: Icons.assignment_rounded,
          child: Column(
            children: [
              _statTile('CardioVasc-AM (Cardiology)', '12 Doctor Detailings', AppColors.primary),
              _statTile('GlycoSmart-D10 (Diabetology)', '10 Doctor Detailings', AppColors.secondary),
              _statTile('Neurolin-Plus (Neurology)', '8 Doctor Detailings', const Color(0xFF009CBF)),
              _statTile('GastroShield-D (Gastro)', '6 Doctor Detailings', Colors.amber.shade900),
            ],
          ),
        ),
      ],
    );
  }

  // TAB 4: Sales & Target Achievement
  Widget _buildSalesTargetTab(SalesProvider sales) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        AppSectionCard(
          title: 'Target Achievement Report',
          subtitle: 'MR monthly targets vs actual secondary achievement',
          icon: Icons.track_changes_rounded,
          child: Column(
            children: [
              _statTile('Monthly Revenue Target', CurrencyFormatter.formatInr(sales.monthlyTarget), const Color(0xFF0F172A)),
              _statTile('Achieved Revenue (MTD)', CurrencyFormatter.formatInr(sales.currentMonthAchievedSales), AppColors.success),
              _statTile('Target Achievement %', '${sales.targetAchievementPercentage.toStringAsFixed(1)}% (On Track)', AppColors.primary),
              _statTile('Total Invoices Billed', '${sales.totalInvoicesCount} Tax Invoices', const Color(0xFF009CBF)),
              _statTile('Total Units Sold', '${sales.totalUnitsSold} Pcs', Colors.teal),
            ],
          ),
        ),
        const SizedBox(height: 12),

        AppSectionCard(
          title: 'Product Performance Report',
          subtitle: 'Volume, revenue share & growth percentage',
          icon: Icons.inventory_2_rounded,
          child: Column(
            children: sales.productWiseSales.map((p) => _statTile(
              p.productName,
              '${CurrencyFormatter.formatInr(p.totalRevenue)} (+${p.growthPercentage}%)',
              AppColors.primary,
            )).toList(),
          ),
        ),
      ],
    );
  }

  // TAB 5: Expense & Attendance Reports
  Widget _buildExpenseAttendanceTab(ExpenseProvider exp, dynamic user, GpsTrackingProvider gps) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        AppSectionCard(
          title: 'Monthly Expense Audit Report',
          subtitle: 'Fixed DA, TA rates, lodging, meals & reimbursement status',
          icon: Icons.receipt_long_rounded,
          child: Column(
            children: [
              _statTile('Total Monthly Claimed', CurrencyFormatter.formatUsd(exp.currentMonthExpenseTotal), const Color(0xFF0F172A)),
              _statTile('Approved Claims Total', CurrencyFormatter.formatUsd(exp.approvedExpenseTotal), AppColors.success),
              _statTile('Pending Manager Review', CurrencyFormatter.formatUsd(exp.pendingExpenseTotal), Colors.amber.shade900),
              _statTile('Settled / Credited to Bank', '\$144.00', Colors.teal),
            ],
          ),
        ),
        const SizedBox(height: 12),

        AppSectionCard(
          title: 'Attendance & Geo-Punch Shift Report',
          subtitle: 'Odometer starting/ending and shift duration log',
          icon: Icons.access_time_rounded,
          child: Column(
            children: [
              _statTile('Punch-In Status', user.isPunchedIn ? 'Punched In (Active)' : 'Punched Out', user.isPunchedIn ? AppColors.success : AppColors.error),
              _statTile('Shift Start Time', DateFormatter.formatTime(gps.startDayTime), AppColors.primary),
              _statTile('Starting Odometer', '${gps.startOdometer.toInt()} KM', const Color(0xFF0F172A)),
              _statTile('Today\'s Shift Duration', '${(gps.totalShiftMinutes / 60).toStringAsFixed(1)} Hours', const Color(0xFF009CBF)),
              _statTile('Punctuality Score', '98.5% On-Time', AppColors.success),
            ],
          ),
        ),
      ],
    );
  }

  Widget _statTile(String label, String val, Color col) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          Text(val, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: col)),
        ],
      ),
    );
  }

  Widget _buildMasterReportContent(DcrProvider dcr, SalesProvider sales, ExpenseProvider exp, GpsTrackingProvider gps, SampleProvider sample, dynamic user) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFF009CBF), Color(0xFF0F172A)]),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(user.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
              Text('${user.designation} • ${user.territory}', style: const TextStyle(color: Colors.white70, fontSize: 11)),
              const Divider(color: Colors.white24, height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Sales: ${CurrencyFormatter.formatCompactInr(sales.currentMonthAchievedSales)}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                  Text('Compliance: 98%', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        _statTile('Doctor Coverage MTD', '142 / 160 Core Doctors', AppColors.primary),
        _statTile('Sales Target Achievement', '${sales.targetAchievementPercentage.toStringAsFixed(1)}%', AppColors.success),
        _statTile('POB Order Booking', CurrencyFormatter.formatInr(dcr.todayPobTotal), const Color(0xFF009CBF)),
        _statTile('Sample Bag Balance', '${sample.totalBagStockCount} Units', Colors.amber.shade900),
        _statTile('Expense Claims Total', CurrencyFormatter.formatInr(exp.currentMonthExpenseTotal), Colors.teal),
        _statTile('Total Field Distance', '${gps.totalDistanceKm} KM', const Color(0xFF0F172A)),
      ],
    );
  }
}
