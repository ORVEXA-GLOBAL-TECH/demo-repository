import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class FieldNotesScreen extends StatefulWidget {
  const FieldNotesScreen({super.key});

  @override
  State<FieldNotesScreen> createState() => _FieldNotesScreenState();
}

class _FieldNotesScreenState extends State<FieldNotesScreen> {
  final List<Map<String, dynamic>> _notes = [
    {
      'id': '1',
      'title': 'Dr. Sameer Kulkarni - CardioVasc-AM Clinical Case',
      'content': 'Dr. Kulkarni observed high patient compliance with CardioVasc-AM in hypertensive patients. Request for 10 physician trial samples for newly admitted clinical study.',
      'category': 'Doctor Clinical',
      'color': const Color(0xFF0288D1),
      'date': 'Today, 10:45 AM',
      'isPinned': true,
    },
    {
      'id': '2',
      'title': 'Sai Medicos & Pharmacy Depot - POB Order & Payment Clearance',
      'content': 'Chemist confirmed payment clearance of \$450 by Friday. Promised order of 25 boxes CardioVasc-AM under 10+1 trade scheme.',
      'category': 'Chemist POB',
      'color': const Color(0xFF10B981),
      'date': 'Yesterday, 04:30 PM',
      'isPinned': true,
    },
    {
      'id': '3',
      'title': 'Stockist Depot Visit Notes (Apollo Pharma Wholesale Depot, Phnom Penh)',
      'content': 'Check stock availability of CardioVasc-AM and GlycoSmart-D10. Distributor reported fresh batch arriving next Monday.',
      'category': 'Stockist Depot',
      'color': const Color(0xFF8E24AA),
      'date': '19 Aug 2026',
      'isPinned': false,
    },
    {
      'id': '4',
      'title': 'Monthly Joint Fieldwork with ASM Rajesh Sharma',
      'content': 'Joint work planned for Zone 1 tertiary hospital doctors on 26th August. Prepare KOL visual aid binder and product leaflets.',
      'category': 'Tour Plan Memo',
      'color': const Color(0xFFFB8C00),
      'date': '18 Aug 2026',
      'isPinned': false,
    },
  ];

  String _searchQuery = '';
  String _selectedCategory = 'All';

  void _openAddEditScreen([Map<String, dynamic>? existingNote]) async {
    final result = await Navigator.push<Map<String, dynamic>>(
      context,
      MaterialPageRoute(
        builder: (_) => AddEditNoteScreen(existingNote: existingNote),
      ),
    );

    if (!mounted) return;
    if (result != null) {
      setState(() {
        if (existingNote != null) {
          final idx = _notes.indexWhere((n) => n['id'] == existingNote['id']);
          if (idx != -1) {
            _notes[idx] = result;
          }
        } else {
          _notes.insert(0, result);
        }
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(existingNote != null ? 'Note updated successfully!' : 'Note created successfully!'),
          backgroundColor: const Color(0xFF10B981),
        ),
      );
    }
  }

  void _deleteNote(String id) {
    setState(() {
      _notes.removeWhere((n) => n['id'] == id);
    });
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Note deleted.')));
  }

  void _togglePin(Map<String, dynamic> note) {
    setState(() {
      note['isPinned'] = !(note['isPinned'] as bool);
    });
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _notes.where((n) {
      final matchesSearch = n['title'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          n['content'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesCat = _selectedCategory == 'All' || n['category'] == _selectedCategory;
      return matchesSearch && matchesCat;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('MR Field Notes & Diary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openAddEditScreen(),
        backgroundColor: const Color(0xFFF59E0B),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Add Note', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            color: const Color(0xFF0B172E),
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
            child: Column(
              children: [
                TextField(
                  onChanged: (v) => setState(() => _searchQuery = v),
                  style: const TextStyle(color: Colors.white, fontSize: 13.5),
                  decoration: InputDecoration(
                    hintText: 'Search field observations, doctors, chemists...',
                    hintStyle: const TextStyle(color: Colors.white60, fontSize: 12.5),
                    prefixIcon: const Icon(Icons.search, color: Colors.white70, size: 20),
                    filled: true,
                    fillColor: Colors.white.withValues(alpha: 0.12),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 10),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['All', 'Doctor Clinical', 'Chemist POB', 'Stockist Depot', 'Tour Plan Memo'].map((cat) {
                      final isSelected = _selectedCategory == cat;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: InkWell(
                          onTap: () => setState(() => _selectedCategory = cat),
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFF0288D1) : Colors.white.withValues(alpha: 0.14),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isSelected ? const Color(0xFF38BDF8) : Colors.white.withValues(alpha: 0.25),
                                width: isSelected ? 1.5 : 1,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                if (isSelected) ...[
                                  const Icon(Icons.check_rounded, color: Colors.white, size: 14),
                                  const SizedBox(width: 5),
                                ],
                                Text(
                                  cat,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.white,
                                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          // Notes List
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(color: const Color(0xFFFFFBEB), shape: BoxShape.circle),
                          child: const Icon(Icons.note_alt_outlined, color: Color(0xFFF59E0B), size: 44),
                        ),
                        const SizedBox(height: 14),
                        const Text('No Field Notes Found', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
                        const SizedBox(height: 4),
                        const Text('Tap "+ Add Note" to open full screen editor.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 14, 16, 80),
                    itemCount: filtered.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 12),
                    itemBuilder: (ctx, idx) {
                      final note = filtered[idx];
                      final isPinned = note['isPinned'] as bool;
                      final Color catColor = note['color'] as Color;

                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: isPinned ? catColor.withValues(alpha: 0.4) : const Color(0xFFE2E8F0), width: isPinned ? 1.6 : 1),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 3)),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: catColor.withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    note['category'] as String,
                                    style: TextStyle(color: catColor, fontWeight: FontWeight.bold, fontSize: 10.5),
                                  ),
                                ),
                                const Spacer(),
                                Text(note['date'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                                const SizedBox(width: 6),
                                InkWell(
                                  onTap: () => _togglePin(note),
                                  child: Icon(
                                    isPinned ? Icons.push_pin_rounded : Icons.push_pin_outlined,
                                    size: 18,
                                    color: isPinned ? const Color(0xFFF59E0B) : const Color(0xFF94A3B8),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              note['title'] as String,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              note['content'] as String,
                              style: const TextStyle(fontSize: 12.5, color: Color(0xFF475569), height: 1.35),
                            ),
                            const SizedBox(height: 12),
                            const Divider(height: 1),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                TextButton.icon(
                                  onPressed: () {
                                    Clipboard.setData(ClipboardData(text: '${note['title']}\n\n${note['content']}'));
                                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Note copied to clipboard!')));
                                  },
                                  icon: const Icon(Icons.copy_rounded, size: 14),
                                  label: const Text('Copy', style: TextStyle(fontSize: 11.5)),
                                ),
                                const SizedBox(width: 8),
                                TextButton.icon(
                                  onPressed: () => _openAddEditScreen(note),
                                  icon: const Icon(Icons.edit_outlined, size: 14),
                                  label: const Text('Edit', style: TextStyle(fontSize: 11.5)),
                                ),
                                const SizedBox(width: 8),
                                TextButton.icon(
                                  onPressed: () => _deleteNote(note['id'] as String),
                                  icon: const Icon(Icons.delete_outline_rounded, size: 14, color: Color(0xFFE53935)),
                                  label: const Text('Delete', style: TextStyle(fontSize: 11.5, color: Color(0xFFE53935))),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

// =========================================================================
// FULL SCREEN ADD / EDIT NOTE
// =========================================================================
class AddEditNoteScreen extends StatefulWidget {
  final Map<String, dynamic>? existingNote;
  const AddEditNoteScreen({super.key, this.existingNote});

  @override
  State<AddEditNoteScreen> createState() => _AddEditNoteScreenState();
}

class _AddEditNoteScreenState extends State<AddEditNoteScreen> {
  late TextEditingController _titleCtrl;
  late TextEditingController _contentCtrl;
  late String _category;
  late Color _color;
  bool _isPinned = false;

  @override
  void initState() {
    super.initState();
    _titleCtrl = TextEditingController(text: widget.existingNote?['title'] ?? '');
    _contentCtrl = TextEditingController(text: widget.existingNote?['content'] ?? '');
    _category = widget.existingNote?['category'] ?? 'Doctor Clinical';
    _color = widget.existingNote?['color'] ?? const Color(0xFF0288D1);
    _isPinned = widget.existingNote?['isPinned'] ?? false;
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _contentCtrl.dispose();
    super.dispose();
  }

  void _saveNote() {
    final title = _titleCtrl.text.trim();
    final content = _contentCtrl.text.trim();
    if (title.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a note title/subject.')),
      );
      return;
    }

    final noteData = {
      'id': widget.existingNote?['id'] ?? DateTime.now().millisecondsSinceEpoch.toString(),
      'title': title,
      'content': content,
      'category': _category,
      'color': _color,
      'date': widget.existingNote?['date'] ?? 'Today, Just now',
      'isPinned': _isPinned,
    };

    Navigator.pop(context, noteData);
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.existingNote != null;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(isEditing ? 'Edit Field Note' : 'Create New Note', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(_isPinned ? Icons.push_pin_rounded : Icons.push_pin_outlined, color: _isPinned ? const Color(0xFFF59E0B) : Colors.white70),
            tooltip: 'Pin Note',
            onPressed: () => setState(() => _isPinned = !_isPinned),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: TextButton.icon(
              onPressed: _saveNote,
              icon: const Icon(Icons.check_rounded, color: Colors.white, size: 18),
              label: const Text('SAVE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Category Selector
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Select Category', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _categoryChip('Doctor Clinical', const Color(0xFF0288D1)),
                    _categoryChip('Chemist POB', const Color(0xFF10B981)),
                    _categoryChip('Stockist Depot', const Color(0xFF8E24AA)),
                    _categoryChip('Tour Plan Memo', const Color(0xFFFB8C00)),
                    _categoryChip('General Note', const Color(0xFF64748B)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Note Content Editor
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: _titleCtrl,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  decoration: const InputDecoration(
                    labelText: 'Note Title / Subject',
                    hintText: 'e.g. Dr. Rajesh Sharma - Cardiology trial feedback',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                    prefixIcon: Icon(Icons.title_rounded, color: Color(0xFF0288D1)),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _contentCtrl,
                  maxLines: 12,
                  style: const TextStyle(fontSize: 14, height: 1.4),
                  decoration: const InputDecoration(
                    labelText: 'Note Details & Observations',
                    hintText: 'Type observation details, commitments, stock requirements, or doctor feedback...',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                    alignLabelWithHint: true,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Bottom Action
          ElevatedButton.icon(
            onPressed: _saveNote,
            icon: const Icon(Icons.save_rounded, size: 20),
            label: Text(isEditing ? 'Update & Save Field Note' : 'Save & Publish Note'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0288D1),
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              elevation: 2,
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _categoryChip(String label, Color color) {
    final isSelected = _category == label;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 12, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
      selected: isSelected,
      selectedColor: color,
      labelStyle: TextStyle(color: isSelected ? Colors.white : const Color(0xFF0F172A)),
      onSelected: (val) {
        if (val) {
          setState(() {
            _category = label;
            _color = color;
          });
        }
      },
    );
  }
}
