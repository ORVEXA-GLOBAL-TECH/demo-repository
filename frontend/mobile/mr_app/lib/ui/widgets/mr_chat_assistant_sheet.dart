import 'package:flutter/material.dart';

class MrChatAssistantSheet extends StatefulWidget {
  const MrChatAssistantSheet({super.key});

  @override
  State<MrChatAssistantSheet> createState() => _MrChatAssistantSheetState();
}

class _MrChatAssistantSheetState extends State<MrChatAssistantSheet> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'isUser': false,
      'text': 'Hello Anand! I am your Pharma MR Assistant. How can I help you today?',
      'time': 'Just now',
    },
  ];

  final List<String> _quickPrompts = [
    'What schemes are active for Lubrica-Forte?',
    'Show today\'s scheduled doctor visits',
    'Calculate distance to Apollo Pharmacy',
    'How many POB orders placed today?',
  ];

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    setState(() {
      _messages.add({
        'isUser': true,
        'text': text,
        'time': 'Just now',
      });
      _controller.clear();
    });

    // Auto smart response
    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      String reply = 'I have processed your request regarding "$text". All records are synchronized with your Regional Sales Manager and ERP.';
      if (text.toLowerCase().contains('lubrica') || text.toLowerCase().contains('scheme')) {
        reply = 'Lubrica-Forte Active Scheme: 10 + 2 Free + Extra 5% Cash Discount on POB orders exceeding \$150.';
      } else if (text.toLowerCase().contains('doctor') || text.toLowerCase().contains('visit')) {
        reply = 'You have 8 scheduled doctor calls today across Phnom Penh Central Zone. Top priority: Dr. Rajesh Sharma (Cardio) at 11:30 AM.';
      } else if (text.toLowerCase().contains('distance') || text.toLowerCase().contains('apollo')) {
        reply = 'Apollo Pharma Wholesale Depot (Russian Blvd) is 2.1 km from your current GPS location. Estimated travel time: 8 minutes.';
      } else if (text.toLowerCase().contains('pob') || text.toLowerCase().contains('order')) {
        reply = 'Today you booked 4 POB orders worth \$486 across 3 stockists. Pending dispatch: 1.';
      }

      setState(() {
        _messages.add({
          'isUser': false,
          'text': reply,
          'time': 'Just now',
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.78,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        children: [
          const SizedBox(height: 12),
          Center(
            child: Container(
              width: 44,
              height: 4.5,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E88E5).withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.smart_toy_rounded, color: Color(0xFF1E88E5), size: 24),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Alleviare AI Assistant',
                        style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: Color(0xFF0F172A)),
                      ),
                      Text(
                        'Online • Instant Sales & Product Intelligence',
                        style: TextStyle(fontSize: 11, color: Color(0xFF10B981), fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(height: 16),
          // Messages list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: _messages.length,
              itemBuilder: (ctx, idx) {
                final msg = _messages[idx];
                final isUser = msg['isUser'] as bool;
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
                    decoration: BoxDecoration(
                      color: isUser ? const Color(0xFF1E88E5) : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(16).copyWith(
                        bottomRight: isUser ? const Radius.circular(2) : const Radius.circular(16),
                        bottomLeft: !isUser ? const Radius.circular(2) : const Radius.circular(16),
                      ),
                    ),
                    child: Text(
                      msg['text'] as String,
                      style: TextStyle(
                        color: isUser ? Colors.white : const Color(0xFF1E293B),
                        fontSize: 13.5,
                        height: 1.3,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // Quick prompt suggestions
          SizedBox(
            height: 38,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _quickPrompts.length,
              separatorBuilder: (context, index) => const SizedBox(width: 8),
              itemBuilder: (ctx, idx) {
                return ActionChip(
                  label: Text(
                    _quickPrompts[idx],
                    style: const TextStyle(fontSize: 11.5, color: Color(0xFF1E88E5), fontWeight: FontWeight.w600),
                  ),
                  backgroundColor: const Color(0xFFE3F2FD),
                  side: BorderSide.none,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  onPressed: () => _sendMessage(_quickPrompts[idx]),
                );
              },
            ),
          ),
          const SizedBox(height: 8),
          // Input bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    onSubmitted: _sendMessage,
                    decoration: InputDecoration(
                      hintText: 'Ask anything about schemes, doctors, POB...',
                      hintStyle: const TextStyle(fontSize: 12.5, color: Color(0xFF94A3B8)),
                      isDense: true,
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: const Color(0xFF1E88E5),
                  radius: 20,
                  child: IconButton(
                    icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                    onPressed: () => _sendMessage(_controller.text),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
