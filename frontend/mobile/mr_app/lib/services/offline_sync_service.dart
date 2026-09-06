import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

/// Sync Action Types
enum SyncItemType {
  doctorVisit,
  chemistVisit,
  pobOrder,
  expenseClaim,
  attendancePunch,
}

/// Queued Sync Item
class SyncQueueItem {
  final String id;
  final SyncItemType type;
  final Map<String, dynamic> payload;
  final DateTime createdAt;
  final int retryCount;
  final String? lastError;

  SyncQueueItem({
    required this.id,
    required this.type,
    required this.payload,
    required this.createdAt,
    this.retryCount = 0,
    this.lastError,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type.name,
        'payload': payload,
        'createdAt': createdAt.toIso8601String(),
        'retryCount': retryCount,
        'lastError': lastError,
      };

  factory SyncQueueItem.fromJson(Map<String, dynamic> json) => SyncQueueItem(
        id: json['id'],
        type: SyncItemType.values.firstWhere((e) => e.name == json['type']),
        payload: Map<String, dynamic>.from(json['payload']),
        createdAt: DateTime.parse(json['createdAt']),
        retryCount: json['retryCount'] ?? 0,
        lastError: json['lastError'],
      );
}

/// Offline-First Synchronization Service for Mr App
class OfflineSyncService extends ChangeNotifier {
  static final OfflineSyncService _instance = OfflineSyncService._internal();
  factory OfflineSyncService() => _instance;
  OfflineSyncService._internal();

  static const String _storageKey = 'alleviare_offline_sync_queue';
  static const String _apiBaseUrl = 'http://localhost:8080/api/v1';

  final List<SyncQueueItem> _queue = [];
  bool _isSyncing = false;
  String? _lastSyncTime;

  List<SyncQueueItem> get queue => List.unmodifiable(_queue);
  int get pendingCount => _queue.length;
  bool get isSyncing => _isSyncing;
  String? get lastSyncTime => _lastSyncTime;
  bool get hasPendingItems => _queue.isNotEmpty;

  /// Initialize and load stored offline queue
  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    final rawData = prefs.getString(_storageKey);
    if (rawData != null && rawData.isNotEmpty) {
      try {
        final List decoded = jsonDecode(rawData);
        _queue.clear();
        _queue.addAll(decoded.map((item) => SyncQueueItem.fromJson(item)));
        notifyListeners();
      } catch (e) {
        debugPrint('Error loading offline sync queue: $e');
      }
    }
  }

  /// Queue a new offline item (e.g. Doctor call, POB Order)
  Future<void> enqueue({
    required SyncItemType type,
    required Map<String, dynamic> payload,
  }) async {
    final item = SyncQueueItem(
      id: 'SYNC-${DateTime.now().millisecondsSinceEpoch}',
      type: type,
      payload: payload,
      createdAt: DateTime.now(),
    );
    _queue.add(item);
    await _persistQueue();
    notifyListeners();

    // Auto-trigger sync attempt
    triggerSync();
  }

  /// Trigger background flush of the queue
  Future<bool> triggerSync() async {
    if (_isSyncing || _queue.isEmpty) return false;

    _isSyncing = true;
    notifyListeners();

    final List<SyncQueueItem> completedItems = [];

    for (final item in List<SyncQueueItem>.from(_queue)) {
      try {
        final success = await _dispatchItem(item);
        if (success) {
          completedItems.add(item);
        }
      } catch (e) {
        debugPrint('Sync failed for item ${item.id}: $e');
      }
    }

    _queue.removeWhere((item) => completedItems.contains(item));
    await _persistQueue();

    _isSyncing = false;
    _lastSyncTime = "${DateTime.now().hour}:${DateTime.now().minute.toString().padLeft(2, '0')}";
    notifyListeners();

    return completedItems.isNotEmpty;
  }

  /// Dispatch individual record to the respective Spring Boot Microservice
  Future<bool> _dispatchItem(SyncQueueItem item) async {
    String endpoint;
    switch (item.type) {
      case SyncItemType.doctorVisit:
        endpoint = '$_apiBaseUrl/visits';
        break;
      case SyncItemType.chemistVisit:
        endpoint = '$_apiBaseUrl/visits/chemist';
        break;
      case SyncItemType.pobOrder:
        endpoint = '$_apiBaseUrl/orders';
        break;
      case SyncItemType.expenseClaim:
        endpoint = '$_apiBaseUrl/expenses';
        break;
      case SyncItemType.attendancePunch:
        endpoint = '$_apiBaseUrl/attendance';
        break;
    }

    try {
      final response = await http
          .post(
            Uri.parse(endpoint),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(item.payload),
          )
          .timeout(const Duration(seconds: 8));

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (_) {
      // In offline / server unreachable mode, return false to keep in queue
      return false;
    }
  }

  Future<void> _persistQueue() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = _queue.map((item) => item.toJson()).toList();
    await prefs.setString(_storageKey, jsonEncode(jsonList));
  }
}
