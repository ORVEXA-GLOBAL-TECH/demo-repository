import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'offline_sync_service.dart';

/// Central API Service for Alleviare MR Mobile & Web App
class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // Localhost for Web / iOS, or Android Emulator 10.0.2.2
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8080/api/v1';
    return defaultTargetPlatform == TargetPlatform.android
        ? 'http://10.0.2.2:8080/api/v1'
        : 'http://localhost:8080/api/v1';
  }

  static const String _tokenKey = 'alleviare_mr_token';
  static const String _userKey = 'alleviare_mr_user';

  String? _jwtToken;
  Map<String, dynamic>? _currentUser;

  String? get token => _jwtToken;
  Map<String, dynamic>? get currentUser => _currentUser;
  bool get isAuthenticated => _jwtToken != null && _jwtToken!.isNotEmpty;

  /// Load persisted session
  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _jwtToken = prefs.getString(_tokenKey);
    final userRaw = prefs.getString(_userKey);
    if (userRaw != null) {
      try {
        _currentUser = jsonDecode(userRaw);
      } catch (_) {}
    }
  }

  Map<String, String> get _headers {
    final headers = {'Content-Type': 'application/json'};
    if (_jwtToken != null) {
      headers['Authorization'] = 'Bearer $_jwtToken';
    }
    return headers;
  }

  /// 1. Login Authentication
  Future<Map<String, dynamic>> login(String usernameOrEmail, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/login'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'usernameOrEmail': usernameOrEmail,
              'password': password,
            }),
          )
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final data = body['data'] ?? body;
        _jwtToken = data['token'];
        _currentUser = data;

        final prefs = await SharedPreferences.getInstance();
        if (_jwtToken != null) await prefs.setString(_tokenKey, _jwtToken!);
        await prefs.setString(_userKey, jsonEncode(data));

        return {'success': true, 'data': data};
      } else {
        final err = jsonDecode(response.body);
        return {'success': false, 'message': err['message'] ?? 'Login failed'};
      }
    } catch (e) {
      // Offline fallback login for demo/offline MR field use
      if (usernameOrEmail.isNotEmpty && password == 'Alleviare@123') {
        _jwtToken = 'demo-offline-jwt-token';
        _currentUser = {
          'userId': '22222222-2222-2222-2222-222222222208',
          'username': usernameOrEmail,
          'fullName': 'Rahul Verma (MR)',
          'role': 'MR',
          'territoryId': '11111111-1111-1111-1111-111111111101',
        };
        return {'success': true, 'data': _currentUser, 'offline': true};
      }
      return {'success': false, 'message': 'Network unavailable: $e'};
    }
  }

  /// 2. Logout
  Future<void> logout() async {
    _jwtToken = null;
    _currentUser = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }

  /// 3. Get Assigned Doctors
  Future<List<dynamic>> getDoctors({String? mrId}) async {
    try {
      final id = mrId ?? _currentUser?['userId'] ?? '22222222-2222-2222-2222-222222222208';
      final response = await http
          .get(Uri.parse('$baseUrl/doctors?mrId=$id'), headers: _headers)
          .timeout(const Duration(seconds: 6));

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        return body['data'] ?? body;
      }
    } catch (_) {}
    return [];
  }

  /// 4. Get SKU Catalog
  Future<List<dynamic>> getProducts() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/products'), headers: _headers)
          .timeout(const Duration(seconds: 6));

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        return body['data'] ?? body;
      }
    } catch (_) {}
    return [];
  }

  /// 5. Record Doctor Visit with PostGIS Geolocation & Offline Queue
  Future<bool> recordDoctorVisit(Map<String, dynamic> visitData) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/visits'),
            headers: _headers,
            body: jsonEncode(visitData),
          )
          .timeout(const Duration(seconds: 6));

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      }
    } catch (_) {}

    // Fallback: Queue offline for automatic sync
    await OfflineSyncService().enqueue(
      type: SyncItemType.doctorVisit,
      payload: visitData,
    );
    return true;
  }

  /// 6. Submit POB Chemist Order
  Future<bool> submitOrder(Map<String, dynamic> orderData) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/orders'),
            headers: _headers,
            body: jsonEncode(orderData),
          )
          .timeout(const Duration(seconds: 6));

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      }
    } catch (_) {}

    await OfflineSyncService().enqueue(
      type: SyncItemType.pobOrder,
      payload: orderData,
    );
    return true;
  }

  /// 7. Submit Field Expense Claim
  Future<bool> submitExpense(Map<String, dynamic> expenseData) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/expenses'),
            headers: _headers,
            body: jsonEncode(expenseData),
          )
          .timeout(const Duration(seconds: 6));

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      }
    } catch (_) {}

    await OfflineSyncService().enqueue(
      type: SyncItemType.expenseClaim,
      payload: expenseData,
    );
    return true;
  }
}
