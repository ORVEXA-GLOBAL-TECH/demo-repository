import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/session_provider.dart';
import 'providers/doctor_provider.dart';
import 'providers/product_provider.dart';
import 'providers/dcr_provider.dart';
import 'providers/order_provider.dart';
import 'providers/rcpa_provider.dart';
import 'providers/tour_plan_provider.dart';
import 'providers/sample_provider.dart';
import 'providers/expense_provider.dart';
import 'providers/gps_tracking_provider.dart';
import 'providers/sales_provider.dart';
import 'providers/edetailing_provider.dart';
import 'providers/target_provider.dart';
import 'providers/leave_provider.dart';
import 'providers/return_provider.dart';
import 'providers/locale_provider.dart';
import 'providers/currency_provider.dart';
import 'ui/screens/splash/splash_screen.dart';
import 'ui/widgets/session_timeout_wrapper.dart';

import 'services/offline_sync_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Allow both portrait and landscape; lock to portrait on phones via theme
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
  // Edge-to-edge rendering (Android 15+ / iOS)
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  
  // Initialize Offline-First Sync Service
  await OfflineSyncService().initialize();
  
  runApp(const PharmaSyncApp());
}

class PharmaSyncApp extends StatelessWidget {
  const PharmaSyncApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LocaleProvider()),
        ChangeNotifierProvider(create: (_) => CurrencyProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => SessionProvider()),
        ChangeNotifierProvider(create: (_) => DoctorProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
        ChangeNotifierProvider(create: (_) => DcrProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
        ChangeNotifierProvider(create: (_) => RcpaProvider()),
        ChangeNotifierProvider(create: (_) => TourPlanProvider()),
        ChangeNotifierProvider(create: (_) => SampleProvider()),
        ChangeNotifierProvider(create: (_) => ExpenseProvider()),
        ChangeNotifierProvider(create: (_) => GpsTrackingProvider()),
        ChangeNotifierProvider(create: (_) => SalesProvider()),
        ChangeNotifierProvider(create: (_) => EdetailingProvider()),
        ChangeNotifierProvider(create: (_) => TargetProvider()),
        ChangeNotifierProvider(create: (_) => LeaveProvider()),
        ChangeNotifierProvider(create: (_) => ReturnProvider()),
      ],
      child: Consumer<LocaleProvider>(
        builder: (context, localeProvider, _) {
          return MaterialApp(
            title: 'Alleviare Pharmaceuticals MR App',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: ThemeMode.light,
            locale: localeProvider.currentLocale,
            builder: (context, child) {
              final mq = MediaQuery.of(context);
              final clampedScale = (mq.textScaler.scale(1.0) * localeProvider.fontScale)
                  .clamp(0.85, 1.15);
              return MediaQuery(
                data: mq.copyWith(
                  textScaler: TextScaler.linear(clampedScale),
                  padding: mq.padding,
                  viewPadding: mq.viewPadding,
                  viewInsets: mq.viewInsets,
                ),
                child: SessionTimeoutWrapper(
                  child: child ?? const SizedBox(),
                ),
              );
            },
            home: const SplashScreen(),
          );
        },
      ),
    );
  }
}
