import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mr_reporting_app/main.dart';
import 'package:mr_reporting_app/models/dcr_model.dart';
import 'package:mr_reporting_app/models/expense_model.dart';
import 'package:mr_reporting_app/models/sales_entry_model.dart';
import 'package:mr_reporting_app/models/leave_model.dart';
import 'package:mr_reporting_app/providers/dcr_provider.dart';
import 'package:mr_reporting_app/providers/order_provider.dart';
import 'package:mr_reporting_app/providers/doctor_provider.dart';
import 'package:mr_reporting_app/providers/expense_provider.dart';
import 'package:mr_reporting_app/providers/tour_plan_provider.dart';
import 'package:mr_reporting_app/providers/gps_tracking_provider.dart';
import 'package:mr_reporting_app/providers/sales_provider.dart';
import 'package:mr_reporting_app/providers/sample_provider.dart';
import 'package:mr_reporting_app/providers/product_provider.dart';
import 'package:mr_reporting_app/providers/edetailing_provider.dart';
import 'package:mr_reporting_app/providers/target_provider.dart';
import 'package:mr_reporting_app/providers/leave_provider.dart';
import 'package:mr_reporting_app/services/mock_data_service.dart';
import 'package:mr_reporting_app/ui/screens/auth/login_screen.dart';
import 'package:mr_reporting_app/ui/screens/tour_plan/tour_plan_screen.dart';
import 'package:mr_reporting_app/ui/screens/gps_tracking/gps_tracking_screen.dart';
import 'package:mr_reporting_app/ui/screens/sales/sales_home_screen.dart';
import 'package:mr_reporting_app/ui/screens/inventory/sample_inventory_screen.dart';
import 'package:mr_reporting_app/ui/screens/reports/reports_hub_screen.dart';
import 'package:mr_reporting_app/ui/screens/edetailing/edetailing_catalog_screen.dart';
import 'package:mr_reporting_app/ui/screens/targets/target_management_screen.dart';
import 'package:mr_reporting_app/ui/screens/leave/leave_home_screen.dart';
import 'package:provider/provider.dart';
import 'package:mr_reporting_app/providers/auth_provider.dart';

void main() {
  group('PharmaSync MR Core Logic Unit Tests', () {
    test('DCR Provider adds doctor visits and updates KPI metrics', () {
      final dcrProvider = DcrProvider();
      expect(dcrProvider.completedDoctorCallsCount, 0);

      final call = DoctorCallReport(
        id: 'call_test_1',
        doctorId: 'doc_1',
        doctorName: 'Dr. Sameer Kulkarni',
        doctorSpecialty: 'Cardiologist',
        clinicName: 'Apex Heart Clinic',
        doctorClass: 'A+',
        callTime: DateTime.now(),
        productsPromoted: [
          ProductPromotionEntry(productId: 'prod_1', brandName: 'CardioVasc-AM', focusLevel: 'Primary'),
        ],
        nextVisitDate: DateTime.now().add(const Duration(days: 14)),
      );

      dcrProvider.addDoctorCall(call);

      expect(dcrProvider.completedDoctorCallsCount, 1);
      expect(dcrProvider.isDoctorVisitedToday('doc_1'), true);
      expect(dcrProvider.doctorCallProgress, greaterThan(0));
    });

    test('POB Order Provider calculates schemes, discounts, and totals accurately', () {
      final orderProvider = OrderProvider();
      final doctorProvider = DoctorProvider();
      final products = MockDataService.getProducts();
      final product = products.first;

      orderProvider.selectChemist(doctorProvider.chemists.first, doctorProvider.stockists);
      orderProvider.addToCart(product, 20, freeQty: 2, discount: 5.0);

      expect(orderProvider.cartCount, 1);
      expect(orderProvider.cartItems.first.quantity, 20);
      expect(orderProvider.cartItems.first.freeQuantity, 2);
      expect(orderProvider.cartGrandTotal, greaterThan(0));
    });

    test('Expense Claim calculation handles TA distance rate and station DA rates', () {
      final expenseProvider = ExpenseProvider();
      final claim = DailyExpenseClaim(
        id: 'exp_test_1',
        date: DateTime.now(),
        workPlaceType: WorkPlaceType.hq,
        routeCovered: 'Bandra - Khar',
        travelDistanceKm: 20.0,
        ratePerKm: 4.50,
        dailyAllowance: WorkPlaceType.hq.standardDaRate,
      );

      expect(claim.travelAllowance, 90.0); // 20 * 4.50
      expect(claim.dailyAllowance, 350.0);
      expect(claim.grandTotal, 440.0);

      expenseProvider.addExpenseClaim(claim);
      expect(expenseProvider.expenses.length, greaterThan(0));
    });

    test('TourPlanProvider handles manager assignments, visit execution, and deviation approvals', () {
      final tourProvider = TourPlanProvider();
      expect(tourProvider.tourPlans.isNotEmpty, true);

      final initialPlan = tourProvider.tourPlans.first;
      expect(initialPlan.plannedVisits.isNotEmpty, true);

      // Execute a visit
      final visitEntityId = initialPlan.plannedVisits.first.entityId;
      tourProvider.executeVisitItem(planId: initialPlan.id, entityId: visitEntityId);
      expect(tourProvider.tourPlans.first.executedCalls, greaterThan(0));

      // Request Deviation
      tourProvider.requestDeviation(
        planId: initialPlan.id,
        reason: 'Doctor on leave',
        remarks: 'Rescheduling to next week',
        rescheduledDate: DateTime.now().add(const Duration(days: 4)),
      );
      expect(tourProvider.tourPlans.first.status, 'Deviation Requested');
    });

    test('GpsTrackingProvider handles live check-in, check-out, idle time, and daily reports', () {
      final gpsProvider = GpsTrackingProvider();
      expect(gpsProvider.isLiveTracking, true);
      expect(gpsProvider.totalDistanceKm, greaterThan(0));
      expect(gpsProvider.checkInOutEvents.isNotEmpty, true);
      expect(gpsProvider.idleEvents.isNotEmpty, true);

      // Check-in
      gpsProvider.performCheckIn(
        entityId: 'doc_1',
        entityName: 'Dr. Sameer Kulkarni',
        entityType: 'Doctor',
        address: 'Hill Road Clinic',
        lat: 19.0544,
        lng: 72.8286,
      );
      expect(gpsProvider.activeCheckIn, isNotNull);
      expect(gpsProvider.activeCheckIn!.entityName, 'Dr. Sameer Kulkarni');

      // Check-out
      gpsProvider.performCheckOut(notes: 'Call done');
      expect(gpsProvider.activeCheckIn, isNull);

      // Report generation
      final report = gpsProvider.generateDailyReport();
      expect(report.mrName, 'Rohan Deshmukh');
      expect(report.totalDistanceKm, greaterThan(0));
      expect(report.complianceScore, 98);
    });

    test('SalesProvider calculates product-wise sales, territory sales, and handles invoice additions', () {
      final salesProvider = SalesProvider();
      expect(salesProvider.invoices.isNotEmpty, true);
      expect(salesProvider.currentMonthAchievedSales, greaterThan(0));
      expect(salesProvider.productWiseSales.isNotEmpty, true);
      expect(salesProvider.territoryWiseSales.isNotEmpty, true);
      expect(salesProvider.monthlyTrends.isNotEmpty, true);

      final newInvoice = ProductSalesInvoice(
        id: 'inv_test_99',
        invoiceNumber: 'INV-2026-9999',
        date: DateTime.now(),
        buyerType: 'Chemist',
        buyerId: 'chem_1',
        buyerName: 'City Medicos Chemist',
        territoryPatch: 'Bandra West Patch A',
        items: [
          SalesLineItem(
            productId: 'prod_1',
            productName: 'CardioVasc-AM',
            batchNo: 'CV99X',
            quantity: 50,
            unitPrice: 165.0,
            discountPercent: 5.0,
            gstPercent: 12.0,
          ),
        ],
      );

      final initialSales = salesProvider.currentMonthAchievedSales;
      salesProvider.addSalesInvoice(newInvoice);

      expect(salesProvider.currentMonthAchievedSales, greaterThan(initialSales));
      expect(salesProvider.invoices.first.invoiceNumber, 'INV-2026-9999');
    });

    test('SampleProvider manages balance stock, batch numbers, doctor distribution with acknowledgment, and requests', () {
      final sampleProvider = SampleProvider();
      expect(sampleProvider.inventory.isNotEmpty, true);
      expect(sampleProvider.drugSamples.isNotEmpty, true);
      expect(sampleProvider.totalBagStockCount, greaterThan(0));

      final firstSample = sampleProvider.drugSamples.first;
      final initialBalance = firstSample.currentBalance;

      // Distribute to Doctor with Ack
      sampleProvider.distributeSampleToDoctor(
        sampleItemId: firstSample.id,
        doctorId: 'doc_1',
        doctorName: 'Dr. Sameer Kulkarni',
        doctorSpecialty: 'Cardiologist',
        clinicName: 'Apex Heart Clinic',
        quantity: 4,
        ackType: 'Doctor Digital Sign',
        signatureText: 'Dr. S. Kulkarni (Digitally Signed)',
      );

      final updatedSample = sampleProvider.drugSamples.firstWhere((s) => s.id == firstSample.id);
      expect(updatedSample.currentBalance, initialBalance - 4);
      expect(sampleProvider.distributionHistory.first.doctorAckSign, contains('Dr. S. Kulkarni'));

      // Submit Stock Request
      sampleProvider.submitStockRequest(sampleName: 'CardioVasc-AM Sample', quantity: 50);
      expect(sampleProvider.stockRequests.first.sampleName, 'CardioVasc-AM Sample');
      expect(sampleProvider.stockRequests.first.status, 'Pending ASM Approval');
    });

    test('EdetailingProvider tracks presentations, clinical trials, comparisons, and feedback', () {
      final edtProvider = EdetailingProvider();
      expect(edtProvider.sessions.isNotEmpty, true);
      expect(edtProvider.videoAssets.isNotEmpty, true);
      expect(edtProvider.leaveBehinds.isNotEmpty, true);
      expect(edtProvider.totalSessionsDone, greaterThan(0));

      // Query clinical studies
      final studies = edtProvider.getClinicalStudiesForProduct('prod_1');
      expect(studies.isNotEmpty, true);
      expect(studies.first.statisticalResult, contains('p < 0.001'));

      // Query comparisons
      final comparisons = edtProvider.getDrugComparisonsForProduct('prod_1');
      expect(comparisons.isNotEmpty, true);
      expect(comparisons.first.ourBrandValue, contains('24 Hours'));

      // Record a new session
      final initialCount = edtProvider.totalSessionsDone;
      edtProvider.recordPresentationSession(
        doctorId: 'doc_1',
        doctorName: 'Dr. Sameer Kulkarni',
        doctorSpecialty: 'Cardiologist',
        productId: 'prod_1',
        productName: 'CardioVasc-AM',
        totalDurationSeconds: 180,
        slidesCoveredCount: 5,
        physicianInterestRating: 'High - Rx Committed',
        physicianFeedback: 'Agreed on 24hr dipping benefits',
      );

      expect(edtProvider.totalSessionsDone, initialCount + 1);
      expect(edtProvider.sessions.first.physicianInterestRating, 'High - Rx Committed');
    });

    test('TargetProvider tracks Monthly, Quarterly, Product-wise targets and leaderboard', () {
      final targetProvider = TargetProvider();
      expect(targetProvider.monthlyTarget.totalSalesTarget, 500000.0);
      expect(targetProvider.monthlyTarget.salesAchievementPercentage, greaterThan(90));
      expect(targetProvider.quarterlyTarget.totalSalesTarget, 1500000.0);
      expect(targetProvider.productTargets.isNotEmpty, true);
      expect(targetProvider.territoryTargets.isNotEmpty, true);
      expect(targetProvider.leaderboard.isNotEmpty, true);
      expect(targetProvider.currentMrLeaderboardRank, 2);
    });

    test('LeaveProvider tracks balances, handles apply leave, manager approvals and rejections', () {
      final leaveProvider = LeaveProvider();
      expect(leaveProvider.balances.isNotEmpty, true);
      expect(leaveProvider.totalAvailableLeaves, greaterThan(0));
      expect(leaveProvider.applications.isNotEmpty, true);
      expect(leaveProvider.holidays.isNotEmpty, true);

      final initialCasual = leaveProvider.balances[LeaveType.casual]!.availableBalance;

      // Apply Leave
      leaveProvider.applyLeave(
        leaveType: LeaveType.casual,
        startDate: DateTime.now().add(const Duration(days: 3)),
        endDate: DateTime.now().add(const Duration(days: 4)),
        totalDays: 2,
        reason: 'Personal work',
      );

      expect(leaveProvider.balances[LeaveType.casual]!.pendingDays, greaterThan(0));
      final newApp = leaveProvider.applications.first;
      expect(newApp.status, 'Pending Approval');

      // Manager Approves Leave
      leaveProvider.managerApproveLeave(newApp.id, remarks: 'Approved by ASM');
      expect(leaveProvider.applications.first.status, 'Approved');
      expect(leaveProvider.balances[LeaveType.casual]!.usedDays, greaterThan(0));
      expect(leaveProvider.balances[LeaveType.casual]!.availableBalance, initialCasual - 2);
    });
  });

  group('Authentication & UI Widget Tests', () {
    testWidgets('LoginScreen shows Email Login, Mobile Login, and Biometrics', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => AuthProvider()),
            ],
            child: const LoginScreen(),
          ),
        ),
      );

      expect(find.text('Alleviare'), findsOneWidget);
      expect(find.text('Email Login'), findsOneWidget);
      expect(find.text('Mobile Login'), findsOneWidget);
      expect(find.text('Email Address'), findsOneWidget);
      expect(find.text('Login with Email'), findsOneWidget);
      expect(find.text('Fingerprint'), findsOneWidget);
      expect(find.text('Face Unlock'), findsOneWidget);

      // Switch to Mobile Login Tab
      await tester.tap(find.text('Mobile Login'));
      await tester.pump();
      expect(find.text('Mobile Phone Number'), findsOneWidget);
      expect(find.text('Login with Mobile Number'), findsOneWidget);
    });

    testWidgets('TourPlanScreen renders MNC assigned plans and controls', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => TourPlanProvider()),
              ChangeNotifierProvider(create: (_) => DoctorProvider()),
              ChangeNotifierProvider(create: (_) => AuthProvider()),
            ],
            child: const TourPlanScreen(),
          ),
        ),
      );

      expect(find.text('Monthly Tour Plan (MTP)'), findsOneWidget);
      expect(find.textContaining('Assigned by Rajesh Sharma (ASM)'), findsOneWidget);
      expect(find.textContaining('Execute DCR'), findsWidgets);
    });

    testWidgets('GpsTrackingScreen renders live territory radar, distance, and timeline tabs', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => GpsTrackingProvider()),
              ChangeNotifierProvider(create: (_) => DoctorProvider()),
              ChangeNotifierProvider(create: (_) => AuthProvider()),
            ],
            child: const GpsTrackingScreen(),
          ),
        ),
      );

      expect(find.text('Live GPS & Route Tracking'), findsOneWidget);
      expect(find.textContaining('DISTANCE'), findsOneWidget);
      expect(find.textContaining('Travel Timeline'), findsOneWidget);
      expect(find.textContaining('Check-Ins'), findsOneWidget);
      expect(find.textContaining('Idle Detection'), findsOneWidget);
    });

    testWidgets('SalesHomeScreen renders monthly performance, product-wise and territory-wise tabs', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => SalesProvider()),
              ChangeNotifierProvider(create: (_) => DoctorProvider()),
              ChangeNotifierProvider(create: (_) => AuthProvider()),
            ],
            child: const SalesHomeScreen(),
          ),
        ),
      );

      expect(find.text('Product Sales & Reports'), findsOneWidget);
      expect(find.textContaining('MONTHLY SALES PERFORMANCE'), findsOneWidget);
      expect(find.textContaining('Product-Wise'), findsOneWidget);
      expect(find.textContaining('Territory-Wise'), findsOneWidget);
      expect(find.textContaining('Invoices / Bills'), findsOneWidget);
    });

    testWidgets('SampleInventoryScreen renders balance stock, batch numbers, and distribution tabs', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => SampleProvider()),
              ChangeNotifierProvider(create: (_) => DoctorProvider()),
              ChangeNotifierProvider(create: (_) => AuthProvider()),
            ],
            child: const SampleInventoryScreen(),
          ),
        ),
      );

      expect(find.text('Sample Distribution & Bag'), findsOneWidget);
      expect(find.textContaining('PHYSICIAN SAMPLE BAG LEDGER'), findsOneWidget);
      expect(find.textContaining('Balance Stock'), findsOneWidget);
      expect(find.textContaining('Doctor Distributed'), findsOneWidget);
      expect(find.textContaining('Inward Receipts'), findsOneWidget);
      expect(find.textContaining('Stock Requisition'), findsOneWidget);
    });

    testWidgets('RealTimeReportsScreen renders executive summary and report categories', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => DcrProvider()),
              ChangeNotifierProvider(create: (_) => SalesProvider()),
              ChangeNotifierProvider(create: (_) => ExpenseProvider()),
              ChangeNotifierProvider(create: (_) => GpsTrackingProvider()),
              ChangeNotifierProvider(create: (_) => SampleProvider()),
              ChangeNotifierProvider(create: (_) => AuthProvider()),
            ],
            child: const RealTimeReportsScreen(),
          ),
        ),
      );

      expect(find.text('Real-Time Reporting Hub'), findsOneWidget);
      expect(find.textContaining('EXECUTIVE REAL-TIME REPORTING'), findsOneWidget);
      expect(find.textContaining('Dashboard Charts'), findsOneWidget);
      expect(find.textContaining('Daily & Weekly'), findsOneWidget);
      expect(find.textContaining('Visits & Calls'), findsOneWidget);
      expect(find.textContaining('Sales & Target'), findsOneWidget);
      expect(find.textContaining('Expense & Attendance'), findsOneWidget);
    });

    testWidgets('EdetailingCatalogScreen renders product binders, video library, and LBLs', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => ProductProvider()),
              ChangeNotifierProvider(create: (_) => EdetailingProvider()),
              ChangeNotifierProvider(create: (_) => DoctorProvider()),
              ChangeNotifierProvider(create: (_) => AuthProvider()),
            ],
            child: const EdetailingCatalogScreen(),
          ),
        ),
      );

      expect(find.text('E-Detailing & Visual Aid'), findsOneWidget);
      expect(find.textContaining('DIGITAL E-DETAILING ANALYTICS'), findsOneWidget);
      expect(find.textContaining('Product Binders'), findsOneWidget);
      expect(find.textContaining('3D Medical Videos'), findsOneWidget);
      expect(find.textContaining('Leave-Behinds (LBL)'), findsOneWidget);
      expect(find.textContaining('Presentation Log'), findsOneWidget);
    });

    testWidgets('TargetManagementScreen renders manager targets, product targets, and leaderboard', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => TargetProvider()),
              ChangeNotifierProvider(create: (_) => DoctorProvider()),
              ChangeNotifierProvider(create: (_) => AuthProvider()),
            ],
            child: const TargetManagementScreen(),
          ),
        ),
      );

      expect(find.text('Target Management'), findsOneWidget);
      expect(find.textContaining('Rank #2 in Region'), findsOneWidget);
      expect(find.textContaining('Target Overview'), findsOneWidget);
      expect(find.textContaining('Product-Wise'), findsOneWidget);
      expect(find.textContaining('Territory Patch'), findsOneWidget);
      expect(find.textContaining('Leaderboard'), findsOneWidget);
    });

    testWidgets('LeaveHomeScreen renders leave balances, applications, and calendar tabs', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => LeaveProvider()),
              ChangeNotifierProvider(create: (_) => DoctorProvider()),
              ChangeNotifierProvider(create: (_) => AuthProvider()),
            ],
            child: const LeaveHomeScreen(),
          ),
        ),
      );

      expect(find.text('Leave Management'), findsOneWidget);
      expect(find.textContaining('ANNUAL LEAVE QUOTA'), findsOneWidget);
      expect(find.textContaining('Applications & History'), findsOneWidget);
      expect(find.textContaining('Calendar & Holidays'), findsOneWidget);
      expect(find.textContaining('Notifications'), findsOneWidget);
    });

    testWidgets('App boots with splash Alleviare branding', (WidgetTester tester) async {
      await tester.pumpWidget(const PharmaSyncApp());
      expect(find.text('Alleviare'), findsOneWidget);
      await tester.pump(const Duration(milliseconds: 500));
    });
  });
}
