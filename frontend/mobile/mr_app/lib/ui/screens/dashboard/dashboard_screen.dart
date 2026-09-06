import 'package:flutter/material.dart';
import '../../widgets/app_drawer.dart';
import '../../widgets/mr_connect_header.dart';
import 'mr_dashboard_tab.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFFEDF2F9),
      drawer: AppDrawer(),
      body: Column(
        children: [
          MrConnectHeader(),
          Expanded(
            child: MrDashboardTab(),
          ),
        ],
      ),
    );
  }
}
