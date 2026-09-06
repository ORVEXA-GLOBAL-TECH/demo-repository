enum AppLanguage {
  english('en', 'English', 'EN', '🇺🇸'),
  khmer('km', 'ភាសាខ្មែរ (Khmer)', 'ខ្មែរ', '🇰🇭');

  final String code;
  final String label;
  final String shortLabel;
  final String flag;

  const AppLanguage(this.code, this.label, this.shortLabel, this.flag);
}

class AppStrings {
  static const Map<String, Map<String, String>> _localizedValues = {
    // ----------------------------------------------------
    // APP & HEADER
    // ----------------------------------------------------
    'app_title': {
      'en': 'ALLEVIARE PHARMA',
      'km': 'អាឡេវីយ៉ា ហ្វាម៉ា (ALLEVIARE)',
    },
    'notifications': {
      'en': 'Notifications',
      'km': 'ការជូនដំណឹង',
    },
    'mark_all_read': {
      'en': 'Mark all read',
      'km': 'សម្គាល់ថាបានអានទាំងអស់',
    },
    'new_alerts': {
      'en': 'New',
      'km': 'ថ្មី',
    },
    'territory': {
      'en': 'Territory',
      'km': 'តំបន់ប្រតិបត្តិការ',
    },
    'headquarters': {
      'en': 'Headquarters & Division',
      'km': 'ទីស្នាក់ការកណ្តាល & ផ្នែក',
    },
    'reporting_manager': {
      'en': 'Reporting Manager (ASM)',
      'km': 'អ្នកគ្រប់គ្រងផ្ទាល់ (ASM)',
    },

    // ----------------------------------------------------
    // BOTTOM NAVIGATION TABS
    // ----------------------------------------------------
    'tab_dashboard': {
      'en': 'DASHBOARD',
      'km': 'ផ្ទាំងព័ត៌មាន',
    },
    'tab_work': {
      'en': 'WORK',
      'km': 'ការងារ',
    },
    'tab_reports': {
      'en': 'REPORTS',
      'km': 'របាយការណ៍',
    },
    'tab_utilities': {
      'en': 'UTILITIES',
      'km': 'ឧបករណ៍',
    },
    'tab_profile': {
      'en': 'PROFILE',
      'km': 'ប្រវត្តិរូប',
    },

    // ----------------------------------------------------
    // DASHBOARD TAB
    // ----------------------------------------------------
    'stat_doctors': {
      'en': 'Doctors',
      'km': 'វេជ្ជបណ្ឌិត',
    },
    'stat_chemist': {
      'en': 'Chemist/Stockist',
      'km': 'ឱសថស្ថាន/ស្តុក',
    },
    'stat_7_days': {
      'en': '7 Days Calls',
      'km': 'ការជួប ៧ ថ្ងៃ',
    },
    'stat_30_days': {
      'en': '30 Days Calls',
      'km': 'ការជួប ៣០ ថ្ងៃ',
    },
    'work_status': {
      'en': 'WORK STATUS',
      'km': 'ស្ថានភាពការងារ',
    },
    'no_work_started': {
      'en': 'No Work Started',
      'km': 'មិនទាន់ចាប់ផ្តើមការងារ',
    },
    'working_in_field': {
      'en': 'Working - In Field',
      'km': 'កំពុងធ្វើការ - ក្នុងទីលាន',
    },
    'started_at': {
      'en': 'STARTED AT',
      'km': 'ចាប់ផ្តើមនៅម៉ោង',
    },
    'no_working_hours': {
      'en': 'No working hours data',
      'km': 'គ្មានទិន្នន័យម៉ោងធ្វើការ',
    },
    'start_work': {
      'en': 'START WORK',
      'km': 'ចាប់ផ្តើមការងារ',
    },
    'end_work': {
      'en': 'END WORK',
      'km': 'បញ្ចប់ការងារ',
    },
    'today': {
      'en': 'TODAY',
      'km': 'ថ្ងៃនេះ',
    },
    'live': {
      'en': 'Live',
      'km': 'ផ្ទាល់',
    },
    'scan_detail': {
      'en': 'Scan Detail',
      'km': 'ស្កេនមើលព័ត៌មាន',
    },
    'promo_trust': {
      'en': '5 YEARS OF TRUST • Over 25000 Patients',
      'km': 'ទំនុកចិត្ត ៥ ឆ្នាំ • អ្នកជំងឺជាង ២៥,០០០ នាក់',
    },
    'promo_tagline': {
      'en': 'Trusted Mobility Partner...',
      'km': 'ដៃគូជឿទុកចិត្តសម្រាប់ចលនារាងកាយ...',
    },

    // ----------------------------------------------------
    // WORK GRID CARDS (12 items)
    // ----------------------------------------------------
    'work_reporting': {
      'en': 'Reporting',
      'km': 'ការរាយការណ៍',
    },
    'work_tour_plan': {
      'en': 'Tour Plan',
      'km': 'ផែនការធ្វើដំណើរ',
    },
    'work_expenditure': {
      'en': 'Expenditure',
      'km': 'ការចំណាយ',
    },
    'work_pob': {
      'en': 'POB',
      'km': 'ការកុម្ម៉ង់ (POB)',
    },
    'work_secondary_sales': {
      'en': 'Secondary Sales',
      'km': 'ការលក់បន្ត',
    },
    'work_rcpa': {
      'en': 'RCPA',
      'km': 'សវនកម្ម (RCPA)',
    },
    'work_sponsor': {
      'en': 'Sponsor',
      'km': 'ឧបត្ថម្ភ',
    },
    'work_scheme': {
      'en': 'Scheme',
      'km': 'ការបញ្ចុះតម្លៃ',
    },
    'work_e_detailing': {
      'en': 'E-detailing',
      'km': 'បង្ហាញព័ត៌មាន E-Detail',
    },
    'work_video_library': {
      'en': 'Video Library',
      'km': 'បណ្ណាល័យវីដេអូ',
    },
    'work_products': {
      'en': 'Products',
      'km': 'ផលិតផល',
    },
    'work_returns': {
      'en': 'Returns',
      'km': 'ការប្រគល់ទំនិញ',
    },
    'work_manage': {
      'en': 'Manage',
      'km': 'គ្រប់គ្រង',
    },

    // ----------------------------------------------------
    // UTILITIES GRID CARDS (8 items)
    // ----------------------------------------------------
    'util_notes': {
      'en': 'Notes',
      'km': 'កំណត់ចំណាំ',
    },
    'util_holiday': {
      'en': 'Holidays',
      'km': 'ថ្ងៃឈប់សម្រាក',
    },
    'util_apply_leave': {
      'en': 'Apply Leave',
      'km': 'សុំច្បាប់សម្រាក',
    },
    'util_check_distance_nearby': {
      'en': 'Distance / Nearby',
      'km': 'ចម្ងាយ / ក្បែរនេះ',
    },
    'util_calculator': {
      'en': 'Calculator',
      'km': 'ម៉ាស៊ីនគិតលេខ',
    },
    'util_user_guide': {
      'en': 'User Guide',
      'km': 'សៀវភៅណែនាំ',
    },

    // ----------------------------------------------------
    // REPORTS GRID CARDS (10 items)
    // ----------------------------------------------------
    'rep_doctor_report': {
      'en': 'Doctor Report',
      'km': 'របាយការណ៍វេជ្ជបណ្ឌិត',
    },
    'rep_chemist_report': {
      'en': 'Chemist Report',
      'km': 'របាយការណ៍ឱសថស្ថាន',
    },
    'rep_other_reports': {
      'en': 'Other Report',
      'km': 'របាយការណ៍ផ្សេងៗ',
    },
    'rep_primary_sales': {
      'en': 'Primary Sales Report',
      'km': 'របាយការណ៍ការលក់ដំបូង',
    },
    'rep_sample_report': {
      'en': 'Sample Report',
      'km': 'របាយការណ៍គំរូថ្នាំ',
    },
    'rep_order_history': {
      'en': 'Order History',
      'km': 'ប្រវត្តិនៃការកុម្ម៉ង់',
    },
    'rep_attendance_report': {
      'en': 'Attendance Report',
      'km': 'របាយការណ៍វត្តមាន',
    },
    'rep_expenses_report': {
      'en': 'Expense Report',
      'km': 'របាយការណ៍ចំណាយ',
    },
    'rep_target_performance': {
      'en': 'Target Performance',
      'km': 'លទ្ធផលគោលដៅ',
    },
    'rep_total_matrix': {
      'en': 'Total Matrix',
      'km': 'ម៉ាទ្រីសសរុប',
    },

    // ----------------------------------------------------
    // PROFILE GRID CARDS (3 items)
    // ----------------------------------------------------
    'prof_my_profile': {
      'en': 'My Profile',
      'km': 'ប្រវត្តិរូបខ្ញុំ',
    },
    'prof_notification': {
      'en': 'Notification',
      'km': 'ការជូនដំណឹង',
    },
    'prof_announcement': {
      'en': 'Announcement',
      'km': 'សេចក្តីប្រកាស',
    },
    'prof_mobile_settings': {
      'en': 'Mobile Settings',
      'km': 'ការកំណត់ទូរស័ព្ទ',
    },
    'prof_app_settings': {
      'en': 'App Settings',
      'km': 'ការកំណត់កម្មវិធី',
    },
    'prof_security': {
      'en': 'Security',
      'km': 'សុវត្ថិភាព',
    },
    'prof_help_support': {
      'en': 'Help & Support',
      'km': 'ជំនួយ និងការគាំទ្រ',
    },

    // ----------------------------------------------------
    // DIALOGS & ACTIONS
    // ----------------------------------------------------
    'start_work_title': {
      'en': 'Start Field Work?',
      'km': 'ចាប់ផ្តើមការងារទីលាន?',
    },
    'start_work_desc': {
      'en': 'This will punch in your attendance, start live GPS field tracking, and enable doctor call recording for today.',
      'km': 'សកម្មភាពនេះនឹងកត់ត្រាវត្តមាន ចាប់ផ្តើមតាមដាន GPS ផ្ទាល់ និងបើកការកត់ត្រាការជួបវេជ្ជបណ្ឌិតសម្រាប់ថ្ងៃនេះ។',
    },
    'end_work_title': {
      'en': 'End Today\'s Work?',
      'km': 'បញ្ចប់ការងារថ្ងៃនេះ?',
    },
    'cancel': {
      'en': 'Cancel',
      'km': 'បោះបង់',
    },
    'close': {
      'en': 'Close',
      'km': 'បិទ',
    },
    'submit': {
      'en': 'Submit',
      'km': 'ដាក់ស្នើ',
    },
    'save': {
      'en': 'Save',
      'km': 'រក្សាទុក',
    },
    'download': {
      'en': 'Download PDF',
      'km': 'ទាញយក PDF',
    },
    'keep_working': {
      'en': 'Keep Working',
      'km': 'បន្តធ្វើការ',
    },
    'end_punch_out': {
      'en': 'End & Punch Out',
      'km': 'បញ្ចប់ & ចាកចេញ',
    },
    'ai_assistant_title': {
      'en': 'Alleviare AI Assistant',
      'km': 'ជំនួយការ AI អាឡេវីយ៉ា (Alleviare)',
    },
    'ai_assistant_subtitle': {
      'en': 'Online • Instant Sales & Product Intelligence',
      'km': 'ដំណើរការ • ព័ត៌មានលក់ និងផលិតផលភ្លាមៗ',
    },
    'ask_anything': {
      'en': 'Ask anything about schemes, doctors, POB...',
      'km': 'សួរអំពីការបញ្ចុះតម្លៃ វេជ្ជបណ្ឌិត ការកុម្ម៉ង់ទំនិញ...',
    },
    'select_language': {
      'en': 'Select Language',
      'km': 'ជ្រើសរើសភាសា',
    },
    'select_currency': {
      'en': 'Select Currency',
      'km': 'ជ្រើសរើសរូបិយប័ណ្ណ',
    },
    'currency_usd_desc': {
      'en': 'US Dollar (\$ USD)',
      'km': 'ដុល្លារអាមេរិក (\$ USD)',
    },
    'currency_khr_desc': {
      'en': 'Cambodian Riel (៛ KHR)',
      'km': 'រៀលកម្ពុជា (៛ KHR)',
    },
  };

  static String get(String key, AppLanguage language) {
    final map = _localizedValues[key];
    if (map == null) return key;
    return map[language.code] ?? map['en'] ?? key;
  }
}
